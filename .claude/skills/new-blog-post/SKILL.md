---
name: new-blog-post
description: Create new bilingual letscode.hu blog posts from an idea or outline, matching existing post length, structure, and voice. Use when adding a blog post, drafting a HU/EN article pair, updating blog metadata, or preparing blog content for publication.
---


## Goal

Create an English and Hungarian blog post pair that fits the existing letscode.hu blog: practical software architecture writing, clear examples, direct tone, and similar long-form pacing.

## Discovery

Before drafting, gather or infer:

- Topic, target reader, and the practical problem the post should address.
- Intended thesis in one sentence.
- Preferred slug, publish date, optional `videoUrl`, and optional `featuredImagePath`.
- Whether the user provided an idea, outline, or existing rough notes.

If key metadata is missing, propose sensible values and ask only for decisions that affect publication.

## Read Before Writing

Always inspect current project context first:

- `.cursor/rules/blog-style.mdc`
- `docs/blog.md`
- `src/data/blog-post-manifest.ts`
- `src/seo/prerender-paths.ts`
- At least 2 recent post pairs from `content/blog/<slug>/en.md` and `content/blog/<slug>/hu.md`

Use the examples to match approximate length, section density, paragraph rhythm, and CTA style. Prefer nearby recent posts over older ones.

## Writing Guidance

Use a balanced style match:

- Keep the thesis practical and architecture-focused.
- Start from a concrete situation, story, or recognizable team behavior.
- Build the argument through consequences, tradeoffs, and useful guidance.
- Keep paragraphs short enough for web reading, with varied sentence starts and sentence lengths.
- Avoid anaphora, slogan-heavy repetition, exaggerated adjectives, and moralizing language.
- Avoid mirrored contrast patterns like "not X, but Y"; state the intended point directly.
- Use examples from software delivery, architecture decisions, testing, CI/CD, scaling, product validation, or team process when relevant.
- Keep the HU and EN versions aligned in structure and thesis, while writing idiomatically in each language.

Do not translate mechanically. Draft the stronger source version first, then adapt the second version so it reads naturally.

### Hungarian-specific writing rules

These apply only to `hu.md` and are based on observed editorial corrections:

- **Keep English tech terms** — do not magyarize jargon that the target audience uses in English: `agent` (not `ágens`), `edge case-k` (not `szélső esetek`), `vibe` (in quotes if needed), `spec`, `prompt`, `build`, `lead`, etc. When in doubt, keep the English term.
- **Natural word order** — Hungarian allows and prefers time adverbs and topic phrases at the front: „Nemrég beszéltem…" not „Egy csapattal beszéltem nemrég…". Avoid translation-order sentences that follow the English structure.
- **Link tools on first mention** — when a named tool or product appears for the first time, add a hyperlink to its homepage or official docs.
- **Typographic emphasis** — use `_word_` italic for a single key word when the argument hinges on it (e.g. „amit egyszer, előre _kell_ megcsinálni"). Use sparingly.
- **Be direct at transitions** — do not add softening bridge sentences (e.g. „Mindez megéri.") between a positive claim and its critique. Move straight to the limitation; the contrast is sharper without the cushion.
- **"Ők is…" for relatability** — when the opening establishes that a team did what everyone does, lead with „Ők is ugyanazt…" rather than „Ugyanazt…" to signal shared experience.

## Implementation Workflow

1. Choose a slug in lowercase kebab-case.
2. Create `content/blog/<slug>/en.md` and `content/blog/<slug>/hu.md`.
3. Add one entry to `blogPostManifest` in `src/data/blog-post-manifest.ts` with:
   - `slug`
   - `publishedAt`
   - `titleEn`
   - `titleHu`
   - `excerptEn`
   - `excerptHu`
   - optional `videoUrl`
   - optional `featuredImagePath`
4. Check `src/seo/prerender-paths.ts`.
   - If it still generates blog paths from `blogPostManifest`, no route edit is needed.
   - If the project changes to explicit route lists later, add both `/en/blog/p/<slug>` and `/hu/blog/p/<slug>`.
5. If the repo rules require execution notes, add a concise `docs/blog-<slug>.md` entry covering only architecturally relevant changes.
6. Run `npm run build` after edits.

## Quality Checklist

Before finishing:

- Both markdown files exist and are complete.
- Manifest titles and excerpts match the article thesis.
- English and Hungarian versions have the same argument flow.
- The text follows `.cursor/rules/blog-style.mdc`.
- Markdown links and image paths are valid.
- No duplicated video link appears inside markdown when `videoUrl` is set.
- Build passes, or the failure is clearly reported with the relevant error.

## Final Response

Summarize the new post, mention the slug and verification result, and keep file-by-file detail short.
