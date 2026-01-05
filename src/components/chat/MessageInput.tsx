"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = { onSend: (content: string) => void };

export function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState("");
  const send = () => {
    const v = value.trim();
    if (v.length === 0) return;
    onSend(v);
    setValue("");
  };
  return (
    <div className="flex gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type a message" />
      <Button onClick={send}>Send</Button>
    </div>
  );
}

