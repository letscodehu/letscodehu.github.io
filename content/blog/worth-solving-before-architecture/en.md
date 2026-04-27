Imagine you are about to design a new system. You sit down, open your notes, maybe a diagramming tool, and your mind immediately jumps to the usual questions. Monolith or microservices? Which database? Which tech stack? Maybe you even think: "Should this be scalable from day one?" At first glance, this all seems perfectly reasonable.

But there is one step that should come before all of that.

There is one question almost nobody asks: *what problem are you actually solving?* Not the feature. Not the system. The real problem.

## How this usually happens

Imagine a user comes to you and says: "It would be great if we could track leads somehow." Sounds simple, right? What follows is usually less simple.

Our brain instantly rushes toward solutions. The internal checklist starts spinning: we need a backend, we need a frontend, authentication of course, likely integrations too.

At some point someone throws in microservices, just in case.

Meanwhile nobody pauses to ask: *what exactly does "tracking leads" mean here?* What are the steps, who does what, how often, and what counts as success?

Designing systems is fun. Deeply understanding the problem is work.

## Another story that feels too familiar

Now imagine the next request: "I want to handle payments." In many teams, this kicks off the exact same script.

You are already thinking: we need user accounts, login, maybe roles and permissions, webhooks almost certainly, some containerized infrastructure, a load balancer, monitoring.

It starts to look like a proper "real system." The kind of thing you would be happy to show others.

Then you step back and ask: *what is actually happening here?*

This person maybe sends two invoices per week. There is no gated content, no subscription model, no complex billing logic. They simply want to get paid.

And we have already turned a very simple process into a full architecture decision problem.


## What does the data say?

This is not just intuition or personal experience. There is a lot of research behind it.

If you look at DORA reports, high-performing teams are not successful because they build more sophisticated or more impressive systems. They are successful because they *deliver value faster*.

They focus on lead time, feedback speed, outcomes. Not on how "future-proof" the architecture looks.

And then there are the CHAOS reports. For years they have shown roughly the same thing: a large part of built features is barely used, or never used meaningfully by anyone.

If you think this through, it is hard to argue that our biggest risk is failing to design big enough. The bigger risk is spending huge energy overengineering things that carry very little weight in day-to-day reality.

## Questions that rewrite everything

So before you even open Excalidraw, it is worth slowing down for a minute and asking a few very basic questions.

Who is this for? What are they actually trying to achieve? How often will they use it? How painful is this problem right now?

And maybe the most important one: *what happens if this system is never built?*

If the honest answer is something like: "Well, they will cope... it will just be a bit less convenient," then you are probably not dealing with a business-critical, system-level problem.

You are dealing with inconvenience, a little friction in the process. You can still build a system for that, but the cost and speed of that decision matter a lot.

## Two very different paths

Let us go back to the examples: lead tracking, handling payments. In both cases, you basically have two paths.

The first one is very simple.

You take a general-purpose tool: Notion, Google Sheets, manual invoicing, a Stripe payment link, and put together a minimal process. Not elegant, not fully automated, but quick, and it creates value immediately.

After a few hours of work, you already see where the process gets stuck, what people forget, and where automation is actually worth it.

The second path is much more familiar to developers.

You build a system. Backend, frontend, authentication, infrastructure, monitoring, CI/CD. Now you have something truly impressive - at least from a technical point of view.

But it is also hard. Slow to build, expensive to maintain. Meanwhile time passes, and the environment does not stand still: priorities change, context evolves, sometimes the need itself disappears.

*That is when you realize the simplest solution would have lasted much longer.*

Not because it is technologically "smarter," but because it tells you faster whether it works, and demands less sacrifice when you need to change it. It is easier to drop or reshape something you built in a few days than a multi-month implementation.

![Two paths](/blog/chaos.png)

## When architecture truly matters

Of course, this does not mean "never build systems," or that architecture is secondary.

There are situations where architecture absolutely matters: when you are dealing with real scale, when multiple teams must work independently, when the domain is inherently complex, or when you operate in a strict regulatory environment.

In those cases, more sophisticated solutions are fully justified. It is just important to separate "we truly cannot fit into this anymore" from "we might need this someday."

Practice shows quite often that this "someday" either never comes, or arrives in a completely different form than we imagined.

## What is really happening in the background?

Most overengineered systems are not driven by bad intent, and not necessarily by missing expertise. More often, they are driven by uncertainty.

We do not want to make the wrong decision. We want to prepare for every possible future. And if we are honest, sometimes part of it is that building something "impressive" feels good, something we can be professionally proud of.

*The twist is that when you design for too many possible futures at once, focus easily drifts away from the one or two things that truly matter now.*

Instead of finding the one concrete problem worth solving today, and the simplest solution that is already good enough.

## One question that saves a lot of unnecessary work

You rarely see projects fail because the first version was too simple. You see far more cases where months are burned supporting a future that never becomes real.

So next time you are about to open the diagramming tool, before drawing boxes and arrows, before deciding on architecture, pause for a moment.

*Ask yourself this:*

**Is this problem even worth solving right now?**

If the answer is yes, then you can start discussing how large the system should be, and what the first version should look like to prove it is worth building further.

---

If this article made you pause a little before drawing the first box, it will probably help others too.

Share it with people who regularly build too big too early - and if you want more hype-free thinking on delivery and architecture, subscribe to my YouTube channel or follow me on LinkedIn.

---

## Sources

DORA / Accelerate State of DevOps  
<https://dora.dev/research/>

Standish Group CHAOS Report summary  
<https://www.projectsmart.co.uk/white-papers/chaos-report.pdf>

Accelerate (Forsgren, Humble, Kim)
