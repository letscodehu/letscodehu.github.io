---
name: review-blog-post
description: Review a freshly drafted letscode.hu blog post for factual accuracy, style/voice alignment with existing posts, and topical originality (not too similar to what already exists). Use after drafting or editing a HU/EN post pair, before publishing, or when asked to fact-check, sanity-check, or vet a blog draft.
allowed-tools: Read, Glob, Grep
model: sonnet
---


## Goal

Vet a freshly created blog post before publication on three axes:

1. **Factually correct** — claims, names, APIs, numbers, and technical assertions hold up.
2. **Aligned** — it matches the existing blog's voice, length, structure, and quality bar.
3. **Original** — it covers genuinely new ground and is not too similar to an existing post.

This is a review skill: it reports findings and recommends fixes. It does not silently rewrite the post. Apply fixes only when the user asks, or after surfacing them.

## Identify the Post Under Review

Determine which draft to review (ask only if ambiguous):

- The slug or folder under `content/blog/<slug>/`.
- If unspecified, infer from recent git changes (`git status`, `git diff`) or the most recently added folder / newest `publishedAt` in `src/data/blog-post-manifest.ts`.

Confirm both `en.md` and `hu.md` exist and read both fully, plus the post's manifest entry (`titleEn/Hu`, `excerptEn/Hu`).

## Read Before Reviewing

Establish the baseline the post must align with:

- `.cursor/rules/blog-style.mdc` — the authoritative style rules.
- `docs/blog.md`.
- `src/data/blog-post-manifest.ts` — full list of existing slugs, titles, and excerpts.
- At least 3 recent post pairs from `content/blog/<slug>/{en,hu}.md` for length, density, paragraph rhythm, and CTA style.

## 1. Factual Accuracy

Check every checkable claim. Be skeptical of confident-sounding specifics.

- Technical assertions: API names, flags, config keys, command syntax, language/framework behavior, version-specific claims.
- Named tools, products, standards, people, and quotes — exist and are described correctly.
- Numbers, benchmarks, dates, and statistics — plausible and, where stated as fact, sourced.
- Cause/effect and "best practice" claims — defensible, not overgeneralized.
- Internal consistency — the post does not contradict itself across sections or between EN and HU.

For anything uncertain or externally verifiable, use WebSearch/WebFetch to confirm rather than guessing. Flag claims that are unverifiable, outdated, or stated more strongly than the evidence supports. Distinguish hard errors (wrong) from softer issues (overstated, needs a caveat).

## 2. Alignment With Existing Posts

Compare against the style rules and recent posts:

- **Voice/tone**: practical, architecture-focused, direct. No hype, slogans, anaphora, moralizing, or "not X, but Y" mirrored contrasts.
- **Length & density**: roughly in range with recent posts — not markedly shorter or thinner.
- **Structure**: concrete opening situation → argument via consequences/tradeoffs → useful guidance; section and paragraph rhythm comparable.
- **Bilingual parity**: EN and HU share the same thesis and argument flow; neither reads like a mechanical translation; both idiomatic.
- **HU naturalness** — flag these specific HU issues if present:
  - Over-magyarized tech terms: `ágens` instead of `agent`, `szélső esetek` instead of `edge case-k`, `szállíts` for `deliver` when the audience would say `szállíts` naturally but not when it sounds stiff. Use English terms when the HU tech community uses them in English.
  - Translation-order sentences that mirror the English structure instead of using natural Hungarian word order (e.g. time adverbs belong at the front in HU).
  - Missing hyperlinks: named tools and products should be linked on first mention.
  - Softening bridge sentences between a positive claim and its critique — these weaken the argument; the transition should be direct.
- **Metadata**: manifest title and excerpt match the article's actual thesis in both languages; slug is lowercase kebab-case; `featuredImagePath` resolves if set.

## 3. Originality (Not Too Similar)

The post should add something, not restate an existing one.

- List existing slugs/titles/excerpts and identify the closest 1–3 posts by topic.
- Read the nearest neighbor(s) in full and compare thesis, framing, examples, and conclusions.
- Judge overlap: does the new post make a distinct point, or largely re-argue an existing one? Note this blog has clusters (e.g. AI, ADRs, over/under-engineering, scaling) — adjacency is fine, redundancy is not.
- If overlap is high, recommend a sharper angle, a cross-link to the related post, or a merge — whichever fits.

## Output

Report a concise, prioritized review:

- **Verdict**: ready to publish / needs minor fixes / needs significant work.
- **Factual issues**: each with location, the problem, and the correction (note confidence and any source checked).
- **Alignment issues**: style, length, structure, bilingual parity, or metadata gaps.
- **Originality**: closest existing post(s), overlap assessment, and recommendation.
- **Suggested next steps**: the few highest-impact edits.

Cite findings with `file_path` and quote the offending text so each is easy to locate. Keep praise brief; focus on what to change. Offer to apply the fixes rather than applying them unprompted.
