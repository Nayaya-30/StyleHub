import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Review = {
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
  isVerified: boolean;
  createdAt: number;
};

type Props = { review: Review };

export function ReviewCard({ review }: Props) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold">{review.rating.toFixed(1)}★</div>
        {review.isVerified && <Badge variant="outline">Verified</Badge>}
      </div>
      {review.title && <div className="font-medium">{review.title}</div>}
      <div className="text-sm text-muted-foreground">{review.content}</div>
      {review.pros && review.pros.length > 0 && (
        <div className="text-sm">
          <span className="font-medium">Pros:</span> {review.pros.join(", ")}
        </div>
      )}
      {review.cons && review.cons.length > 0 && (
        <div className="text-sm">
          <span className="font-medium">Cons:</span> {review.cons.join(", ")}
        </div>
      )}
    </Card>
  );
}

