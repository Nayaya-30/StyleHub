import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Notification = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  createdAt: number;
  actionUrl?: string;
};

type Props = { notification: Notification; onDismiss?: () => void };

export function NotificationItem({ notification, onDismiss }: Props) {
  const priorityColor = notification.priority === "high" ? "text-destructive" : notification.priority === "medium" ? "text-warning-500" : "text-muted-foreground";
  return (
    <Card className="p-4 flex items-start justify-between">
      <div>
        <div className={`font-medium ${priorityColor}`}>{notification.title}</div>
        {notification.description && <div className="text-sm text-muted-foreground">{notification.description}</div>}
      </div>
      <div className="flex items-center gap-2">
        {notification.actionUrl && (
          <a href={notification.actionUrl} target="_blank" rel="noreferrer">
            <Button size="sm">Open</Button>
          </a>
        )}
        <Button size="sm" variant="outline" onClick={onDismiss}>Dismiss</Button>
      </div>
    </Card>
  );
}

