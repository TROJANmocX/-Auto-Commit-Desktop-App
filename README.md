# Auto Commit

Auto Commit is a desktop application for generating Git commits on a defined schedule with strong safety guarantees.

It is built to demonstrate how automated systems can perform **potentially destructive operations** (like rewriting Git history) in a **controlled, previewable, and reversible** way.

This project prioritizes correctness, transparency, and guardrails over automation tricks.

---

## What This Tool Does

- Generates Git commits across a configurable date range
- Supports human-like timing and spacing patterns
- Shows a full preview before execution
- Executes all Git operations in an isolated background worker
- Guarantees rollback to the pre-run state
- Runs entirely locally on your machine

---

## What This Tool Is Not

- Not a GitHub profile optimizer
- Not a contribution farming tool
- Not designed for shared or collaborative repositories
- Not intended to misrepresent professional work

Auto Commit is intended for:
- private sandbox repositories
- demo or test repositories
- recovering or reconstructing personal timelines
- learning how Git history and automation systems work

---

## Core Features

### Preview-First Execution
Before any commit is created, the app shows:
- total commit count
- active vs skipped days
- planned timestamps
- GitHub-style heatmap preview

No preview, no execution.

---

### Isolated Execution Engine
All Git operations run inside a dedicated background worker:
- UI never touches Git directly
- progress is streamed in real time
- only one execution can run at a time
- safe cancellation and cleanup on error

---

### Undo (Rollback)
Every run records a recovery point:
- one-click undo
- repository restored to its exact pre-run state
- no partial or corrupted history

Undo is not optional. It is part of the design.

---

### Human-Like Scheduling
Optional realism controls:
- uneven daily commit counts
- time window randomization
- natural gaps and clusters
- optional weekend skipping

These are bounded and intentionally conservative.

---

### Pattern Learning
"Analyze Repository" feature:
- scans your local repository history
- learns your actual commit habit distribution (e.g., night owl vs. morning lark)
- applies your unique pattern to generated commits
- purely local analysis, no data leaves your machine

---

### True Determinism
Seeded Random Number Generation:
- identical configuration = identical schedule
- "Reshuffle" button to generate a new valid pattern
- guarantees that the Preview matches the Execution exactly
- eliminates "it looked different in preview" surprises

---

### Repository Validation
Execution is blocked unless:
- the path is a valid Git repository
- the current branch is detected
- the repository state is safe to modify

---

## Safety & Guardrails

Built-in protections include:
- dry-run enabled by default
- warnings for high commit volume
- explicit confirmation for risky configurations
- rollback always available
- local-only execution (no GitHub account access)

Use only on repositories you own or explicitly control.

---

## Recommended Usage

1. Select a private test repository
2. Configure schedule and options
3. Run Dry Run and review the preview
4. Execute a small test run
5. Verify results
6. Test Undo
7. Stop

Correctness matters more than realism or volume.

---

## Architecture Overview

- Desktop runtime: Electron
- UI: React + Tailwind (Carbon Terminal theme)
- Execution model: session-based background worker
- Git operations: local, isolated, deterministic

The system is designed so that preview, execution, and undo always agree.

---

## Installation

See `INSTALLATION.md` for platform-specific installation and build instructions.

---

## Version

### v1.1.0
 
This release adds:
- **Pattern Learning**: analyze and mimic your actual commit habits
- **True Determinism**: seeded RNG for identical preview/execution
- **Worker Thread**: offloaded execution for improved performance
- **Project Structure**: internal refactoring for stability

Future versions will focus on hardening and reliability, not feature expansion.

---

## Ethical Note

This project demonstrates how Git history works and how automation can be designed safely.

Use responsibly.
On repositories you own.
With clear intent.

---

## License

MIT
