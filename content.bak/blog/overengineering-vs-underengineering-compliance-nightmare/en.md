Every team has that moment when a seemingly trivial request lands on their desk. No new architecture, no new product, just a tiny "can we quickly add this?" feature. It is easy to wave it away: _"come on, this is five lines max, let's not overthink it"_.

That is exactly where underengineering can explode just as badly as overengineering.

On one side, we all know the classic pattern: everything is a microservice, every flow gets a dedicated event bus, three caches, five proxies, because "we might need it one day." This is the overthought, overbuilt, unnecessarily complex world.

The other trap is less visible: when we simplify something _so much_ that we ignore business, legal, compliance, and operational reality altogether. Sometimes that starts with a single REST endpoint.

That is exactly what happened in this story. The request looked harmless: **"we need an endpoint to delete a tenant from the system"**. The team almost jumped on it by reflex: "fine, this is about five lines, we can squeeze it into the sprint."

Spoiler: those five lines came very close to becoming a compliance minefield.


## The Feature That Looked Like Five Lines

Let us start from the beginning.

The request sounded like this: _"Add an API endpoint that can delete all data of a tenant. GDPR, data protection, that kind of thing. No need to overthink it, just delete the related records."_

If you only look at the technical surface, your brain immediately imagines this:

- create `DELETE /tenants/{tenantId}`,
- call a repository from the handler,
- run `DELETE FROM ... WHERE tenant_id = :tenantId`,
- return `200 OK`,
- _"done, literally five lines"_.

In a single-region, single-product, single-database sandbox project, this would almost be true.

But that was not the reality.

The actual system looked more like this:

- it ran in multiple **regions**, each with separate databases,
- multiple **products** shared the same tenant concept,
- some data was **archived**, some **logged**, and some **cached**,
- and all of this lived under **GDPR**, internal **retention policy**, and other industry compliance requirements.

At that point, this is not a "delete from tenant where id = ..." problem anymore. It is a **complex business process**, where an HTTP endpoint is merely one technical tool.


## When Underengineering Starts Hurting

The team's first reaction was still the common one:

- "How should auth work? HTTP Basic or JWT?"
- "Do we need idempotency? What if they call it twice?"
- "Should deletion be synchronous or asynchronous?"

They did not notice the discussion had stalled at the wrong level.

The real questions start elsewhere:

- **Where does tenant data actually live?**
  - In how many databases, regions, and product components?
- **What is the source of truth for tenant lifecycle?**
  - Who decides a tenant exists, and who decides it is ready for deletion?
- **What does deletion mean in business terms?**
  - Is it irreversible? Or deactivate first, then delete after X days?
- **On what legal basis do we delete?**
  - Customer request, contract expiration, non-payment, GDPR request, and are these treated differently?
- **What happens on failure?**
  - If three out of five systems delete successfully and two fail, is the tenant now half-existing?
- **Who can audit this later, and how?**
  - If an auditor asks, "Show us when and where tenant X was deleted," can we answer?

At one point someone asked the key question: _"Okay, I get that we will have an API, but do we really want to trust this entire process to a five-line controller function?"_

That was the moment the underengineering risk became obvious. The problem was not thinking in terms of a REST endpoint. The problem was thinking **only** in terms of a REST endpoint.

![](/blog/orchestration.png)

## Multi-Region, Multi-Product Is Not a Minor Detail

A closer look makes clear why this was slippery.

**1. Multiple regions**  
Tenant data existed across multiple geographic regions, partly for compliance, partly for latency. If we delete in one region but not another, tenant data still exists.

- Who initiates deletion? A central system? Regional components?
- What if one region is unavailable? Retry? Deferred deletion?
- Do we require completion in **every** region before we mark deletion as done?

**2. Multiple products**  
The same tenant identifier was used across products. That sounds simple while discussing login. The moment deletion appears, cracks show:

- Does every product know what to do when it receives a deletion event?
- Are there logs or audit trails under retention rules (for example, must be kept for five years)? Those must _not_ be deleted.
- Is there tenant-scoped data that legally cannot be deleted immediately (billing, accounting, contracts)?

**3. Orchestration**  
With multiple regions, products, and data sources, someone must **orchestrate** the process.

This is where overengineering reflexes often appear: "Then we need a global workflow engine with BPMN, event sourcing, sagas, the whole package."

But underengineering is no better: "The `TenantController` will just call services one by one, done."

The right answer is usually in between:

- define a **clear model** for deletion steps,
- have a **reliable component** execute those steps,
- track progress with a **state machine** or status (`initiated`, `in_progress`, `failed`, `completed`),
- keep an **auditable log** of what happened, when, where, and with what outcome.

That is no longer five lines. But it also does not require a NASA flight control center.


## From a Compliance Lens, This Is Not Nice to Have

The story became serious when compliance/legal entered the discussion.

Questions started sounding like this:

- "How do we prove to authorities that data was truly deleted?"
- "What if a customer asks in two years for the exact deletion timestamp?"
- "Are we sure **all** data is deletable? What about invoices, accounting records, contracts?"
- "How do we prevent a malicious operator from deleting random tenants?"

At this point it was clear that "let's add a DELETE endpoint" was not only technically underengineered, but also **business- and legal-wise underengineered**.

A compliance-acceptable solution needs at least:

- **Authorization**: who may trigger deletion, in what context? (for example, only from internal admin systems with strict roles).
- **Audit trail**: every deletion should show who initiated it, when, for what reason, what happened, and the final result.
- **Retention rules**: never delete records that law requires us to keep for X years.
- **Fail-safe behavior**: avoid "zombie tenants" in partial success scenarios. Prefer rollback, retry, or explicit `failed` state with manual intervention.

None of this starts with: **"Is HTTP Basic enough?"** Auth matters, but only after we understand _what_ we protect, _why_, _from whom_, and _inside which process_.


## Where Is the Line Between Just Enough and Too Much?

This is the real overengineering vs. underengineering dilemma.

- If you **underdesign**, you get something that looks fast, simple, and done, but hides landmines: inconsistent data, missing logs, lack of auditability, compliance risk.

- If you **overdesign**, even a relatively simple process becomes expensive, hard to maintain, and overcomplicated. The team will fear touching it, and every change becomes painful.

The difference is often not tooling. It is the **order of thinking**.

A practical sequence that worked in this case:

1. **First**: understand the business and legal process.  
   What does "tenant deletion" mean in non-technical terms?
2. **Then**: map where data lives.  
   Which systems, regions, and databases are involved?
3. **Then**: define a simple but robust process.  
   What are the steps, and what happens on failure?
4. **Only then**: choose technical implementation details.  
   API, auth, orchestration, storage, logging, and so on.

The same technology can be overengineering or underengineering. The difference is what problem you are actually solving, and how well the solution fits reality.


## What Changed Compared to the Almost-Five-Line Solution?

In the end, we did not build a nuclear-grade control system. But compared to the original "five-line" idea, core things changed.

High-level outcome:

- `DELETE /tenants/{tenantId}` **did not delete directly**.  
  It only **started a deletion process** handled by a dedicated component.
- We introduced a **tenant lifecycle** model.  
  States included `active`, `pending_deletion`, `deletion_in_progress`, `deleted`, `deletion_failed`.
- A dedicated **orchestrator** handled actual deletion.  
  It executed steps across core DBs, file storage, caches, log retention pipeline, and others.  
  Every step wrote **state and logs**.
- We defined **consistent failure behavior**.  
  If any step failed, tenant moved to `deletion_failed` and entered a manual review queue.
- Deletion initiation was restricted to a **narrow, audited channel**.  
  Not a public API path, but internal admin UI with strong authentication and authorization.

This still fits normal, maintainable system complexity. We did not need twelve new microservices and five new database technologies.

But it was far from the five-line `delete where tenant_id = ...` reflex.


## Takeaway: Good Design Is Not About Looking Smart

This story is not saying: "always design huge architectures."

It is saying:

- **Underengineering** is treating a complex business/legal problem like plain CRUD.
- **Overengineering** is treating a simple problem as if it needed to serve half the planet at 99.999% SLA.

Both share the same root: poor thinking quality, mostly reflexes.

How a "tenant deletion" feature turns out depends on whether the team pauses early enough to ask uncomfortable but critical questions:

- Where does data really live?
- Who can request deletion, and on what basis?
- What happens on failures?
- What will auditors ask for?

If those answers are solid, then Basic Auth vs JWT, gRPC vs REST, and similar choices become implementation details.

And yes, sometimes five lines become fifty. If that prevents a data protection or compliance nightmare, those extra forty-five lines are not overengineering. They are **responsible engineering**.
