"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = { userId: string; initial?: { name?: string; phone?: string } };

export function ProfileForm({ userId, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const update = useMutation(api.users.updateUserProfile);
  const onSubmit = async () => {
    await update({ userId, profile: { name: name.trim(), phone: phone.trim() } });
    toast("Profile updated");
  };
  return (
    <Card className="p-4 space-y-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
      <Button onClick={onSubmit}>Save</Button>
    </Card>
  );
}

