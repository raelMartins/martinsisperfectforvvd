"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const DOT_DELAYS = [0, 0.15, 0.3];

export default function TypingIndicator() {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex w-full justify-start"
    >
      <div
        className="flex items-center gap-[5px] rounded-[20px] rounded-bl-md px-4 py-3"
        style={{ backgroundColor: colors.theirBubble }}
      >
        {DOT_DELAYS.map((delay) => (
          <motion.span
            key={delay}
            className="h-[7px] w-[7px] rounded-full"
            style={{ backgroundColor: colors.typingDot }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.55,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
