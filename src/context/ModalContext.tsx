"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { VideoModalPayload } from "@/types/message";

type ModalContextValue = {
  videoModal: VideoModalPayload | null;
  openVideoModal: (payload: VideoModalPayload) => void;
  closeVideoModal: () => void;
  isPromptGalleryOpen: boolean;
  openPromptGallery: () => void;
  closePromptGallery: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [videoModal, setVideoModal] = useState<VideoModalPayload | null>(null);
  const [isPromptGalleryOpen, setIsPromptGalleryOpen] = useState(false);

  const openVideoModal = useCallback((payload: VideoModalPayload) => {
    setVideoModal(payload);
  }, []);

  const closeVideoModal = useCallback(() => {
    setVideoModal(null);
  }, []);

  const openPromptGallery = useCallback(() => {
    setIsPromptGalleryOpen(true);
  }, []);

  const closePromptGallery = useCallback(() => {
    setIsPromptGalleryOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      videoModal,
      openVideoModal,
      closeVideoModal,
      isPromptGalleryOpen,
      openPromptGallery,
      closePromptGallery,
    }),
    [
      videoModal,
      openVideoModal,
      closeVideoModal,
      isPromptGalleryOpen,
      openPromptGallery,
      closePromptGallery,
    ],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}
