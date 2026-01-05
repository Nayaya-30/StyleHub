"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = { roomName: string; status: "active" | "ended"; onEnd: () => void };

export function HuddleInterface({ roomName, status, onEnd }: Props) {
  return (
    <Card className="p-4 space-y-3">
      <div className="text-sm text-muted-foreground">Room</div>
      <div className="text-lg font-semibold">{roomName}</div>
      <div className="text-sm">Status: {status}</div>
      {status === "active" && (
        <Button onClick={onEnd}>End Session</Button>
      )}
    </Card>
  );
}

