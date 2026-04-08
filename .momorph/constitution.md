<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial creation) → 1.0.0
Modified principles: N/A — initial ratification
Added sections:
  - Core Principles (5 principles)
  - Tech Stack & Tooling
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  ✅ .momorph/templates/plan-template.md — Constitution Compliance Check aligns with the 5 principles defined here
  ✅ .momorph/templates/spec-template.md — Dependencies checklist references constitution.md path; aligns with requirements/success-criteria structure
  ✅ .momorph/templates/tasks-template.md — TDD-mandated task ordering (tests before implementation) and phase structure consistent with Principle III
Follow-up TODOs: None — all placeholders resolved on initial creation.
-->

# Agentic Coding Hands-on Constitution

## Core Principles

### I. Clean Architecture

All code MUST follow a strict separation of concerns:

- **Route handlers / Controllers**: Thin input/output mapping only. No business logic.
- **Services**: All business logic lives here. MUST be testable without framework types.
- **Libs / Utilities**: Shared infrastructure helpers (e.g., Supabase client, middleware wrappers).

File naming MUST follow:
- kebab-case for non-component modules: `user-service.ts`, `auth-middleware.ts`
- PascalCase for React components and classes: `LoginForm.tsx`, `AuthService.ts`

Dependency direction: route handler → service → lib/utility. Circular imports are forbidden.
DTOs describe shapes only — no business logic inside DTOs. Sensitive fields (passwords, tokens)
MUST be excluded from serialized responses.

### II. UI/UX Excellence

The application MUST be fully responsive across mobile, tablet, and desktop breakpoints.

- All design tokens (colors, spacing, radii, typography) MUST be defined as CSS variables in
  the global CSS file (`src/app/globals.css`) and consumed via Tailwind v4 utilities.
- Hard-coded raw color values, spacing, or typography in component files are FORBIDDEN.
- Navigation and URL values MUST be derived exclusively from `SCREENFLOW.md` and group spec
  files. Guessing or hard-coding URLs is STRICTLY FORBIDDEN (see `frontend.md` URL guidelines).
- Assets MUST use kebab-case filenames and be placed under
  `public/assets/{group_name}/{icons|images|logos}/`.

### III. Test-First (NON-NEGOTIABLE)

TDD is mandatory for all feature implementation:

1. Write tests → get user/reviewer approval → confirm tests FAIL → then implement.
2. Red-Green-Refactor cycle is strictly enforced.
3. Within each task phase, tests MUST be written and confirmed failing before implementation starts.
4. Integration tests MUST cover: new feature contracts, API interactions, data-layer operations,
   and cross-component user workflows.
5. Unit tests MUST NOT mock the database — use real Supabase instances or test containers to
   prevent mock/prod divergence.

### IV. Security by Design

All code MUST comply with OWASP Top 10 secure coding practices:

- Input validation MUST occur at all system boundaries (API route handlers, form handlers).
- Authentication MUST use Supabase Auth; session tokens MUST NOT be stored in insecure locations.
- Sensitive data (passwords, secrets, API keys) MUST never appear in logs, responses, or
  client-side code.
- Environment variables MUST be used for all secrets; `.env` files MUST be git-ignored.
- SQL/NoSQL injection, XSS, CSRF protections MUST be applied at every data entry and output point.
- The `@Exclude()` decorator (or equivalent serialization guard) MUST be applied on DTOs to
  prevent accidental secret exposure.

### V. Simplicity & YAGNI

Write the minimum code required to satisfy the current requirement:

- Single responsibility per file; prefer small, focused modules (target ≤ 200 LOC per file).
- 2-space indentation, ~100 character line width, single quotes for strings,
  template literals for interpolation.
- `const` and immutable collection patterns are preferred.
- No speculative abstractions: do not build helpers, utilities, or abstractions for one-time
  operations.
- No backwards-compatibility shims, unused variable renames, or feature flags unless
  explicitly required by a specification.
- Barrel (`index.ts`) files are limited to types/constants only; avoid re-exporting many
  modules through a barrel.

## Tech Stack & Tooling

| Concern | Approved Technology | Version |
|---------|---------------------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI Library | React | 19.x |
| Language | TypeScript (strict mode) | 5.x |
| Styling | TailwindCSS | v4 |
| Backend-as-a-Service | Supabase (Auth + DB + Realtime) | ^2.x |
| Edge Runtime | Cloudflare Workers via OpenNext | ^1.x |
| Package Manager | Yarn Classic | 1.22.22 |
| Linting | ESLint (Next.js config) | 9.x |
| Node.js | Node.js | v24.x |

All dependencies MUST be added to `package.json`. Introducing a dependency not listed above
requires explicit justification documented in the PR and in the relevant `plan.md` violation table.

### Folder Structure

```
src/
├── app/                   # Next.js App Router — pages, layouts, route handlers
│   └── (routes)/
├── components/            # Shared React components (PascalCase filenames)
│   └── [feature]/
├── libs/                  # Infrastructure helpers (supabase client, middleware)
│   └── supabase/
├── services/              # Business logic services (kebab-case filenames)
├── hooks/                 # Custom React hooks (use-prefixed)
└── types/                 # Shared TypeScript types/interfaces
```

## Development Workflow

1. **Constitution first**: Every session MUST start by reviewing this file.
2. **Spec before code**: A `spec.md` MUST be produced and reviewed before any
   `plan.md` or implementation begins.
3. **Plan before tasks**: A `plan.md` MUST pass Constitution Compliance Check before
   `tasks.md` is generated.
4. **TDD cycle per task**: For each task, write failing tests → implement → refactor.
5. **Commit discipline**: Follow Conventional Commits format. Use `/momorph.commit` to
   generate commit messages. Commit after each logical task group.
6. **Review gates**: `/momorph.reviewspecify` (2–3 runs) and `/momorph.reviewplan`
   (2–3 runs) MUST be executed before proceeding to implementation.

## Governance

This constitution is the supreme authority for all development decisions in this project.
It supersedes any conflicting guidance in README files, issue comments, or verbal instructions.

**Amendment procedure**:
1. Identify the change needed and classify the version bump (MAJOR / MINOR / PATCH).
2. Update this file and run `/momorph.constitution` to propagate changes.
3. Include a Sync Impact Report (HTML comment at top of this file).
4. Commit with message format: `docs: amend constitution to vX.Y.Z (<brief reason>)`.

**Versioning policy** (semantic):
- MAJOR: Backward-incompatible removal or redefinition of a principle.
- MINOR: New principle or section added, or materially expanded guidance.
- PATCH: Clarifications, wording fixes, non-semantic refinements.

**Compliance review**:
- All PRs MUST reference the Constitution Compliance Check in their linked `plan.md`.
- Any deviation from this constitution MUST be justified in the plan's violation table.
- Runtime guidance lives in `.momorph/guidelines/` — agents MUST read the relevant
  guideline file before generating or modifying code in that domain.

**Version**: 1.0.0 | **Ratified**: 2026-04-08 | **Last Amended**: 2026-04-08
