Many teams are already at the point where the assumption feels natural: if AI can write code, surely it can write ADRs too.

And it can.

That is exactly the problem.

You describe the situation, ask for an Architecture Decision Record, and a few seconds later you get a clean document:

- context,
- options,
- decision,
- consequences,
- sometimes even a neat table with pros and cons.

On a busy team, this feels like progress. The document exists. The template is filled. The decision looks explainable.

The risk is that the hard part may have been skipped.

An ADR is not about which decision usually works in the world. It is about why this team made this decision in this situation.

If AI only turns a loose preference into polished documentation, the result can easily become a generic architecture blog post.

## AI is very good at ADR-shaped text

Most ADR templates are simple. That is a strength when humans use them well, and a trap when they are filled mechanically.

AI can easily produce something like this:

> We decided to use event-driven architecture because it improves scalability, decouples services, and follows modern cloud-native best practices.

That sentence sounds reasonable. It also hides almost everything that matters.

Which scalability problem do we actually have?  
Which teams need to be decoupled?  
Can we observe asynchronous flows well enough?  
What happens when an event is processed twice?  
Who will debug the incident when billing and customer state disagree?

The generated ADR may contain correct words while avoiding the real decision.

## AI loves best practices

AI loves best practices because public technical writing is full of established patterns, recommendations, and industry standards.

If you ask about monolith or microservices, cache or database, Kubernetes or VMs, the answer often drifts toward professional consensus.

That is understandable. Best practices are everywhere:

- use managed services,
- prefer asynchronous communication,
- split by domain boundaries,
- automate everything,
- make the system horizontally scalable,
- keep services loosely coupled.

Many of these ideas are useful in the right situation. In ADRs, however, we often do not choose the "best" solution in an industry-wide sense.

We choose the one that:

- fits the budget,
- matches the team's skill level,
- works with the existing system,
- can be handled within the deadline.

The local optimum is often more important than the industry optimum.

A best practice is usually a story that lost its context. It worked for a company at a certain scale, with a certain team, under a certain business constraint. By the time it reaches a blog post, the messy details are often gone.

AI sees the polished version.

Your team lives with the messy version.

Maybe event-driven architecture is a strong choice because order processing, fulfillment, and invoicing really need independent failure modes.

Maybe it is premature because six people share one deployment pipeline, nobody has operated a message broker in production, and the current problem is a slow SQL query.

Both situations can produce similar-looking ADRs if the model is allowed to fill in the reasoning from general patterns.

## Decision drivers are not equal

An ADR is not only about the decision. It is just as much about the compromises behind it.

The most important part of an ADR is often the least visible: the weight of the decision drivers.

For one team, the dominant driver may be auditability. For another, delivery speed. In a third case, reversibility matters more than performance because the domain is still unstable.

Typical drivers include:

- compliance and audit expectations,
- operational complexity,
- team experience,
- cost,
- latency,
- data consistency,
- migration risk,
- reversibility,
- time to market,
- vendor dependency,
- incident recovery.

AI can list these drivers. It can even explain them clearly.

The difficult question is weight.

The model does not know on its own that your three-person engineering team matters more than theoretical scalability to 100 million users.

The prompt may easily leave out that the deadline is two months away, so maintainability carries less weight right now.

A public pattern also cannot feel when compliance is legally binding, so it dominates convenience.

If the team has no operational capacity, a theoretically elegant distributed design can become a daily tax. If the product direction is uncertain, reversibility may matter more than the cleanest long-term model.

How should AI weigh those drivers?

Based on the prompt? Based on public examples? Based on what usually appears in architecture articles?

That is too thin for a real decision.

The weighting comes from context that is often political, financial, operational, and historical. It comes from knowing which deadline is real, which incident still hurts, which legacy dependency cannot be touched this quarter, and which compliance requirement has teeth.

The value of ADRs is exactly that they make those weights explicit.

## AI produces very convincing reasoning

This may be the most dangerous part.

An AI-generated ADR can look as if someone spent months thinking about the decision.

Clean tables. Pros and cons. Elegant technical reasoning.

At the same time, the decision may never have been seriously weighed.

In that case, AI is not documenting the decision. It is rationalizing it after the fact.

There is another subtle failure mode: someone already wants Kubernetes, microservices, Kafka, or a particular database. They ask AI to generate an ADR for that choice. The output then presents the decision as if it came from balanced analysis.

The document may include alternatives, but they are often weakly framed:

- option A is modern and scalable,
- option B is simple but limited,
- option C has operational risk.

That kind of framing can quietly choose the winner before the discussion begins.

The team then reviews a polished artifact instead of the underlying assumptions. The ADR becomes a justification layer around a decision that was already emotionally made.

This is especially dangerous because the text looks neutral. The bias is hidden in what the model emphasizes, what it downplays, and which consequences receive a name.

## The missing responsibility

Architecture decisions are expensive because someone has to live with them.

AI will not be on the incident call when the queue backlog grows. It will not explain the migration plan to product leadership. It will not maintain the custom platform layer that was described as "future-proof" in the ADR.

Responsibility changes the quality of reasoning.

When a team owns the decision, the conversation becomes concrete:

- Can we operate this?
- Which failure mode scares us most?
- What would make us reverse the decision?
- Which constraint is fixed?
- Which assumption needs evidence before implementation?

Those questions are the real value of an ADR.

If AI generates the final document too early, the team may lose the discomfort that produces better decisions.

## A better role for AI

AI can still help with ADRs. It just needs the right job.

Use it before the decision hardens:

> We are considering these three options. Do not choose for us. List the assumptions behind each option, missing decision drivers, likely blind spots, and questions the team should answer before deciding.

Or:

> Review this ADR as a skeptical architect. Which decision drivers are underspecified? Which tradeoffs are described too vaguely? What evidence would change the recommendation?

These prompts ask for pressure, not permission.

The output should make the decision harder in a useful way. It should reveal missing context, not smooth it over.

## A practical workflow

A lightweight ADR process can use AI without handing over the decision.

1. **Humans write the context first.**  
   Include the real constraint, not only the technical problem.

2. **Name the decision drivers explicitly.**  
   Add relative weight: high, medium, low, or a short explanation of what dominates.

3. **Ask AI for missing drivers and assumptions.**  
   Treat the output as review input, not as the decision.

4. **Discuss the tradeoffs with the people who will live with them.**  
   Operations, product, security, support, and engineering may see different costs.

5. **Write the ADR after the decision conversation.**  
   The final record should preserve the reasoning the team actually used.

This keeps AI in the useful part of the process: expanding the thinking surface.

## What a good ADR must contain

A useful ADR does not need to be long. It needs to be honest.

It should say:

- what context made the decision necessary,
- which options were seriously considered,
- which decision drivers mattered most,
- how those drivers were weighted,
- what consequences the team accepts,
- what evidence could make the team revisit the decision.

That last point matters. A good ADR is not a declaration of certainty. It is a snapshot of judgment under known constraints.

## Final thought

AI can generate an ADR document.

That does not mean it made an architecture decision.

The decision lives in the weighing of context, constraints, risks, and consequences. That is where engineering judgment matters most.

Use AI to find blind spots, sharpen alternatives, and challenge vague reasoning.

Keep the decision with the people who will carry its cost.

Compromises are stubborn things. They rarely appear in the best Stack Overflow answer, and they do not fit cleanly into a "best practices" list.

If your team wants ADRs that improve architectural decisions instead of just documenting them, [reach out and let's design a lean decision workflow together](/en/contact).
