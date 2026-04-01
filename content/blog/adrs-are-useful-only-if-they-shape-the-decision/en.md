Most people will tell you that having ADRs is a good thing. They are not wrong.

ADR stands for Architecture Decision Record. The idea is simple: when you make an important architectural decision, you write it down. You capture context, alternatives, tradeoffs, reasoning, and final choice.

So when someone asks six months later, "Why this database?", "Why this queue?", or "Why three services?", you do not need to reconstruct the answer from Slack fragments and half-remembered meetings.

In theory, that is incredibly valuable.

## Why ADRs still fail in practice

In many teams ADRs exist and still feel like a waste of time. Not because the concept is bad, but because the intended value never appears.

A practical reason is discoverability. In a small team, searching Confluence is acceptable. In a larger organization, searching for one ADR returns hundreds of results, many outdated, archived, or irrelevant. The document is "there", but practically unreachable. And if engineers cannot find a decision quickly, they behave as if that decision was never documented.

There is also a process failure mode: ADRs become ritual. Someone introduces templates, review meetings, and a governance flow. People continue writing documents, but real decisions happen elsewhere. The review meeting ends with polite nods, a formal approval, and no meaningful improvement in decision quality.

## ADRs do not remove bias

ADRs are supposed to compare options objectively, but the author is still human. If someone has a decade of SQL experience and little exposure to NoSQL, the framing can drift before anyone notices.

SQL gets described as mature and proven. NoSQL gets described as uncertain and operationally risky. Both might be valid choices, but one gets better narrative framing because it is familiar. The ADR then captures preference with just enough logic around it to look neutral.

So ADRs do not eliminate bias. They only make the written reasoning visible.

## The real value is the thinking

Most teams treat ADRs as documentation. Their real value is decision hygiene.

When an ADR is written before commitment, it forces useful questions: what is the actual context, which alternatives are truly viable, what tradeoffs matter most, and what consequences are we accepting on purpose.

If that thinking happens early, the ADR has done its job, even if nobody reads it again. If it is written after implementation starts, it becomes historical reporting with little influence on outcomes.

## A costly example: KMS + CloudHSM

On one product, we had to decide how to manage encryption keys for sensitive customer data. Security pressure was high, compliance expectations were strict, and we wanted a setup that looked strong in both audits and architecture diagrams.

We picked AWS KMS with CloudHSM. On paper, it looked excellent: managed primitives, hardware-backed key protection, clear enterprise story. The decision meeting focused heavily on cryptographic guarantees and almost not at all on recovery constraints.

The missing question was simple: what happens if the AWS account itself is compromised?

Months later, during a resilience review, we discovered an unpleasant constraint. In an account takeover scenario, you cannot just recreate the exact KMS and CloudHSM trust relationship in a new account and continue business as usual. The coupling is not something you can rebuild in a clean environment on demand.

That changed the risk picture completely. We had already built dependent services around the original setup, production data had been encrypted under that model, and key-handling paths were spread across multiple components.

Fixing the gap was painful. We had to redesign parts of the key lifecycle, introduce migration steps for encrypted data, coordinate downtime windows, and retest incident procedures end to end. It took weeks and consumed capacity that should have gone to product work.

Would an ADR template alone have saved us? No. But a better decision conversation probably would have. One person asking "show me the DR playbook for account compromise" could have forced the right investigation before implementation.

That is the core point: the value is not the file. The value is the conversation the file forces.

## When ADRs actually work

In practice, a few rules help:

1. Use ADRs for decisions that are expensive to reverse (data stores, boundaries, integration patterns).
2. Write them before final commitment, not after implementation starts.
3. Keep them short and focused: context, options, tradeoffs, decision, consequences.

Retrospective ADRs can still be useful at the beginning, as practice for better decision thinking. But the long-term goal is proactive ADRs that shape decisions in real time.

## Final thought

ADRs are not useless.

They fail when they are treated as passive documentation.

If your ADR did not influence the decision, it is not really an architecture decision record. It is just documentation.

If you want better architectural decisions in your team, I can help you design a lean ADR workflow that improves discussion quality and reduces expensive blind spots before implementation.

[Contact me and let's improve your decision process](/en/contact).