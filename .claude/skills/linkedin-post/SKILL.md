---
name: linkedin-post
description: Generate LinkedIn post copy for letscode.hu from an existing blog post or YouTube video script, matching the brand's direct, practical voice. Use when promoting a published or drafted article/video on LinkedIn, repurposing long-form content into a short social post, or producing HU/EN LinkedIn variants.
allowed-tools: Read, Glob, Grep
---


## Goal

Turn one piece of existing letscode.hu content — a blog post or a YouTube video script — into ready-to-paste LinkedIn copy that carries the same thesis, keeps the brand's direct and practical voice, and is written for how people actually read on LinkedIn (strong first line, scannable, one clear takeaway, one link).

This skill does not invent new arguments. It repackages what the source already says. If the source is thin or unfinished, say so rather than padding.

## Identify the Source

Figure out exactly which content to repurpose before writing. Accept any of:

- A blog slug → read `content/blog/<slug>/en.md` and `content/blog/<slug>/hu.md`.
- A blog title or topic → resolve it against `src/data/blog-post-manifest.ts` to find the slug, then read the markdown pair.
- A YouTube video → a file in `content/Youtube/*.md` (titles like `Video 11 Script - ...`). Prefer the `(Teleprompter)` version when both exist.
- A `videoUrl` → match it to a manifest entry to find the related blog post, and use both the script and the article.

Many videos and posts are two takes on the same idea (the manifest links them via `videoUrl`). When both a blog post and its matching script exist, read both — the blog gives the precise argument, the script gives the punchiest lines and the hook.

If you cannot unambiguously identify the source, ask which one before drafting.

## Decide Language and Count

Resolve these from the request; if unstated, default and say so:

- **Language** — HU, EN, or both. Default: **match the language the user is writing in** for this request. Offer the other language as a quick add-on.
- **Variants** — default **2 distinct posts** per language (different hooks/angles on the same thesis), so the user can pick.
- **Link** — include the canonical URL when known: blog `https://letscode.hu/<lang>/blog/p/<slug>`, or the `videoUrl` for a video. If unknown, leave a clear `[LINK]` placeholder rather than guessing.

## Extract Before Writing

From the source, pull the raw material for a post:

- **The one-sentence thesis** — the single point the post argues.
- **The hook** — the most concrete opening situation, surprising claim, or sharp number in the source. The blog's opening lines and the video's first 5–6 lines are the best mine for this.
- **2–4 supporting beats** — the strongest specifics: a concrete example, a tradeoff, a named consequence, a memorable reframing.
- **The takeaway** — what the reader should do or think differently.

## LinkedIn Writing Rules

Match the blog voice (see `new-blog-post` and `.cursor/rules/blog-style.mdc`), adapted to the platform:

- **Hook the first line.** It is the only line shown before "see more". Make it a concrete situation, a sharp claim, or a real number — never "I wrote a new post about…". No clickbait, no fake cliffhangers.
- **One idea per post.** A LinkedIn post argues one thing. If the source has three theses, pick one per variant.
- **Short lines, generous whitespace.** Single-sentence paragraphs, blank lines between them. No walls of text.
- **Lead with value, not the link.** Deliver the insight in the post itself so it stands alone; the link is for going deeper.
- **One CTA, one link.** End with a single clear next step (read / watch / what's your take), then the link. Put the link near the end — LinkedIn suppresses reach on posts that open with an external link.
- **Length** — aim ~120–200 words. Long enough to land one real point, short enough to read in a feed.
- **Hashtags** — 3–5 relevant, specific ones at the very end (e.g. `#SoftwareArchitecture #TechDebt #AI`). No hashtag soup.
- **No emoji spam.** At most one, only if it genuinely helps. The brand voice is direct, not bubbly.
- **No engagement-bait** ("comment YES", "tag a friend", "🔥🔔"). It cheapens the brand.
- Reuse "not X, but Y" framing and intensifiers **sparingly** — same restraint as the blog.

### Hungarian-specific rules

When writing HU posts, apply the same Hungarian editorial rules as the `new-blog-post` skill, notably:

- Keep English tech terms (`agent`, `spec`, `prompt`, `microservice`, `edge case-k`, …) — do not magyarize jargon.
- Natural Hungarian word order, not translation order.
- At most one exclamation mark, reserved for the sharpest line.
- Use `persze`, „Csakhogy", „Pedig", „Viszont" for concessions and turns.

Do not translate the EN post mechanically into HU. Write each language idiomatically from the shared thesis.

## Output

For each requested language, return the requested number of variants, each as:

- A short label naming the angle (e.g. *"Hook: the cost of a missed question"*).
- The full post copy in a single fenced code block, ready to copy-paste, with line breaks and hashtags exactly as they should appear.

After the variants, add one line noting which source(s) you used (slug and/or script filename) and the link you embedded or the placeholder you left.

Keep commentary minimal — the user wants paste-ready copy, not analysis.
