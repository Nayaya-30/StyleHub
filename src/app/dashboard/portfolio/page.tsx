"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  const { user } = useUser();
  const items = useQuery(api.workerPortfolio.getWorkerPortfolio, user?._id ? { workerId: user._id } : "skip");
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Showcase your completed works</p>
        </div>
        <Link href="/dashboard/portfolio/create" className="rounded bg-primary px-4 py-2 text-primary-foreground">Add Item</Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => (
          <div key={item._id} className="rounded border">
            <div className="relative aspect-square">
              {item.images[0] && (
                <Image src={item.images[0].url} alt={item.images[0].alt || item.title} fill className="object-cover" />
              )}
            </div>
            <div className="p-3">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.category}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

