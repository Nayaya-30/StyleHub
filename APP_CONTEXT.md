# StyleHub App Context

**Overview**

-   StyleHub is a professional tailoring management platform for the African market. It enables customers to discover fashion styles, place custom orders, track production progress, message tailors, and pay securely. Managers/admins handle organizations, styles, orders, worker assignments, and notifications.
-   Frontend uses Next.js App Router with Clerk authentication and Tailwind-based design components. Backend uses Convex for data storage, queries/mutations, and actions to integrate external services (Flutterwave payments, Resend emails, Cloudinary uploads).

**Architecture**

-   Backend: Convex functions organized by domain with strict value validation, indexes, and search indexes. External service interactions implemented as Convex actions.
-   Frontend: Next.js pages under `src/app` grouped by feature (marketing, auth, dashboard, payment) and reusable UI/components under `src/components`. Client data is fetched via `convex/react` hooks.
-   Providers: Clerk + Convex client are wired in `src/components/providers/ConvexClerkProvider.tsx:12` and composed via `src/components/providers/index.tsx` in the root layout `src/app/layout.tsx:52`.

**Backend Design (Convex)**

-   Schema and tables: `convex/schema.ts:8` defines domain tables and indexes.
    -   `organizations` with settings, stats, badges, search index by name `convex/schema.ts:10,57,60`.
    -   `users` with roles, preferences, saved measurements, stats, multiple indexes `convex/schema.ts:66,118-125`.
    -   `styles` for designs, images, pricing, tags, SEO, indexes and search `convex/schema.ts:128,187-195`.
    -   `orders` with measurements, pricing, status, delivery, timeline, progress stages, indexes `convex/schema.ts:198,320-326`.
    -   `customerOrganizations` linking customers and orgs with stats `convex/schema.ts:328,349-351`.
    -   `assignments` for worker tasks with progress updates `convex/schema.ts:354,383-386`.
    -   Messaging: `messages` and `conversations` with indexes, reactions, unread counts `convex/schema.ts:389,421-425,427-446`.
    -   `huddles` for audio/video session records `convex/schema.ts:449,460-463`.
    -   `invitations` for team onboarding with token and expiry `convex/schema.ts:466,487-490`.
    -   `payments` for payment events, status, metadata `convex/schema.ts:493,519-523`.
    -   `notifications` with action URLs and priorities `convex/schema.ts:526,542-544`.
    -   `workerPortfolio` for showcasing completed works `convex/schema.ts:547,571-573`.
    -   `savedStyles` for favorites `convex/schema.ts:576,582-584`.
    -   `reviews` for post-order feedback `convex/schema.ts:587,617-621`.
-   Core modules:
    -   Users: queries and profile/preferences/stat updates `convex/users.ts:12,27,38,67,91,165,187,214,242`.
    -   Organizations: lookup by id/slug/clerk, active search, settings/stats updates `convex/organisations.ts:11,22,37,54,75,92,157,184,251,283`.
    -   Styles: retrieval, featured, category, search, filters, create/update/images, counters `convex/styles.ts:11,22,54,75,111,139,207,276,310,334,355`.
    -   Orders: lookup by id/number/customer/org/worker, create (with customer-org stats upsert), status/progress updates with timeline `convex/orders.ts:11,22,39,68,104,128,254,297`.
    -   Assignments: worker/order/manager queries, create with order timeline update, status transitions, progress updates `convex/assignments.ts:11,41,56,72,138,183`.
    -   Messages & Conversations: fetch by conversation/order, send/edit/delete/read, reactions, unread counts; conversation archive and lookup `convex/messages.ts:11,35,57,73,162,215,236,250` and `convex/conversations.ts:11,32,61`.
    -   Notifications: list, create, mark, delete, counts with expiry filtering `convex/notifications.ts:11,46,67,112,127,152,163`.
    -   Payments: record creation and status updates that patch order timelines/status `convex/payments.ts:11,28,44,86`.
    -   Actions (external services):
        -   Email invites `convex/actions.ts:12`, order confirmation `convex/actions.ts:93`, order status `convex/actions.ts:188` via Resend API.
        -   Flutterwave initialize `convex/actions.ts:272` and verify `convex/actions.ts:357`.
        -   Cloudinary upload `convex/actions.ts:421` and delete `convex/actions.ts:483`.

**Frontend Structure and Patterns**

-   App router:
    -   Marketing: styles list and detail, organizations list/detail, payment verification/success, messages `src/app/(marketing)/styles/page.tsx:28`, `src/app/(marketing)/styles/[styleId]/page.tsx:41`, `src/app/(marketing)/organizations/page.tsx:27`, `src/app/(marketing)/organizations/[slug]/page.tsx`.
    -   Auth: onboarding, sign-in, sign-up under `(auth)`.
    -   Dashboard: orders list/detail/create, tasks, main dashboard `src/app/dashboard/orders/page.tsx:22`, `src/app/dashboard/orders/[orderId]/page.tsx`, `src/app/dashboard/orders/create/page.tsx`, `src/app/dashboard/tasks/page.tsx`.
    -   API webhooks: Flutterwave `src/app/api/webhooks/flutterwave/route.ts:11` and Clerk in `src/lib/clerk.ts:54`.
-   Components:
    -   Layout: `Navbar`, `Sidebar`, `DashboardLayout`, `Footer`.
    -   Features: `StyleCard`, `OrganizationCard`, `OrderCard`, `WorkerTaskCard`.
    -   Forms: `MeasurementsForm`, `OrderForm`, `StyleForm`, `SearchFilter`.
    -   UI primitives: Shadcn/Radix-inspired elements under `src/components/ui/*`.
    -   Providers: `ConvexClerkProvider` `src/components/providers/ConvexClerkProvider.tsx:12`, `ThemeProvider`, `ToastProvider`, combined in `src/components/providers/index.tsx` and used in `src/app/layout.tsx:52`.
-   Data access:
    -   `useQuery`/`useMutation` from `convex/react` across pages to fetch/modify data (e.g., styles listing `src/app/(marketing)/styles/page.tsx:33`, detail `src/app/(marketing)/styles/[styleId]/page.tsx:45`, organizations list `src/app/(marketing)/organizations/page.tsx:32`).

**Configuration**

-   Scripts: `package.json:5-14` with `dev`, `build`, `start`, `lint`, `type-check`, `convex:dev`, `convex:deploy`.
-   TypeScript strict config with path aliases `tsconfig.json:2-31`.
-   Next config for remote images (Cloudinary, Clerk) and externals `next.config.mjs:6-18,24-31`.
-   Tailwind config extended with brand palettes, fonts, animations, and `tailwindcss-animate` plugin `tailwind.config.ts:6-12,22-43,214-215`.
-   ESLint: Next core web vitals and TS, plus overrides `eslint.config.mjs:5-16` and `eslintrc.json:1-6`.

**Security**

-   Authentication & route protection:
    -   Clerk auth helpers `src/lib/auth.ts:8` and role helpers `src/lib/auth.ts:33-54`.
    -   Middleware protects private routes and allows public ones `src/proxy.ts:7-21,23-25`.
-   Webhooks verification:
    -   Clerk webhook validation via Svix signatures `src/lib/clerk.ts:9-41` and route `src/lib/clerk.ts:54-130`.
    -   Flutterwave webhook signature check using `verif-hash` header `src/app/api/webhooks/flutterwave/route.ts:16-23` before payment verification `src/app/api/webhooks/flutterwave/route.ts:31-35`.
-   Data validation:
    -   Convex schemas use `v.*` validators for all inputs, preventing malformed payloads (e.g., `convex/users.ts:91`, `convex/orders.ts:128`, `convex/styles.ts:207`).
-   Secrets management:
    -   Env vars for Convex URL, Clerk, Flutterwave, Cloudinary, Resend used in providers/actions and webhooks (`src/components/providers/ConvexClerkProvider.tsx:12`, `convex/actions.ts:21,282,432,493`).
-   Notes:
    -   Cloudinary delete signature appears as a raw concatenation `convex/actions.ts:503-510`; Cloudinary typically requires an HMAC-SHA1 signature over signed parameters. Review before production hardening.

**Overall Idea**

-   Customers browse styles, view details, and place orders with measurements and optional customizations. Orders progress through stages (cutting, sewing, finishing) with worker assignments, status updates, images, notes, and delivery tracking. Messaging and notifications keep all parties informed. Payments are processed via Flutterwave with verification and order timeline updates. Organizations manage their portfolios, settings, and teams.

**File Structure**

-   Root: Next/Tailwind/TypeScript configs, `package.json`, lockfile, lint configs, and docs.
-   Backend: `convex/*` domain modules and `schema.ts`.
-   Frontend: `src/app/*` pages by feature, `src/components/*` for UI/features/forms/layout/providers, `src/hooks/*`, `src/lib/*`, `src/types/*`.
-   Public assets: `public/*` SVGs/images and remote image configuration.
-   Documentation: UI design (`APP_DESIGN.md`), structure (`FILES_STRUCTURE.md`), status (`FILE_ANALYSIS.md`), and additional idea (`ADDITIONAL_IDEA.md`).

**Coding Conventions**

-   TypeScript, strict mode, path aliases.
-   Next.js App Router, client components where necessary (`"use client"` in pages), composition via providers and clean separation of concerns.
-   UI built on Tailwind + component library patterns; Radix in dependencies.
-   Convex modules use clear separation of queries/mutations/actions with consistent timestamps (`createdAt`, `updatedAt`) and timeline entries for auditable state changes.

**Key Integrations**

-   Payments: Flutterwave initialize/verify `convex/actions.ts:272,357` and webhook handler `src/app/api/webhooks/flutterwave/route.ts:11` updating `payments` and `orders`.
-   Email: Resend for invitations and order lifecycle emails `convex/actions.ts:12,93,188`.
-   Storage/Images: Cloudinary upload/delete actions `convex/actions.ts:421,483`; Next image config allows Cloudinary and Clerk `next.config.mjs:6-18`.
-   Auth: Clerk provider and hooks (`src/components/providers/ConvexClerkProvider.tsx:12`, `src/lib/auth.ts:8`).

**Non‑Functional Considerations**

-   Performance: Tailwind and skeleton components for perceived speed; `tailwind.config.ts` defines animations for loading states. Convex indexes and search indexes are defined for efficient queries.
-   UX: Comprehensive design guidelines and flows in `APP_DESIGN.md` drive consistent UI/UX patterns across pages.

**Environment Variables (indicative)**

-   `NEXT_PUBLIC_CONVEX_URL` used by Convex clients `src/components/providers/ConvexClerkProvider.tsx:12` and webhooks.
-   `NEXT_PUBLIC_APP_URL` used for payment redirects and OG metadata `convex/actions.ts:303-314`, `src/app/layout.tsx:36`.
-   `CLERK_WEBHOOK_SECRET` for Svix verification `src/lib/clerk.ts:12`.
-   `FLUTTERWAVE_SECRET_KEY` and `FLUTTERWAVE_SECRET_HASH` for API actions and webhook verification `convex/actions.ts:282,365`, `src/app/api/webhooks/flutterwave/route.ts:16`.
-   `RESEND_API_KEY` for transactional emails `convex/actions.ts:21,103`.
-   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` for uploads/deletions `convex/actions.ts:432-438`.

**Open Areas / Next Steps**

-   Review Cloudinary signature generation for deletions and consider signed uploads.
-   Fill remaining “admin” and “chat” UI pieces outlined in `FILE_ANALYSIS.md` and `FILES_STRUCTURE.md`.
-   Implement reviews, invitations, worker portfolio, and huddles modules fully where missing pages/components are referenced in docs.
