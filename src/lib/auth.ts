// ============================================
// FILE: src/lib/auth.ts
// ============================================

import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

export async function requireOrganization() {
  const { orgId } = auth();
  
  if (!orgId) {
    redirect("/onboarding");
  }

  return orgId;
}

export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

export function hasRole(
  role: string,
  allowedRoles: string[]
): boolean {
  return allowedRoles.includes(role);
}

export function isAdmin(role: string): boolean {
  return role === "org_admin" || role === "super_admin";
}

export function isManager(role: string): boolean {
  return role === "manager" || isAdmin(role);
}

export function isWorker(role: string): boolean {
  return role === "worker";
}

export function isCustomer(role: string): boolean {
  return role === "customer";
}