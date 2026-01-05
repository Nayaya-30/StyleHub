"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = { organizationId: string; invitedBy: string };

export function InviteForm({ organizationId, invitedBy }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"org_admin" | "manager" | "worker">("worker");
  const create = useMutation(api.invitations.createInvitation);
  const onSubmit = async () => {
    await create({ organizationId, email, role, invitedBy });
    toast("Invitation sent");
    setEmail("");
    setRole("worker");
  };
  return (
    <Card className="p-4 space-y-3">
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <select className="rounded border p-2 text-sm" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
        <option value="worker">Worker</option>
        <option value="manager">Manager</option>
        <option value="org_admin">Admin</option>
      </select>
      <Button onClick={onSubmit}>Send Invite</Button>
    </Card>
  );
}

