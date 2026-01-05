import { Card } from "@/components/ui/card";

type Message = { _id: string; content: string; createdAt: number; authorId: string };
type Props = { messages: Message[]; currentUserId: string };

export function MessageList({ messages, currentUserId }: Props) {
  return (
    <Card className="p-2 space-y-2">
      {messages.map((m) => (
        <div key={m._id} className={`max-w-[70%] rounded p-2 text-sm ${m.authorId === currentUserId ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>{m.content}</div>
      ))}
    </Card>
  );
}

