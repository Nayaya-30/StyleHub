import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Stage = "cutting" | "sewing" | "finishing";
type Status = "pending" | "in_progress" | "completed";

type StageInfo = { status: Status; startedAt?: number; completedAt?: number; notes?: string };
type Progress = { cutting: StageInfo; sewing: StageInfo; finishing: StageInfo };

type Props = { progress: Progress };

export function OrderTimeline({ progress }: Props) {
  const stages: Stage[] = ["cutting", "sewing", "finishing"];
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => {
          const s = progress[stage];
          const label = stage.charAt(0).toUpperCase() + stage.slice(1);
          const color = s.status === "completed" ? "success" : s.status === "in_progress" ? "warning" : "muted";
          return (
            <div key={stage} className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={s.status === "completed" ? "outline" : "secondary"}>{label}</Badge>
                <span className={`text-xs ${color === "success" ? "text-success-500" : color === "warning" ? "text-warning-500" : "text-muted-foreground"}`}>{s.status.replace("_", " ")}</span>
              </div>
              {i < stages.length - 1 && <Separator className="my-4" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

