// ============================================
// FILE: src/components/loading/ProfileSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <Skeleton circle width={120} height={120} />
          <div className="flex-1 space-y-3">
            <Skeleton height={32} width="40%" />
            <Skeleton height={20} width="30%" />
            <div className="flex gap-2">
              <Skeleton height={36} width={120} />
              <Skeleton height={36} width={120} />
            </div>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card className="p-6">
        <Skeleton height={24} width={200} className="mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton height={16} width={100} className="mb-2" />
              <Skeleton height={44} />
            </div>
          ))}
          <div className="flex justify-end gap-4">
            <Skeleton height={44} width={100} />
            <Skeleton height={44} width={120} />
          </div>
        </div>
      </Card>
    </div>
  );
}