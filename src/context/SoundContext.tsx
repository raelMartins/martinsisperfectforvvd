"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type ChatSound = "typing" | "sent" | "received";

type AudioGraph = { context: AudioContext; bus: AudioNode };

type SoundContextValue = {
  isMuted: boolean;
  toggleMuted: () => void;
  playSound: (sound: ChatSound) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "chat-sounds-muted";
const SETTINGS_EVENT = "chat-sounds-setting-change";

function subscribeToMutedSetting(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SETTINGS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SETTINGS_EVENT, onStoreChange);
  };
}

function getMutedSetting() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function addTone(
  bus: AudioNode,
  start: number,
  frequency: number,
  duration: number,
  volume: number,
  endFrequency = frequency,
) {
  const context = bus.context;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(bus);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.01);
}

function synthesizeSound(
  bus: AudioNode,
  sound: ChatSound,
  typingVariation: number,
) {
  const context = bus.context;
  const now = context.currentTime + 0.005;

  if (sound === "typing") {
    // A very short key-click with slight alternating pitch. Kept well under
    // the alerts because it fires on every keystroke.
    addTone(bus, now, 920 + typingVariation * 55, 0.035, 0.11, 690);
    return;
  }

  if (sound === "sent") {
    // A compact rising confirmation inspired by a message-send swoosh.
    addTone(bus, now, 430, 0.14, 0.3, 980);
    addTone(bus, now + 0.035, 690, 0.12, 0.17, 1320);
    return;
  }

  // A clean, neutral three-note incoming alert.
  addTone(bus, now, 740, 0.1, 0.28);
  addTone(bus, now + 0.085, 930, 0.1, 0.33);
  addTone(bus, now + 0.17, 660, 0.14, 0.26);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const isMuted = useSyncExternalStore(
    subscribeToMutedSetting,
    getMutedSetting,
    () => false,
  );
  const audioGraphRef = useRef<AudioGraph | null>(null);
  const typingVariationRef = useRef(0);
  const lastTypingSoundAtRef = useRef(0);

  const getAudioGraph = useCallback(() => {
    const existing = audioGraphRef.current;
    if (existing && existing.context.state !== "closed") return existing;

    const context = new AudioContext({ latencyHint: "interactive" });
    // Tones are loud enough that a keystroke landing on top of an alert can
    // sum past full scale, so everything runs through a limiter rather than
    // connecting straight to the output and hard-clipping.
    const bus = new DynamicsCompressorNode(context, {
      threshold: -8,
      knee: 6,
      ratio: 12,
      attack: 0.002,
      release: 0.12,
    });
    bus.connect(context.destination);

    const graph = { context, bus };
    audioGraphRef.current = graph;
    return graph;
  }, []);

  useEffect(() => {
    // Browsers require audio to be unlocked from a user gesture.
    const unlockAudio = () => {
      const { context } = getAudioGraph();
      if (context.state === "suspended") void context.resume();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      const context = audioGraphRef.current?.context;
      if (context && context.state !== "closed") void context.close();
    };
  }, [getAudioGraph]);

  const toggleMuted = useCallback(() => {
    const next = !getMutedSetting();
    window.localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new Event(SETTINGS_EVENT));

    if (!next) {
      const { context } = getAudioGraph();
      if (context.state === "suspended") void context.resume();
    }
  }, [getAudioGraph]);

  const playSound = useCallback(
    (sound: ChatSound) => {
      if (isMuted) return;

      const now = performance.now();
      if (sound === "typing") {
        if (now - lastTypingSoundAtRef.current < 42) return;
        lastTypingSoundAtRef.current = now;
        typingVariationRef.current = (typingVariationRef.current + 1) % 3;
      }

      const { context, bus } = getAudioGraph();
      if (context.state === "suspended") {
        void context.resume();
        return;
      }

      synthesizeSound(bus, sound, typingVariationRef.current);
    },
    [getAudioGraph, isMuted],
  );

  const value = useMemo(
    () => ({ isMuted, toggleMuted, playSound }),
    [isMuted, playSound, toggleMuted],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
}
