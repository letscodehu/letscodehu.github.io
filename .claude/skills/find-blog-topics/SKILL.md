---
name: find-blog-topics
description: Find and rank fresh blog topic ideas for letscode.hu, grounded in what the blog already covers, what readers are discussing, and current industry conversation. Use when brainstorming new posts, looking for an angle, checking whether an idea is fresh, or building a backlog of topic candidates before drafting.
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch, mcp__reddit__search_reddit, mcp__reddit__browse_subreddit, mcp__reddit__get_top_posts, mcp__reddit__get_post_comments, mcp__reddit__get_subreddit_info, mcp__reddit__get_trending_subreddits, mcp__reddit__get_reddit_post
model: sonnet
---


## Goal

Propose blog topic ideas that fit letscode.hu and are worth writing: practical software architecture and delivery topics, aligned with the existing voice, distinct from what's already published, and connected to what practitioners actually care about right now.

This is a research-and-suggest skill. It does not draft posts — it returns ranked topic candidates with enough context to decide. Hand a chosen topic to the `new-blog-post` skill afterward.

## Know the Existing Blog First

Never suggest topics blind. Establish the baseline before searching:

- `.cursor/rules/blog-style.mdc` — voice, tone, and what the blog is about.
- `docs/blog.md`.
- `src/data/blog-post-manifest.ts` — the full list of slugs, titles, and excerpts already published.
- Skim `content/blog/<slug>/en.md` for a few recent posts to feel the depth and angle.

Build a short internal map of covered themes and clusters (e.g. ADRs, AI in architecture, over/under-engineering, tech debt, testing, CI/CD, scaling, C4 modeling). A new topic should extend or sharpen a cluster, or open a clearly new one — not restate an existing post.

## Gather Signal

Pull from multiple sources so ideas reflect real conversation, not just one feed.

**Reddit** — what practitioners are discussing and frustrated by:
- Search relevant subreddits (e.g. r/ExperiencedDevs, r/softwarearchitecture, r/programming, r/devops, r/SoftwareEngineering) for recurring questions, debates, and pain points.
- Use top/trending posts and read comment threads to find the *real* tension under a topic, not just the headline.
- Note framing readers use — their words make better titles than abstract jargon.

**Web search** — current industry conversation:
- Search for recent discussion, write-ups, and emerging practices around the blog's themes.
- Look for what's newly contested or shifting (tooling changes, new tradeoffs, hype vs. reality).
- Use WebFetch to read a promising source when a snippet isn't enough to judge the angle.

Respect the Reddit Responsible Builder Policy: research only, no de-anonymizing users, no scraping for redistribution. Treat threads as signal for topic ideas, not as content to copy.

## Judge Each Candidate

For every candidate topic, assess:

- **Fit** — practical, architecture/delivery-focused, matches the blog's voice. Drop pure news, vendor pitches, and beginner tutorials that don't fit.
- **Originality** — compare against the manifest. Is it genuinely new, a sharper angle on an existing post, or a near-duplicate? Near-duplicates are out unless there's a distinct new thesis.
- **Reader pull** — is there evidence (Reddit threads, search interest, recurring debate) that practitioners care?
- **Thesis potential** — can it carry a clear, opinionated, one-sentence thesis? Topics that can't are weak.
- **Timeliness** — evergreen is fine; if it's timely, note why now.

## Output

Return a ranked shortlist (aim for 5–8 strong candidates) with, for each:

- **Working title** — concrete, in the blog's style.
- **One-sentence thesis** — the point the post would argue.
- **Why now / why readers care** — the signal behind it, with a source (Reddit thread, search trend, article) where relevant.
- **Originality note** — closest existing post and how this differs, or "new ground."
- **Angle hint** — the concrete opening situation or tension to start from.

Lead with the strongest few. Be honest about thin ideas rather than padding the list. Offer to expand any candidate into a full draft via `new-blog-post`.
