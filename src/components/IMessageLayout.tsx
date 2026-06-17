import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import type { Conversation, Message } from "@/types/message";

type IMessageLayoutProps = {
  conversations: Conversation[];
  activeConversation: Conversation;
  messages: Message[];
};

export default function IMessageLayout({
  conversations,
  activeConversation,
  messages,
}: IMessageLayoutProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#ececec] p-3">
      <div className="mx-auto flex h-full w-full max-w-6xl overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
        <Sidebar
          conversations={conversations}
          activeId={activeConversation.id}
        />
        <ChatWindow conversation={activeConversation} messages={messages} />
      </div>
    </div>
  );
}
