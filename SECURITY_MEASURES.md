<!-- @format -->

You are reviewing an existing Convex backend that is already functional but
needs to be SECURITY-HARDENED.

Your task is to systematically improve security across:

-   Authentication
-   Authorization (RBAC)
-   Multi-tenancy isolation
-   Payment safety
-   Real-time data exposure
-   External integrations (email, SMS, payments)
-   Auditability and abuse prevention

DO NOT change business logic unless required for security.

---

## 1️⃣ AUTHENTICATION & IDENTITY

-   Verify that every query, mutation, and action enforces authentication.
-   Centralize identity resolution (e.g. getAuthUser).
-   Ensure unauthenticated users cannot access ANY sensitive data.
-   Fail fast on missing identity.

---

## 2️⃣ RBAC (ROLE-BASED ACCESS CONTROL)

-   Design a reusable RBAC middleware pattern.
-   Eliminate scattered role checks.
-   Enforce role validation ONLY on the backend.
-   Ensure frontend permission checks are cosmetic, not authoritative.

Required:

-   `requireRole(user, allowedRoles)`
-   `requireSameOrg(entityOrgId, userOrgId)`
-   Explicit denial for unauthorized access.

---

## 3️⃣ MULTI-TENANCY ISOLATION

-   Ensure every query and mutation is scoped by organizationId.
-   Prevent cross-organization reads and writes.
-   Verify all indexes are organization-scoped.
-   Audit for accidental `ctx.db.get(id)` without org validation.

---

## 4️⃣ QUERY & REAL-TIME EXPOSURE

-   Identify queries that return excessive data.
-   Enforce pagination on all list queries.
-   Ensure role-specific query filtering.
-   Prevent users from subscribing to data they should not see.

---

## 5️⃣ MUTATION SAFETY

-   Validate ownership before mutation.
-   Enforce idempotency where operations can be retried.
-   Prevent client-controlled critical fields (e.g. payment amount, status).

---

## 6️⃣ ACTIONS & EXTERNAL APIs

-   Ensure actions NEVER mutate core state directly.
-   Validate all external API responses.
-   Separate verification (action) from persistence (mutation).
-   Harden webhook handling:
    -   Signature verification
    -   Event type allowlist
    -   Replay protection
    -   Logging

---

## 7️⃣ PAYMENT SECURITY

-   Ensure clients cannot confirm payments.
-   Validate payments only via provider webhooks.
-   Enforce reference-based idempotency.
-   Reject mismatched amounts or currencies.
-   Log all payment events.

---

## 8️⃣ AUDIT LOGGING

-   Add audit logging for all sensitive operations:
    -   Role changes
    -   Payments
    -   Assignments
    -   Status updates
-   Design an audit_logs table.
-   Ensure logs are organization-scoped and immutable.

---

## 9️⃣ ABUSE & RATE LIMITING

-   Add identity-based rate limiting.
-   Prevent mutation spam.
-   Protect chat, payments, and status updates.
-   Ensure limits reset correctly.

---

## 🔟 ERROR HANDLING & SIGNALING

-   Ensure errors do not leak internal data.
-   Standardize authorization errors.
-   Log security-relevant failures.

---

## OUTPUT REQUIREMENTS

1. Identify security risks found.
2. Propose fixes with explanation.
3. Provide concrete Convex code snippets.
4. Highlight any breaking changes.
5. Summarize overall security posture before vs after.

Your output must assume the frontend is untrusted. Security correctness is
prioritized over convenience.
