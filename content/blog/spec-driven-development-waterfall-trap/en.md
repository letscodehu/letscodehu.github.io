A team I talked to recently switched to spec-driven development with real enthusiasm.

They had read the same things everyone has read lately. "The spec is the prompt." Stop the ad-hoc back-and-forth with the model, write a structured specification first, then let the agent build against it. Tools like GitHub Spec Kit and AWS Kiro turn that into a workflow: spec, plan, tasks, implementation.

So they sat down and wrote a long, careful spec for the next feature. Goals, constraints, acceptance criteria, edge cases. The agent took it and produced a remarkably complete implementation in an afternoon.

Two weeks later they were rewriting most of it.

The code worked. It did exactly what the spec said. The problem was that the spec described a feature nobody actually wanted in that shape, and they only discovered the real requirements by watching people try to use the first version.

## The promise is real

Spec-driven development solves a genuine problem.

Vibe coding, the loose habit of prompting an agent sentence by sentence and accepting whatever comes back, falls apart as systems grow. There is no shared intent, no acceptance criteria, no record of why the code looks the way it does. You end up with a pile of locally-correct fragments and no way to reason about the whole.

Writing a spec first forces you to think before you generate. It gives the agent explicit goals instead of a vague vibe. It gives the team something to review that is smaller and clearer than a thousand lines of generated code.

All of that is worth having.

The trouble starts when the spec is treated as the thing you get right once, up front, before the building begins.

## We have seen this movie

Big design up front was the core promise of waterfall. Gather all the requirements, write the complete specification, get sign-off, then build exactly that. Each phase finishes before the next one starts.

It failed for a reason that has nothing to do with discipline or tooling. The requirements you write down at the start are your best guess, and your best guess is wrong in ways you cannot see yet. You learn what the system should do by building it, showing it to people, and watching reality push back.

The whole agile movement was a response to this. Ship something small, get feedback, adjust. Treat the plan as a hypothesis, not a contract.

Spec-driven development can quietly bring the waterfall assumption back in.

The spec feels authoritative. It is detailed, it is versioned, it is the input the agent obeys. That authority makes it tempting to write the spec as if you already know the answer, hand it off, and treat the build as execution of a settled decision.

If you genuinely know what you want, this is fine. A payment webhook handler with a documented contract, a CSV export with a known format, a migration with clear before-and-after states. The problem is well understood, so a complete spec up front is honest.

Most product work does not look like that.

## Knowing is the hard part

When the requirement is "let users track their leads somehow" or "we want to handle payments," the spec is not a description of a known thing. It is a set of assumptions about a thing you have not validated.

You can write that spec in great detail. You can specify the lead stages, the notification rules, the bulk import, the permission model. The agent will happily build all of it. None of that detail makes the assumptions more correct. It just makes them more expensive to be wrong about, because now there is a polished implementation defending each one.

A vague prompt that produces throwaway code at least signals its own uncertainty. A precise spec that produces a confident, complete build hides the uncertainty under a layer of structure. The team reviews the spec, the spec looks thorough, everyone moves on. The questions that should have been asked never come up, because the document already sounds like it answered them.

This is the same failure mode I wrote about with [AI-generated ADRs](/en/blog/p/ai-generated-adrs): a well-structured document can make a guess look like a decision.

## Iterate the spec, not just the code

The fix is not to abandon specs. It is to stop pretending the spec is finished.

Treat the spec the way you would treat any plan in a feedback-driven process. Write the smallest version that captures what you actually know right now. Build that. Put it in front of real users or at least real data. Learn what you got wrong. Then change the spec.

A few things follow from this.

Keep the first spec deliberately thin. Specify the part you are confident about, and leave the uncertain parts marked as open questions instead of inventing answers for them. A spec with three honest "we don't know yet" notes is more useful than one with thirty confident paragraphs of fiction.

Build to learn, not to finish. The first implementation exists to tell you whether the assumptions hold. If watching someone use it changes your understanding, that is the spec doing its job, not failing at it.

Update the spec when reality disagrees with it. The version that matters is the current one, the one that reflects what you now know. A spec that still describes the original guess two months in has stopped being a specification and become an artifact.

## What the spec is actually for

The value of a spec is not that it is complete. It is that writing it forces the thinking, and that it keeps the agent inside boundaries you chose on purpose.

A good spec makes you confront the questions early. Who is this for? What has to be true for it to work? What are we explicitly not doing yet? Those answers are worth more than any acceptance criterion, because they shape what gets built at all.

The agent needs the spec for a different reason. Left to a loose prompt, it drifts toward whatever sounds like a reasonable general solution, the same way it reaches for microservices and message brokers when you ask it about architecture. A spec is the leash. It tells the model which problem you are solving and which solutions are out of bounds.

Neither of those jobs requires the spec to be right on the first try. Both of them survive iteration just fine.

So if you adopt spec-driven development, adopt the spec as a living input to a feedback loop. The teams that get burned are the ones who write the spec once, trust it because it is detailed, and rediscover thirty years late why we stopped building software that way.

---

If this made you look again at a spec you wrote with a little too much confidence, it will probably help someone on your team too.

Share it with the people who are reaching for spec-driven workflows right now - and if you want more hype-free thinking on delivery and architecture, subscribe to my YouTube channel or follow me on LinkedIn.
