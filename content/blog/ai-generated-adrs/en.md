Documenting architecture decisions used to be a mostly collaborative process.

It might have been a meeting, an RFC, an ADR review, a long Slack thread, or a debate in front of a whiteboard. The format changed, but the essence stayed the same: several people tried to understand the same decision from different angles.

With AI, that can change easily.

Today it is enough to ask a model to help with a decision. A few seconds later, we get alternatives, a pros and cons list, arguments that sound professional, and a ready-made recommendation.

There is an even worse version: we already decide what we want, then ask AI to write the ADR for it.

This skips the uncomfortable part. The people who see different risks do not sit down together. The team does not wrestle with the fact that the decision is only acceptable under certain tradeoffs.

We just get a document.

That is exactly the problem.

An ADR is not about which decision *usually* works in the world. It is about why *we* made a given decision in *our* situation.

The point of an ADR is not that a document exists somewhere. The document is only the byproduct.

> **Info:** An ADR, or Architecture Decision Record, gives that byproduct a concrete form: it describes the circumstances, alternatives, tradeoffs, and consequences around an architecture decision.

The important part is the decision-making process itself: the moment when multiple parties, perspectives, and kinds of risk meet before the team commits.

Engineering, product, security, operations, support, and even compliance can see completely different costs in the same decision. A good ADR process brings those different perspectives to the surface.

Let's look at an example.

## A prompt that turns into a finished ADR

Suppose a team has been working in a modular monolith. Now the question comes up whether the notification functionality should be extracted into a separate service, because the system sends more and more emails, push notifications, and webhooks.

The prompt could look like this. For now, let's ignore that the prompt itself already has a problem. We will come back to that later.

```md
Write an ADR about extracting the notification module into a separate microservice.

Context:
- the system currently runs as a modular monolith
- the notification module sends emails, push notifications, and webhooks
- the product is expected to grow
- we want a more scalable and loosely coupled architecture
- the team cares about cloud-native best practices

The ADR should include context, decision, alternatives, pros and cons, and consequences.
```

AI could easily produce something like this:

```md
# ADR: Extracting the Notification Module into a Separate Microservice

## Context

The current system runs as a modular monolith. The notification module is responsible for sending emails, push notifications, and webhooks. As the product grows, scalability, flexibility, and loose coupling between components become increasingly important.

## Decision

We will extract the notification module into a separate microservice. The monolith will publish events to a message broker, and the Notification Service will send notifications based on those events.

## Alternatives

1. Keep the notification module inside the monolith.
2. Move the notification logic into a separate library.
3. Extract the notification module into a separate microservice.

## Rationale

The microservice approach better supports scalability, independent deployment, and loose coupling. The notification functionality is clearly separated from the business domain, so it forms a natural service boundary. Asynchronous communication improves system resilience because core business flows are not blocked while notifications are being sent.

## Consequences

Positive consequences:
- the notification component can be scaled independently
- the team can deploy notification logic independently
- the system aligns better with cloud-native architecture
- the service boundary becomes cleaner

Negative consequences:
- operational complexity increases
- a message broker is required
- eventual consistency must be handled
- monitoring becomes more complex

## Status

Accepted.
```

At first glance, this looks perfectly reasonable.

There is context. There are alternatives. Consequences are named. The decision seems logical.

That is why it is dangerous.

## AI loves best practices

Almost every sentence in the generated ADR is built from familiar professional patterns:

- microservice,
- message broker,
- loose coupling,
- independent deployment,
- scalability,
- cloud-native architecture,
- eventual consistency.

These are useful concepts in many situations.

In ADRs, however, we often do not choose the industry-wide "best" solution. We choose the one that:

- fits the budget,
- matches the team's skill level,
- works with the existing system,
- can be handled within the deadline.

The local optimum is often more important than the industry optimum.

For a team of three, a clean module boundary inside the monolith may be a better decision than a separate service with its own deployment, monitoring, and incident runbook.

Two months before a deadline, the simplest queue-based background processing may be more valuable than introducing a full event-driven architecture.

In a low-traffic B2B product, a solution that scales to 100 million users may only bring unnecessary cost and complexity.

In the ADR above, "cloud-native best practices" works like an amplifier. It makes the decision look more serious while saying very little about why it is true for this team and this system.

Maybe the notification module really does deserve a separate service.

It may also be better to clean up the boundary inside the monolith, decouple sending through a queue, and avoid creating a new deployable unit for now.

The generated ADR does not examine that difference.

## The decision was already made in the prompt

It is worth looking at the prompt too.

We did not ask what options exist. We asked it to write an ADR about extracting the module.

AI will often helpfully justify the direction it was given. It gathers arguments that sound good, then writes "accepted" at the end.

This bias did not arrive with AI.

We have seen the same pattern in ADRs written by humans: the author clearly leans toward one solution, so the alternatives are described more weakly, and the risks of the preferred option are handled more gently.

AI does not create a new problem here. It can amplify an existing one faster and with more polish.

Because of that, the document looks like the result of a decision process.

In reality, it may only be a preference wrapped in professional language after the fact.

This is one of the biggest risks with AI-generated ADRs: the document does not record the decision, it rationalizes it.

At that point, the ADR loses its purpose.

The team already decided, and AI produced a document for it. The part where operations could have said there is no capacity to operate another service disappeared. Security could have asked about webhook retry and audit trail details. Product could have pointed out that the next two months are about landing a major release reliably, not scaling.

That process is exactly what gives an ADR its value.

When we use AI to write the finished decision document on behalf of the team, those perspectives can disappear easily. The document remains, while the quality of decision-making does not improve.

## Responsibility does not move to AI

This is already worth taking seriously with code.

If a change written by AI causes a company to lose millions of dollars, final responsibility will not belong to the model. It stays with the developer and the team who approved it, merged it, and let it into production.

"AI wrote it" may explain how the bug got there.

It is not much of an excuse.

The same applies to architecture decisions.

If an AI-generated ADR leads us to draw the wrong service boundary, build unnecessary infrastructure, or take on an operational burden the team cannot carry, the organization lives with the consequences. On the incident call, in the migration project, and in the cost report, it no longer matters who wrote the ADR.

What matters is who accepted it as a decision.

## Decision drivers are not equal

An ADR is not only about the decision itself. The tradeoffs behind it matter just as much.

For example:

- development speed,
- operational cost,
- scalability,
- team experience,
- vendor lock-in,
- security,
- observability,
- incident recovery,
- time to market.

All of these are decision drivers.

The ADR above lists some of them: operational complexity, message broker, eventual consistency, monitoring.

The weighting is missing.

Which matters more: independent deployment, or the fact that a three-person team has so far operated a single production service?

What is the real notification load? Ten thousand messages a day? Ten million? Does it burst during campaigns, or arrive evenly?

Is there anyone who understands how the message broker works, including its retry model, dead letter queue, and idempotency concerns?

A major release is coming in two months. Does a new service, a new CI/CD pipeline, a new dashboard, and a new incident runbook really fit right now?

AI can list the drivers. That does not mean it can weigh them correctly.

The value of ADRs is precisely that they record these weights explicitly.

## Well-written sentences hide missing evidence

Look at this sentence:

> The notification functionality is clearly separated from the business domain, so it forms a natural service boundary.

That might be true.

The generated ADR just does not show why.

Does a separate team work on it? Does it have a different release cycle? Does it scale differently from the rest of the system? Does it handle data that requires a separate authorization model?

If none of these are true, then "natural service boundary" is only a nice-sounding label.

The same applies to asynchronous communication. It is a good goal that the main business flow should not block on sending emails.

That does not necessarily require a separate microservice. An internal queue, background processing, and a cleaner module boundary may be enough.

The generated ADR chooses the larger architecture move because it matches the words in the prompt more visibly.

## How I would still use it

So far, this may have sounded as if I would exclude AI completely from ADR work.

That is not the point.

I would not use AI to write the final ADR.

I would treat it as one additional participant in the decision process.

It is not the decision-maker. It is not the document factory. It is an invited perspective that asks questions, checks assumptions, looks for blind spots, and sometimes points to missing details with uncomfortable precision.

It can be very useful for review.

For example, with a prompt like this:

```md
Review this ADR as a skeptical architect.

Do not accept the decision as given.

Find:
- which decision drivers are missing
- where claims lack evidence
- which alternatives the document treats too weakly
- which operational risks should be clarified
- which questions we must answer before deciding
```

This is where AI is strong.

It can give good questions. It can notice blind spots. It can help search for alternatives.

Used this way, AI becomes a participant in the decision process.

The decision remains a human responsibility. AI can add perspective, ask useful questions, and quickly assemble what generally tends to work.

> It cannot know what truly matters in your context.
