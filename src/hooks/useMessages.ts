// ============================================
// FILE: src/hooks/useMessages.ts
// ============================================

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useMessages(conversationId: string | undefined) {
	const messages = useQuery(
		api.messages.getMessagesByConversation,
		conversationId ? { conversationId } : "skip"
	);

	const sendMessage = useMutation(api.messages.sendMessage);
	const markAsRead = useMutation(api.messages.markMessagesAsRead);

	return {
		messages: messages || [],
		isLoading: messages === undefined,
		sendMessage,
		markAsRead,
	};
}

export function useConversations(userId: Id<"users"> | undefined) {
	const conversations = useQuery(
		api.conversations.getUserConversations,
		userId ? { userId } : "skip"
	);

	return {
		conversations: conversations || [],
		isLoading: conversations === undefined,
	};
}