// ============================================
// FILE: src/app/onboarding/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Scissors, User, Briefcase, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [role, setRole] = useState<"customer" | "worker" | "org_admin">("customer");
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateProfile({
        userId: user._id,
        role,
      });

      toast.success("Profile setup complete!");
      
      if (role === "customer") {
        router.push("/dashboard");
      } else if (role === "worker") {
        router.push("/dashboard/tasks");
      } else {
        router.push("/dashboard/organization");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "customer",
      icon: User,
      title: "Customer",
      description: "Browse styles and place orders",
    },
    {
      value: "worker",
      icon: Briefcase,
      title: "Worker",
      description: "Complete tasks and build your portfolio",
    },
    {
      value: "org_admin",
      icon: Building2,
      title: "Organization Admin",
      description: "Manage your tailoring business",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to StyleHub!</CardTitle>
          <p className="text-muted-foreground">
            Let&apos;s get you set up. Choose your role to continue.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={role} onValueChange={(value) => setRole(value as typeof role)}>
            <div className="space-y-4">
              {roleOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                    role === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <option.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{option.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>

          <Button
            size="lg"
            className="w-full"
            onClick={handleComplete}
            loading={isLoading}
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
