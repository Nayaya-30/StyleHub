"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = { organizationId: string; initial?: { name: string; slug: string; description?: string } };

export function OrganizationForm({ organizationId, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const save = useMutation(api.organisations.updateOrganizationSettings);

  const onSubmit = async () => {
    const data = { name: name.trim(), slug: slug.trim(), description: description.trim() };
    await save({ organizationId, settings: { description: data.description } });
    toast("Organization updated");
  };

  return (
    <Card className="p-4 space-y-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
      <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <Button onClick={onSubmit}>{initial ? "Save" : "Create"}</Button>
    </Card>
  );
}
