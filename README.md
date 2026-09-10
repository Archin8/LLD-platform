# LLD Practice Platform

A full-stack web application designed for practicing **Low-Level System Design (LLD)** and **Object-Oriented Design (OOD)** with real-time, deterministic evaluation feedback.

---

## 🌟 Key Features

- **Interactive Design Workspace**: Declare domain entities, abstract classes, interfaces, attributes, operations, and relationships with clear Single Responsibility statements.
- **Deterministic Rule Engine**: Instant evaluation of design principles without external LLM costs or latency:
  - **Single Responsibility Principle (SRP)**: Detects overloaded duties in class descriptions.
  - **God Class Antipattern**: Identifies bloated classes with excessive fields or methods.
  - **Structural Decomposition**: Ensures adequate class breakdown relative to problem complexity.
  - **Polymorphism & Abstractions**: Verifies required interfaces for pluggable strategies (e.g. pricing strategies, dispatch strategies).
  - **Domain Coupling**: Validates relationship references and detects isolated components.
- **Attempt History & Iterative Improvement**: Track scores over time and refine previous designs through interactive retries.
- **LLM Extensible Architecture**: Designed behind an `Evaluator` interface so an `LLMEvaluator` can be swapped in without modifying API routes or frontend code.

---

## 🛠️ Stack & Architecture

- **Frontend & API**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Testing**: Vitest (17 passing unit & integration tests)

```
my-app/
├── prisma/
│   ├── schema.prisma              # Database models (Problem, Attempt, Submission, Feedback)
│   └── seed.ts                    # Seed script with 4 realistic LLD problems
├── src/
│   ├── app/
│   │   ├── page.tsx               # Problem catalog (Home)
│   │   ├── problems/[id]/page.tsx # Interactive LLD design workspace
│   │   ├── attempts/[id]/page.tsx # Evaluation feedback report
│   │   ├── history/page.tsx       # Past attempt history
│   │   └── api/                   # REST API route handlers
│   ├── domain/
│   │   ├── models/                # Problem, Submission, Attempt, FeedbackResult types
│   │   ├── rules/                 # ClassCount, SRP, GodClass, Abstraction, Relationship rules
│   │   └── evaluators/            # RuleBasedEvaluator, LLMEvaluator stub, CompositeEvaluator
│   ├── lib/
│   │   └── db.ts                  # Prisma client singleton instance
│   └── components/                # Reusable UI components
├── tests/                         # Vitest suite (rules, evaluators, API failure/retry paths)
└── docs/                          # RESEARCH_NOTE.md, DESIGN_NOTE.md, AI_USAGE.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **PostgreSQL**: Local instance running on port 5432 or Docker container:
  ```bash
  docker run --name lld-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
  ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and adjust your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lld_practice?schema=public"
```

### 4. Push Database Schema & Seed Problems
```bash
# Push Prisma schema to Postgres
npx prisma db push

# Seed 4 LLD practice problems (Parking Lot, Elevator System, Vending Machine, Library)
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

Run the Vitest test suite covering rule logic, evaluator aggregation, and API failure/retry paths:

```bash
npm test
```

Expected output:
```
 ✓ tests/rules/GodClassRule.test.ts (2 tests)
 ✓ tests/rules/InterfaceUsageRule.test.ts (2 tests)
 ✓ tests/rules/ResponsibilityClarityRule.test.ts (3 tests)
 ✓ tests/rules/ClassCountRule.test.ts (3 tests)
 ✓ tests/rules/RelationshipRule.test.ts (3 tests)
 ✓ tests/api/attempts.test.ts (2 tests)
 ✓ tests/evaluators/RuleBasedEvaluator.test.ts (2 tests)

 Test Files  7 passed (7)
      Tests  17 passed (17)
```

---

## 📄 Documentation Deliverables

- [`docs/RESEARCH_NOTE.md`](file:///d:/reactProject/LLD/my-app/docs/RESEARCH_NOTE.md): Analysis of the learner feedback gap, comparison of existing approaches, and product direction.
- [`docs/DESIGN_NOTE.md`](file:///d:/reactProject/LLD/my-app/docs/DESIGN_NOTE.md): Detailed system architecture, domain models, evaluator interface, and answers to core design questions.
- [`docs/AI_USAGE.md`](file:///d:/reactProject/LLD/my-app/docs/AI_USAGE.md): Honest log of AI assistance and architectural decisions made during development.
