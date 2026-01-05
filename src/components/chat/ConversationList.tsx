import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Conversation = { _id: string; title: string; lastMessageAt?: number; unreadCount?: number };
type Props = { conversations: Conversation[]; activeId?: string; onSelect: (id: string) => void };

export function ConversationList({ conversations, activeId, onSelect }: Props) {
  return (
    <Card className="p-2">
      {conversations.map((c, i) => (
        <button key={c._id} className={`flex w-full items-center justify-between rounded p-2 text-left ${activeId === c._id ? "bg-muted" : ""}`} onClick={() => onSelect(c._id)}>
          <span className="text-sm font-medium">{c.title}</span>
          {typeof c.unreadCount === "number" && c.unreadCount > 0 && <span className="rounded bg-primary px-2 text-xs text-primary-foreground">{c.unreadCount}</span>}
        </button>
      ))}
      <Separator className="mt-2" />
    </Card>
  );
}

