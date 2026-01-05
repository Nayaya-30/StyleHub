import { Card } from "@/components/ui/card";

type Props = { title: string; value: number | string; subtitle?: string };

export function StatsCard({ title, value, subtitle }: Props) {
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </Card>
  );
}

