// ============================================
// FILE: src/app/messages/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatSkeleton } from "@/components/loading/ChatSkeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Search,
	MessageSquare,
	Phone,
	Video,
	MoreVertical,
	Send,
	Paperclip,
	Smile,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
	const { user } = useUser();
	const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
	const [messageInput, setMessageInput] = useState("");

	const conversations = useQuery(
		api.conversations.getUserConversations,
		user?._id ? { userId: user._id } : "skip"
	);

	const messages = useQuery(
		api.messages.getMessagesByConversation,
		selectedConversation ? { conversationId: selectedConversation, limit: 50 } : "skip"
	);

	const isLoading = conversations === undefined;

	if (isLoading) {
		return (
			<DashboardLayout>
				<SkeletonWrapper>
					<ChatSkeleton />
				</SkeletonWrapper>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="h-[calc(100vh-8rem)] flex gap-4">
				{/* Conversations List */}
				<Card className="w-80 flex flex-col overflow-hidden">
					<div className="p-4 border-b border-border">
						<h2 className="font-semibold mb-3">Messages</h2>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input type="search" placeholder="Search conversations..." className="pl-10" />
						</div>
					</div>

					<div className="flex-1 overflow-y-auto divide-y divide-border">
						{conversations && conversations.length > 0 ? (
							conversations.map((conversation) => {
								const unreadCount = user?._id
									? conversation.unreadCounts[user._id] || 0
									: 0;
								const isSelected = selectedConversation === conversation._id;

								return (
									<button
										key={conversation._id}
										onClick={() => setSelectedConversation(conversation._id)}
										className={cn(
											"w-full p-4 flex gap-3 hover:bg-accent transition-colors text-left",
											isSelected && "bg-accent"
										)}
									>
										<Avatar className="h-12 w-12 flex-shrink-0">
											<AvatarImage src="" />
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<span className="font-semibold truncate">Conversation</span>
												{conversation.lastMessage && (
													<span className="text-xs text-muted-foreground">
														{formatTime(conversation.lastMessage.timestamp)}
													</span>
												)}
											</div>
											{conversation.lastMessage && (
												<p className="text-sm text-muted-foreground truncate">
													{conversation.lastMessage.content}
												</p>
											)}
										</div>
										{unreadCount > 0 && (
											<Badge variant="default" className="h-5 px-2">
												{unreadCount}
											</Badge>
										)}
									</button>
								);
							})
						) : (
							<div className="p-8">
								<EmptyState
									icon={MessageSquare}
									title="No messages yet"
									description="Start a conversation to get started"
								/>
							</div>
						)}
					</div>
				</Card>

				{/* Chat Window */}
				<Card className="flex-1 flex flex-col overflow-hidden">
					{selectedConversation ? (
						<>
							{/* Chat Header */}
							<div className="p-4 border-b border-border flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Avatar className="h-10 w-10">
										<AvatarImage src="" />
										<AvatarFallback>U</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold">User Name</div>
										<div className="text-sm text-muted-foreground">Online</div>
									</div>
								</div>
								<div className="flex gap-2">
									<Button variant="ghost" size="icon">
										<Phone className="h-5 w-5" />
									</Button>
									<Button variant="ghost" size="icon">
										<Video className="h-5 w-5" />
									</Button>
									<Button variant="ghost" size="icon">
										<MoreVertical className="h-5 w-5" />
									</Button>
								</div>
							</div>

							{/* Messages */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{messages?.map((message) => {
									const isSent = message.senderId === user?._id;
									return (
										<div
											key={message._id}
											className={cn("flex", isSent ? "justify-end" : "justify-start")}
										>
											<div
												className={cn(
													"max-w-[70%] rounded-lg p-3",
													isSent
														? "bg-primary text-primary-foreground"
														: "bg-muted text-foreground"
												)}
											>
												<div className="text-sm">{message.content}</div>
												<div
													className={cn(
														"text-xs mt-1",
														isSent ? "text-primary-foreground/70" : "text-muted-foreground"
													)}
												>
													{formatTime(message.createdAt)}
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Message Input */}
							<div className="p-4 border-t border-border">
								<div className="flex gap-2">
									<Button variant="ghost" size="icon">
										<Paperclip className="h-5 w-5" />
									</Button>
									<Input
										placeholder="Type a message..."
										value={messageInput}
										onChange={(e) => setMessageInput(e.target.value)}
										className="flex-1"
									/>
									<Button variant="ghost" size="icon">
										<Smile className="h-5 w-5" />
									</Button>
									<Button size="icon">
										<Send className="h-5 w-5" />
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center">
							<EmptyState
								icon={MessageSquare}
								title="Select a conversation"
								description="Choose a conversation from the left to start messaging"
							/>
						</div>
					)}
				</Card>
			</div>
		</DashboardLayout>
	);
}