Tech debt is not one thing.

Most teams still talk about it as if it were one big cleanup bucket:
"we need to reduce tech debt."

It sounds responsible. It sounds mature.
And in practice, it often means almost nothing.

When everything uncomfortable gets labeled as tech debt, prioritization disappears. Teams keep "paying it down," but delivery does not improve.

## The classification that changes decisions

A more useful model is to split debt into three categories:

1. Strategic debt
2. Accidental debt
3. Architectural debt

They look similar in backlog labels, but behave differently and require different decisions.

---

## 1) Strategic tech debt

Strategic debt is intentional.

You knowingly postpone a cleaner solution because speed, learning, or validation matters more right now.

Examples:

- hardcoding values before a real configuration model exists,
- skipping abstractions when there is only one use case,
- keeping a modular monolith instead of introducing service boundaries too early.

These are not "lazy shortcuts." They are trade-offs.

You are buying time with awareness that future work will be needed.
Without this category, many teams either overengineer or fail to ship.

Strategic debt is not the enemy.
Untracked strategic debt is.

---

## 2) Accidental tech debt

Accidental debt is what most people picture first:
copy-paste logic, unclear naming, missing tests, duplicated edge-case handling.

It usually comes from speed pressure, limited attention, and normal human constraints.

This debt hurts readability and increases bug probability, but it is usually local.
You can often improve it with focused refactoring, code review discipline, and better defaults in your workflow.

This is the debt type that can fit in regular sprint work.

---

## 3) Architectural tech debt

Architectural debt is system-level debt:
wrong boundaries, tight coupling, and domain models that no longer match reality.

This is the most dangerous form because it starts quietly.
Early velocity may look acceptable, so teams ignore the structural warning signs.

Then the curve bends:

- every new feature takes longer,
- changes become riskier,
- teams block each other,
- debugging turns into archaeology.

At that point, you are no longer "refactoring a detail."
You are negotiating with the shape of the system itself.

### A real pattern

In one company, a massive mutable context object was passed through hundreds of functions.
Any function could read it, and almost any function could modify it.

Predictability collapsed.
When incidents happened, tracing the state changes required walking through large parts of the system.

A ticket to make that object immutable was created.
The idea was technically correct.

The problem was timing.

By the time the organization tried to execute, that mutable object had spread into too many flows.
Changing it was no longer a refactor. It was a redesign.

---

## Why "reduce tech debt" keeps failing

Many roadmaps include a generic "tech debt" line item.
Without classification, this creates a predictable anti-pattern:

- teams fix what is easiest to fix,
- visible local cleanup is rewarded,
- structural debt remains untouched.

Output goes up. Throughput quality does not.

Sometimes the label itself becomes an avoidance strategy.

---

## What to do instead

Start with language:

- strategic,
- accidental,
- architectural.

Then prioritize by impact on delivery, not by visual code ugliness.

And keep one expectation clear:
tech debt never disappears completely in a healthy product organization.

If it appears to be zero, you are likely either not shipping enough or overengineering too early.

## Closing thought

Tech debt is not the core problem.
Uncontrolled, unclassified debt is.

If your roadmap repeatedly includes "tech debt" but the team still disagrees on what blocks delivery, the issue is probably not capacity.
It is classification.

If this sounds familiar, let's talk about how to separate debt that blocks shipping from debt that is simply noise.

[Contact me and let's improve your delivery decisions](/en/contact).