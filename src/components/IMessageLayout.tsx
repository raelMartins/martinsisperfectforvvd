"use client";

import BackgroundCanvas from "@/components/BackgroundCanvas";
import ChatFooter from "@/components/ChatFooter";
import ChatHeader from "@/components/ChatHeader";
import ChatThread from "@/components/ChatThread";
import PromptGalleryModal from "@/components/PromptGalleryModal";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { LAYOUT } from "@/constants/layout";
import { ConversationProvider } from "@/context/ConversationContext";
import { ModalProvider } from "@/context/ModalContext";
import { MotionProvider } from "@/context/MotionContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import type { Conversation, Message } from "@/types/message";

type IMessageLayoutProps = {
  activeConversation: Conversation;
  messages: Message[];
};

function IMessageShell({
  activeConversation,
  messages,
}: IMessageLayoutProps) {
  const { colors, theme } = useTheme();

  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: colors.chatBg }}
      data-theme={theme}
    >
      <BackgroundCanvas />

      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: LAYOUT.columnMaxWidth }}
      >
        <ConversationProvider messages={messages}>
          <ChatHeader
            conversation={activeConversation}
            unreadCount={messages.length}
          />
          <ChatThread />
          <ChatFooter />
        </ConversationProvider>
      </div>

      <VideoPlayerModal />
      <PromptGalleryModal />
    </div>
  );
}

export default function IMessageLayout(props: IMessageLayoutProps) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <ModalProvider>
          <IMessageShell {...props} />
        </ModalProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
