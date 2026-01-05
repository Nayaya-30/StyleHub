"use client";
import { useState } from "react";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

type Conversation = { _id: string; title: string; unreadCount?: number; lastMessageAt?: number };
type Message = { _id: string; content: string; createdAt: number; authorId: string };

type Props = {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  currentUserId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, content: string) => void;
  activeConversationId?: string;
};

export function ChatInterface({ conversations, messagesByConversation, currentUserId, activeConversationId, onSelectConversation, onSendMessage }: Props) {
  const [draft, setDraft] = useState("");
  const activeId = activeConversationId ?? conversations[0]?._id;
  const messages = activeId ? messagesByConversation[activeId] ?? [] : [];
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <ConversationList conversations={conversations} activeId={activeId} onSelect={onSelectConversation} />
      </div>
      <div className="col-span-2 space-y-3">
        <MessageList messages={messages} currentUserId={currentUserId} />
        <MessageInput
          onSend={(content) => {
            if (!activeId) return;
            onSendMessage(activeId, content);
            setDraft("");
          }}
        />
      </div>
    </div>
  );
}

