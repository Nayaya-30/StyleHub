"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = { orderId: string; organizationId: string; styleId: string; customerId: string };

export function ReviewForm({ orderId, organizationId, styleId, customerId }: Props) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const create = useMutation(api.reviews.createReview);
  const onSubmit = async () => {
    await create({ orderId, organizationId, styleId, customerId, rating, title, content });
    toast("Review submitted");
    setRating(5);
    setTitle("");
    setContent("");
  };
  return (
    <Card className="p-4 space-y-3">
      <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} placeholder="Rating" />
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <Button onClick={onSubmit}>Submit Review</Button>
    </Card>
  );
}

