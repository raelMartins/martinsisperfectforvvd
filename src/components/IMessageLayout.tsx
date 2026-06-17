"use client";

import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import type { Conversation, Message } from "@/types/message";

type IMessageLayoutProps = {
  conversations: Conversation[];
  activeConversation: Conversation;
  messages: Message[];
};

function IMessageShell({
  conversations,
  activeConversation,
  messages,
}: IMessageLayoutProps) {
  const { colors, theme } = useTheme();

  return (
    <div
      className="flex h-dvh w-full overflow-hidden p-3 transition-colors duration-300"
      style={{ backgroundColor: colors.appBg }}
      data-theme={theme}
    >
      <div
        className="mx-auto flex h-full w-full max-w-6xl overflow-hidden rounded-xl border shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-colors duration-300"
        style={{
          backgroundColor: colors.windowBg,
          borderColor: colors.border,
        }}
      >
        <Sidebar
          conversations={conversations}
          activeId={activeConversation.id}
        />
        <ChatWindow conversation={activeConversation} messages={messages} />
      </div>
    </div>
  );
}

export default function IMessageLayout(props: IMessageLayoutProps) {
  return (
    <ThemeProvider>
      <IMessageShell {...props} />
    </ThemeProvider>
  );
}
