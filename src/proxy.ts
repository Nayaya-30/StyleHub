// ============================================
// FILE: src/middleware.ts
// ============================================

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/styles",
    "/styles/(.*)",
    "/organizations",
    "/organizations/(.*)",
    "/api/webhooks/(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ],
  ignoredRoutes: [
    "/api/webhooks/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};