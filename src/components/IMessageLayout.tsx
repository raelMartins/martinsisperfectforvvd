"use client";

import BackgroundCanvas from "@/components/BackgroundCanvas";
import ChatFooter from "@/components/ChatFooter";
import ChatHeader from "@/components/ChatHeader";
import ChatThread from "@/components/ChatThread";
import PromptGalleryModal from "@/components/PromptGalleryModal";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { LAYOUT } from "@/constants/layout";
import { ConversationProvider } from "@/context/ConversationContext";
import { AutoScrollProvider } from "@/context/AutoScrollContext";
import { ModalProvider } from "@/context/ModalContext";
import { MotionProvider } from "@/context/MotionContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import type { Conversation, Message } from "@/types/message";

type IMessageLayoutProps = {
  activeConversation: Conversation;
  messages: Message[];
};

function IMessageShell({ activeConversation, messages }: IMessageLayoutProps) {
  const { colors, theme } = useTheme();

  return (
    <div
      className="relative w-full"
      style={{
        height: LAYOUT.scrubTrackHeight,
        backgroundColor: colors.chatBg,
      }}
      data-theme={theme}
    >
      <BackgroundCanvas />

      {/* Sticky camera — UI never leaves the viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="relative mx-auto flex h-full w-full flex-col"
          style={{ maxWidth: LAYOUT.columnMaxWidth }}
        >
          <ConversationProvider messages={messages}>
            <AutoScrollProvider>
              <ChatHeader
                conversation={activeConversation}
                unreadCount={messages.length}
              />
              <ChatThread />
              <ChatFooter />
            </AutoScrollProvider>
          </ConversationProvider>
        </div>
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
