---
name: caveman
description: Debug stubborn edge cases with a bare-metal, assumption-light workflow. Use when SafeSkill Web has confusing behavior across route handlers, rendering branches, payload parsing, status mapping, or subtle runtime mismatches that need stepwise isolation.
---

# Caveman

- Strip problem down to the smallest failing path first.
- Prefer direct observation over theory: inspect inputs, outputs, branches, and runtime shapes.
- Verify exact payloads, exact status values, exact nullability, and exact environment assumptions.
- Reproduce with the fewest moving parts possible.
- Check edge cases around report IDs, missing reports, malformed signals, upload limits, and blocked-versus-warn display logic.
- State one working hypothesis at a time and kill bad hypotheses quickly.
- Favor tiny fixes over rewrites until root cause is proven.
- Use `PRD.md` to protect product boundaries while debugging.
