## Plan: ShikshaVid Stability and UX Recovery

Stabilize the deployed app by fixing styling bootstrapping, signup flow runtime errors, map rendering/config issues, and any blocking console/network/runtime failures. The approach is to diagnose from logs and code paths first, then apply targeted fixes in dependency order so later checks are meaningful.

**Discovery findings (current)**
1. Signup failure is reproducible on production API: `POST https://shikshavid.onrender.com/api/auth/signup` returns `500` with `{"message":"next is not a function"}`.
2. Backend likely source for signup error is `server/models/User.js` pre-save middleware (`userSchema.pre('save', async function(next) { ... next(); })`) under Mongoose `^9.x`.
3. Frontend Tailwind is loading on production (utilities such as `pt-24`, `pb-20`, gradient classes exist in built CSS), so UI mess is likely layout/responsiveness defects, not a missing Tailwind build.
4. Deployed frontend bundle includes Google Maps key wiring (`googleMapsApiKey`) and API base URL (`shikshavid.onrender.com`), so map failure is likely due key restrictions/billing/API enablement or runtime map component errors.

**Steps**
1. Phase 1 — Baseline Discovery: capture reproducible failures for UI styling, signup, and map rendering from local run + deployed logs; collect browser console errors, failed network requests, and server stack traces.
2. Phase 1 — Dependency/Env Verification: validate runtime/env configuration parity (Vercel vs local), including Next.js public/private env usage, API base URLs, auth-related secrets, and map API key/domain restrictions.
3. Phase 2 — Styling Recovery: trace Tailwind pipeline end-to-end (config `content` globs, PostCSS/Tailwind plugin wiring, global stylesheet imports, layout/app entry imports, build output CSS) and fix any break in the chain.
4. Phase 2 — Signup Runtime Fix: trace signup request flow frontend -> API route/controller/service; fix `next is not a function` root cause (incorrect middleware signature, misuse of callback-style `next`, or wrong handler composition). *depends on step 1*
5. Phase 2 — Map Rendering Fix: verify map component mount flow, API loader usage, key availability (`NEXT_PUBLIC_*` for client), ref/container sizing, and script load error handling. *depends on step 2*
6. Phase 3 — Broader Error Sweep: resolve additional high-impact runtime/build errors found in logs (prioritize auth, routing, and data-fetch failures). *parallel with step 5 after step 1*
7. Phase 4 — Regression Checks: verify key user journeys: homepage render, signup, login (if applicable), profile creation, map visibility/interactions, and primary navigations.
8. Phase 4 — Deployment Confirmation: redeploy with corrected env/config, verify production behavior, and document required env keys + setup notes for future consistency.

**Relevant files**
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\client\tailwind.config.*` — confirm `content` globs include all app/component/template paths.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\client\postcss.config.*` — verify Tailwind/PostCSS plugin chain.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\client\src\app\globals.css` (or equivalent) — ensure Tailwind directives are present and not overridden globally.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\client\src\app\layout.*` / app entry — verify global CSS import location.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\server\src\**\*.ts` (auth/signup/middleware) — inspect middleware/handler signatures and `next` usage.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\client\src\**\*signup*.*` — check form submit flow, API call payload, and error handling.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\client\src\**\*map*.*` — inspect map component loader lifecycle and container styling.
- `C:\Users\Siddharth\Desktop\ShikshaVid -AG\vercel.json` and env configuration sources — verify routing/runtime config and environment expectations.

**Verification**
1. Run existing lint/type/build/test commands for client and server to detect compile/runtime breakpoints.
2. Start local app with production-like env values and reproduce the three reported issues.
3. Confirm generated CSS includes Tailwind utilities and that affected pages apply expected classes.
4. Submit signup flow with a new user and confirm success response, persistence, and redirect/navigation behavior.
5. Confirm map script loads without key/referrer errors and map renders with visible container dimensions.
6. Validate no blocking console errors and no failing critical API routes in network panel/server logs.
7. Verify production deployment reflects fixes with correct Vercel environment variable scopes.

**Decisions**
- Scope included: UI styling integrity, signup/profile creation blocker, map rendering blocker, and other critical runtime errors discovered during the same pass.
- Scope excluded: unrelated feature enhancements, refactors that do not reduce current failure risk, and cosmetic-only design changes.
- Priority order: styling bootstrap -> signup runtime blocker -> map rendering -> remaining critical errors.

**Further Considerations**
1. If both frontend and backend define auth validation, standardize one source-of-truth for request schema validation to prevent drift.
2. If map provider quotas/restrictions are causing intermittent failures, add explicit fallback UI and surfaced diagnostics.
3. If environment drift is frequent, add a checked-in env template and startup validation for required keys.
