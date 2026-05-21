I recently had a conversation with a colleague about testing, and it became clear pretty quickly that we were looking at the same problem from completely different angles.

He put it like this:

> "Unit tests create more damage than value."

That view is easy to understand, because we had both seen bad examples.

I talk in detail about one project in my [Continuous Failure talk](https://vimeo.com/1102474381): it relied almost entirely on integration tests, single tests could take seconds to run, and by the end the suite had become painfully slow.

I also saw the opposite extreme at a previous company. There were unit tests for almost everything, often tied to internal implementation details. Maintenance turned into a nightmare, and it triggered exactly what my colleague described: a visceral resistance to tests.

What stayed with me is this: there is a workable lane between those two extremes. This is where sociable unit tests come in.

## A painfully familiar dummy example

Let's look at a deliberately simplified dummy example that compresses patterns I have seen across multiple real teams.

A fairly simple feature arrived: calculate and persist order totals. Nothing exotic. One service, one pricing rule, one repository save.

The developer asked AI to generate tests. AI did exactly that:

- pricing service call is verified,
- repository call is verified,
- mapper is verified to be called exactly once,
- call order is verified in a specific sequence.

On paper, this looked "thorough." Coverage went up. PR merged. The team also got a *false sense of safety*.

Two sprints later, a refactor landed:

- one intermediate component was removed,
- a couple of classes were renamed,
- internal collaboration order changed.

Business behavior stayed the same. The system still calculated and persisted correctly.

Half the tests still turned red.

This is the first key realization: those tests froze internal implementation while barely protecting system behavior.

## What AI learned from training data

AI is not malicious, and it is not "dumb." It reproduces what dominates the patterns it has seen.

Across public codebases and examples, the "good unit test" pattern often looks like this:

- lots of mocks,
- lots of `verify`,
- method-call checks,
- branch-by-branch tests.

That easily produces something like:

```java
@Test
void shouldCallPricingServiceAndRepository() {
    OrderRequest request = TestData.orderRequest();

    when(pricingService.calculate(any()))
        .thenReturn(Money.of(100));

    orderService.placeOrder(request);

    verify(pricingService).calculate(any());
    verify(repository).save(any());
}
```

Technically, this is a test.

From a design perspective, it creates a fragile dependency on internal wiring.

At that point, internal rearrangement alone can break the test, even when behavior stays unchanged.

## Where it starts to hurt

For a while, nowhere. That is exactly the danger.

The pain appears once the system is alive:

- many developers touch the same module,
- refactors happen frequently,
- more and more AI-generated tests enter the codebase.

At that stage, "test maintenance" quietly becomes its own cost center.

Typical symptoms:

- PRs with 100+ lines of test churn and minimal business change,
- review fatigue because most of the change is noise,
- reflex response: "if it broke, regenerate with AI."

This works short term, but it gets expensive long term:

- in tokens,
- in review time,
- in attention,
- and most importantly, in trust toward the test suite.

## Why test speed matters

Test speed is delivery speed.

If your pipeline makes people wait long minutes or even 20 minutes to confirm a change is safe, engineering focus breaks in every cycle. The team pays for that idle time in full.

The same thing happens in AI-assisted development. Code appears at light speed, but validation still crawls, so test runtime keeps dictating overall throughput.

This is where a balanced test pyramid proves its value: fast daytime feedback with a strong safety net before release.

## Two testing extremes

Most teams drift into one of two extremes:

**1. Classic isolated unit tests with excessive mocking**  
Everything is mocked, every interaction is verified. Fast, but fragile.

**2. Full integration tests for everything**  
The entire environment boots. More realistic, but slow and hard to maintain.

In practice, the middle lane often works best: behavior-focused, small sociable tests.

Tests where:

- a few components run together with real objects,
- mocking is minimal,
- outcome and observable behavior are what matter.

For example:

```java
@Test
void shouldCalculateFinalPriceForOrder() {
    InMemoryOrderRepository repository =
        new InMemoryOrderRepository();
    PricingService pricingService = new PricingService();
    OrderService service =
        new OrderService(pricingService, repository);

    OrderRequest request = new OrderRequest(
        List.of(new Item("Book", 2, Money.of(50)))
    );

    Order order = service.placeOrder(request);

    assertThat(order.total())
        .isEqualTo(Money.of(100));
    assertThat(repository.findAll()).hasSize(1);
}
```

This test style survives internal refactors much better, because it does not swear loyalty to internals.

One weak spot remains: the test setup. When a new collaborator enters the `OrderService` constructor, the test still needs an update, even if business behavior stays the same.

A factory class helps by keeping wiring in one place:

```java
class OrderServiceFactory {
    @Bean
    public OrderService create(OrderRepository repository) {
        return new OrderService(new PricingService(), repository);
    }

    public OrderService forTesting() {
        return create(new InMemoryOrderRepository());
    }
}
```

The `create` method wires `OrderService`: it receives the repository, instantiates `PricingService` alongside it, and builds `OrderService` from those parts.

> The `@Bean` annotation tells Spring to produce `OrderService` from this method at runtime. In production you do not wire dependencies by hand with `new`; the framework injects the repository.

`forTesting` reuses the same wiring logic with an in-memory repository meant for tests. In the test, we only depend on that entry point:

```java
@Test
void shouldCalculateFinalPriceForOrder() {
    OrderService service = new OrderServiceFactory().forTesting();

    OrderRequest request = new OrderRequest(
        List.of(new Item("Book", 2, Money.of(50)))
    );

    Order order = service.placeOrder(request);

    assertThat(order.total())
        .isEqualTo(Money.of(100));
}
```

If an `AuditLogger` is added to `OrderService` later, that change stays inside the factory. The behavior-focused test can keep running unchanged.

For completeness: solitary unit tests also have a place, just rarely.

They are useful when you need to isolate purely algorithmic, deterministic logic, or when you are targeting a hard-to-reproduce edge case.

In those situations, full isolation helps. As a default strategy, though, it usually creates more noise than stability for most teams.

## A practical order of operations

The core decision is the contract you ask AI to satisfy with tests.

This order works well for us:

1. **First**: define the behavior you want to protect.  
   What must the system guarantee in business terms?
2. **Then**: choose the test level.  
   Unit, sociable unit, integration?
3. **Only after that**: generate tests with AI.  
   Prompt for behavior assertions, not interaction checklists.
4. **Finally**: review for more than syntax.  
   Ask: will this test survive the next refactor?
5. **Add technical guardrails**.  
   Use ArchUnit tests or linter rules to prevent AI from defaulting to uncontrolled mock-heavy patterns.

If the answer is no, you are just generating noise faster.

## Coverage: useful metric, dangerous target

Coverage can be a useful metric.

As a target, it quickly misleads.

The moment it becomes a KPI, teams start optimizing the number instead of optimizing system safety.

AI is especially effective at this: it can rapidly generate tests that execute lines without protecting decisions.

That is why "95% coverage" alone tells you very little about:

- whether a module is safe to refactor,
- whether red tests provide meaningful feedback,
- or whether only internals changed.

## Conclusion: AI amplifies your testing strategy

With a weak testing strategy, AI scales noise faster.

With a strong testing strategy, AI scales value at the same speed.

That is the whole story.

AI can write tests. *Without hesitation.*

The real question is whether you provide a framework where the output:

- documents behavior,
- survives refactors,
- and delivers a real safety net.

Because `verify(userRepository, times(1))` on its own is not a testing strategy.

As long as software has existed, test quality has often been treated as a second-class concern.

Today this slips even more easily, because it is tempting to think AI will just generate tests for us anyway.

The reality is that neglected tests have always slowed delivery, increased noise, and weakened confidence in change.

AI does not exempt teams from that cost. At best, it makes the problem visible faster.

If you want to go deeper on this topic, I will be speaking about it in a few days at [Weblica conference](https://weblica.hr).

If your team needs urgent help getting its testing strategy under control, [reach out here](/en/contact).