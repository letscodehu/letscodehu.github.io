Many engineering teams develop a reflex:

> if something can break, prepare for it.

An external system might send bad data, so we validate.  
Missing fields often get defaults.  
We try to start the application even without configuration.  
When `null` appears, another branch quickly gets added so the flow does not stop because of it.

When we think about engineering reliability, aviation (or even space travel) often comes up as the example:

- redundant systems,
- backup instruments,
- emergency procedures,
- multiple layers of safety.

There is no quick hotfix in the air. So the conclusion seems reasonable:

> a good system prepares for every possibility.

And that is exactly where we usually misunderstand aviation.

In aviation, reliability is not born from redundancy alone. It is just as important that engineers simplify the system wherever they can.

## Old, simple solutions

Several technologies in small general aviation aircraft can look "outdated" at first glance.

Many small aircraft still use a **carbureted engine**. In a car, that would feel old, because modern electronically controlled fuel injection has taken its place.

In an aircraft, though, there is a very practical engineering logic behind it:

> fewer parts, simpler operation, easier fault diagnosis, smaller failure surface.

The same is true for **magneto ignition**.

Many aircraft engines do not rely on the battery the way an average car's ignition does. The magneto generates the spark by itself.

With a partial electrical failure, a dead battery, or an alternator problem, the engine can keep running even while the radio or transponder may stop.

This is a redundant solution, because there are obviously two spark plugs and two ignition circuits. At the same time, it simplifies the system because it removes an entire dependency chain from critical operation.

The lesson from aviation is more precise:

> critical points need backup, while everything else should keep as few things as possible that can break.

That distinction easily gets blurred in software.

We tend to believe reliability means writing another `if` for every uncertainty. Often, that is exactly what creates the complexity.

## When the test imagines too much

I worked on a project where we had a large acceptance test suite.

Starting those tests brought up the full system. External integrations received responses from stored JSON files, and on paper we were prepared for many invalid states.

Over time, nobody maintained those fake responses. Payloads accumulated that practically could not have arrived from the real partner system.

For example (with a very large handful of exaggeration):

```json
{
  "customerId": null,
  "status": "",
  "billingProfile": {
    "currency": null
  }
}
```

According to the external contract, this is an invalid response. It is data that should have been caught at the boundary.

The team reacted like this:

> well, if the test sends it, the system should handle it.

That produced mappers like this:

```python
def map_customer(response: dict) -> Customer:
    customer_id = response.get("customerId") or "UNKNOWN"
    status = response.get("status") or "PENDING"

    billing = response.get("billingProfile") or {}
    currency = billing.get("currency") or "EUR"

    return Customer(
        customer_id=customer_id,
        status=status,
        currency=currency
    )
```

At first, these lines look fine: a little fallback, a little null safety, a little defensive coding.

This is exactly where a shift happens that many people miss:

An error becomes a legitimate system state, even though the input should already have been rejected at the boundary.

## The cost of fallback

When we write:

```python
status = response.get("status") or "PENDING"
```

we are actually creating a new business state.

There is the real `PENDING`, where the partner really sent that value. Next to it appears the case where no status was received, so the system treats the record as `PENDING`.

From a business perspective, those are two different things. In the code, they will behave the same way.

Then come the `UNKNOWN` customer, the default currency, the empty billing profile, the fallback locale, and the optional feature flag.

Every one of these decisions creates new combinations.

System complexity often comes from having too many ways to "still kind of work".

Just like an overcomplicated machine where every part has another detour, helper switch, and temporary bypass. After a while, nobody knows how things are supposed to behave in the normal case.

## AI amplifies the pattern

In AI-assisted development, this pattern can easily become stronger.

Statistically, models tend to prefer code that looks "safe":

- `or default`,
- `if not x return fallback`,
- `try/except pass`,
- optional parameters everywhere.

For a simple config loader, you can easily get something like this:

```python
import os

def get_config():
    return {
        "db_host": os.getenv("DB_HOST", "localhost"),
        "db_port": int(os.getenv("DB_PORT", "5432")),
        "db_user": os.getenv("DB_USER", "app"),
        "db_password": os.getenv("DB_PASSWORD", "")
    }
```

At first, it looks "robust".

In reality, it is like wiring a critical flight system into a lot of unnecessary electronics because that makes it look more modern.

It may be more convenient. It may look smarter. In exchange, it opens more ways to fail.

In production, a missing `DB_HOST` should be an immediate startup error, not a socket timeout minutes later.

## Redundancy and simplicity

We rarely apply this engineering lesson consciously in software.

### 1. External uncertainty

Network failures need a retry strategy. A circuit breaker can sit in front of an external service. At the infrastructure level, multiple availability zones and a backup queue can provide reserve capacity.

Here, the failure is created outside our system, so controlled continuation is useful.

### 2. Internal invariants

Required configuration should stay required. The domain contract should be strict. Invalid payloads should fail at the boundary. Inside the system, only known states should exist.

Most teams blur these two situations together today.

They apply the same defensive mindset everywhere. This builds redundant behavior even where a narrower, clearer state space would be more useful.

## Belongs in an AI guideline

If we code with AI assistance, a section like this in `agents.md` can help:

```md
## Invalid state policy

- Required environment variables must fail application startup if missing
- External contract violations must raise explicit exceptions at adapter boundary
- Domain required fields must not receive silent fallback defaults
- Unknown business state must never be mapped to an existing valid state
- Prefer fail-fast over best-effort continuation for invalid internal conditions
```

This is useful because, without a rule, AI often copies the "prepare for everything" pattern.

## Automated rules

Because AI may or may not follow rules, it can be worth enforcing this way of thinking even at the ArchUnit level.

For example, we can forbid defaults for critical configuration:

```java
@ArchTest
static final ArchRule critical_config_must_not_have_defaults =
    fields()
        .that().areDeclaredInClassesThat().resideInAPackage("..config..")
        .should().notBeAnnotatedWith(Value.class);
```

The point is:

**narrowing valid states should be checked just like code style.**

## Few possible states

The lesson worth taking from aviation is that critical points need backup, while everywhere else operation should stay as simple as possible.

A small aircraft is more reliable in some areas because it contains fewer components that can behave in unexpected ways.

The same is true in software.

Every extra fallback, unnecessary default, and "maybe it should still work" branch creates a new state. More testing combinations become necessary, and it only opens more ways to fail.

In the age of AI, an important engineering skill will be seeing exactly where to build redundancy and where to simplify.

Reliability increases when fewer things can go wrong in the first place.
