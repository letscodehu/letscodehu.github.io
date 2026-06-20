---
name: find-blog-topics
description: Find and rank fresh, thought-provoking topic ideas for letscode.hu — for both blog posts and YouTube video scripts — grounded in what the channel/blog already covers, what practitioners are discussing, and current industry conversation. Use when brainstorming new posts or videos, looking for an angle, checking whether an idea is fresh, or building a backlog of topic candidates before drafting.
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch, mcp__reddit__search_reddit, mcp__reddit__browse_subreddit, mcp__reddit__get_top_posts, mcp__reddit__get_post_comments, mcp__reddit__get_subreddit_info, mcp__reddit__get_trending_subreddits, mcp__reddit__get_reddit_post
model: opus
---


## Goal

Propose topic ideas that fit letscode.hu and are worth producing — as a **blog post**, a **YouTube video script**, or both: practical software architecture and delivery topics, aligned with the existing voice, distinct from what's already published, connected to what practitioners actually care about right now, and framed to make the audience *think*.

This is a research-and-suggest skill. It does not draft posts or scripts — it returns ranked topic candidates with enough context to decide. Hand a chosen topic to the `new-blog-post` skill (for an article) or to the video-script flow afterward.

## Aim for Thought-Provoking, Not Just Informative

A topic that merely explains something is fine for a tutorial. The topics this skill should surface go one level deeper — they make the reader/viewer reconsider an assumption. Favor candidates that:

- **Challenge a default** the audience takes for granted ("Why your microservices are a distributed monolith", "ADRs are cargo cult unless you do this").
- **Name an uncomfortable tradeoff** practitioners avoid talking about.
- **Take a clear, defensible side** in an active debate rather than surveying both neutrally.
- **Reframe a familiar problem** so the obvious answer suddenly looks wrong.
- **Surface a tension from real threads** — the frustration *under* the headline, not the headline.

Avoid bland "X best practices" or "intro to Y" framings unless they carry a sharp, contrarian thesis. If a candidate can't provoke a reaction, it's weak.

## Know the Existing Content First

Never suggest topics blind. Establish the baseline before searching:

- `.cursor/rules/blog-style.mdc` — voice, tone, and what the brand is about.
- `docs/blog.md`.
- `src/data/blog-post-manifest.ts` — the full list of slugs, titles, and excerpts already published.
- Skim `content/blog/<slug>/en.md` for a few recent posts to feel the depth and angle.
- Check existing video material (course outlines / episode scripts) so a "video" suggestion doesn't duplicate a tutorial that already exists.

Build a short internal map of covered themes and clusters (e.g. ADRs, AI in architecture, over/under-engineering, tech debt, testing, CI/CD, scaling, C4 modeling). A new topic should extend or sharpen a cluster, or open a clearly new one — not restate existing content.

## Gather Signal

Pull from multiple sources so ideas reflect real conversation, not just one feed.

**Reddit** — what practitioners are discussing and frustrated by:
- Search relevant subreddits (e.g. r/ExperiencedDevs, r/softwarearchitecture, r/programming, r/devops, r/SoftwareEngineering) for recurring questions, debates, and pain points.
- Use top/trending posts and read comment threads to find the *real* tension under a topic, not just the headline.
- Note framing readers use — their words make better titles and video hooks than abstract jargon.

**Web search** — current industry conversation:
- Search for recent discussion, write-ups, and emerging practices around the brand's themes.
- Look for what's newly contested or shifting (tooling changes, new tradeoffs, hype vs. reality).
- Use WebFetch to read a promising source when a snippet isn't enough to judge the angle.

Respect the Reddit Responsible Builder Policy: research only, no de-anonymizing users, no scraping for redistribution. Treat threads as signal for topic ideas, not as content to copy.

## Judge Each Candidate

For every candidate topic, assess:

- **Fit** — practical, architecture/delivery-focused, matches the brand's voice. Drop pure news, vendor pitches, and beginner tutorials that don't fit.
- **Provocation** — does it challenge an assumption, take a side, or reframe a problem? Can it open with a hook that stops the scroll? Flat, neutral topics rank low.
- **Originality** — compare against the manifest and existing videos. Is it genuinely new, a sharper angle on existing content, or a near-duplicate? Near-duplicates are out unless there's a distinct new thesis.
- **Reader/viewer pull** — is there evidence (Reddit threads, search interest, recurring debate) that practitioners care?
- **Thesis potential** — can it carry a clear, opinionated, one-sentence thesis? Topics that can't are weak.
- **Format fit** — does it work better as a written post (needs diagrams, code, depth, reference value), as a video (carried by argument, story, talking-to-camera energy, a strong visual hook), or both? Note which.
- **Timeliness** — evergreen is fine; if it's timely, note why now.

## Output

Return a ranked shortlist (aim for 5–8 strong candidates) with, for each:

- **Working title** — concrete, in the brand's style; for video candidates, a hook-y title that earns a click.
- **One-sentence thesis** — the point the post/video would argue.
- **Format** — `Blog`, `Video`, or `Both`, with a one-line reason.
- **The hook / provocation** — the assumption it challenges or the opening tension that makes someone keep reading/watching.
- **Why now / why readers care** — the signal behind it, with a source (Reddit thread, search trend, article) where relevant.
- **Originality note** — closest existing post or video and how this differs, or "new ground."
- **Angle hint** — the concrete opening situation or tension to start from.

Lead with the strongest few. Be honest about thin ideas rather than padding the list. Offer to expand any candidate into a full draft via `new-blog-post` (for articles) or into a video script.
