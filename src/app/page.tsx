import IMessageLayout from "@/components/IMessageLayout";
import { conversation, messages } from "@/data/messagesData";

export default function Home() {
  return (
    <IMessageLayout activeConversation={conversation} messages={messages} />
  );
}
