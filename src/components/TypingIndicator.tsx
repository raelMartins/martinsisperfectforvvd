"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const DOT_DELAYS = [0, 0.15, 0.3];

type TypingIndicatorProps = {
  scrollDriven?: boolean;
};

export default function TypingIndicator({
  scrollDriven = false,
}: TypingIndicatorProps) {
  const { colors } = useTheme();

  const bubble = (
    <div
      className="flex items-center gap-1.5 rounded-[18px] rounded-bl-lg px-4 py-3 sm:gap-2 sm:rounded-[22px] sm:px-5 sm:py-4 md:rounded-[26px] md:px-6 md:py-4 lg:rounded-[28px] lg:px-7 lg:py-5"
      style={{ backgroundColor: colors.theirBubble }}
    >
      {DOT_DELAYS.map((delay) => (
        <motion.span
          key={delay}
          className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3"
          style={{ backgroundColor: colors.typingDot }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
      ))}
    </div>
  );

  if (scrollDriven) {
    return (
      <motion.div layout className="flex w-full justify-start">
        {bubble}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex w-full justify-start"
    >
      {bubble}
    </motion.div>
  );
}
