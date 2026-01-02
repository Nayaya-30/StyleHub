// ============================================
// FILE: src/hooks/useNotifications.ts
// ============================================

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useNotifications(userId: Id<"users"> | undefined) {
	const notifications = useQuery(
		api.notifications.getUserNotifications,
		userId ? { userId } : "skip"
	);

	const unreadCount = useQuery(
		api.notifications.getUnreadNotificationCount,
		userId ? { userId } : "skip"
	);

	const markAsRead = useMutation(api.notifications.markNotificationAsRead);
	const markAllAsRead = useMutation(api.notifications.markAllNotificationsAsRead);
	const deleteNotification = useMutation(api.notifications.deleteNotification);

	return {
		notifications: notifications || [],
		unreadCount: unreadCount || 0,
		markAsRead,
		markAllAsRead,
		deleteNotification,
	};
}