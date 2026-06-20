---
name: video-script
description: Write a YouTube video script for letscode.hu in the channel's teleprompter style — catchy title, one-line-per-breath body, punchy sections, the "Build less / Think more / Ship smart" sign-off, a description block with chapter markers and CTA links, plus an attached LinkedIn share copy. Use when drafting a new video script, turning a topic or blog post into a script, or producing the teleprompter + description + social copy bundle.
allowed-tools: Read, Glob, Grep, Write
---


## Goal

Write a complete YouTube video script that matches the existing letscode.hu scripts in `content/Youtube/`: a direct, slightly provocative take on software architecture, AI-assisted engineering, and shipping — delivered in the channel's **teleprompter** format (one clause per line, blank line between lines, built to be read aloud).

A finished deliverable from this skill is three things in one:

1. The **script** — catchy title, hook, argued body, sign-off.
2. The **description block** at the bottom — a 1–2 sentence description, chapter timestamps, and the standard CTA links.
3. An attached **LinkedIn share copy** to promote the video.

This skill does not invent a thesis the channel wouldn't hold. It carries one clear point, steelmans the counterargument, then sharpens it. If the source idea is thin, say so rather than padding to length.

## Read Before Writing

Always ground the draft in the real channel voice first:

- Read **2–3 recent scripts** from `content/Youtube/`, preferring the `(Teleprompter)` versions — `Video 11 Script - Your Model Can Disappear Overnight (Teleprompter).md` and `Video 10 Script - The Spec-Driven Waterfall Trap (Teleprompter).md` are the current template.
- Skim `.claude/skills/new-blog-post/SKILL.md` for the shared brand voice rules (concrete openings, sparse "not X but Y", restraint with intensifiers, no moralizing).
- If the video maps to an existing blog post, read `content/blog/<slug>/en.md` (and `hu.md`) — the blog has the precise argument; the script gets the punchiest lines and the hook.

Match the existing scripts on length (~6–11 KB / roughly 1000–1800 spoken words), section count, and pacing. Prefer the newest scripts over the older ones (Video 1–8 are looser; the teleprompter format is the standard now).

## Decide Before Drafting

Resolve from the request; if unstated, pick a sensible default and say so:

- **Topic & thesis** — the single point the video argues, in one sentence.
- **Language** — EN by default (the recent scripts are EN). Offer HU as an add-on; if HU, apply the Hungarian editorial rules from `new-blog-post` (keep English tech terms, natural word order, one "!" at most, `persze`/`Csakhogy`/`Pedig` for turns).
- **Filename** — scan `content/Youtube/` for the highest `Video N` and use `Video {N+1} Script - {Title} (Teleprompter).md`.
- **Spoken CTA** — always include a short spoken call-to-action near the end (see Script Structure). Tie it to the specific problem the video diagnosed and point to the booking link in the description.
- **Optional blocks** — a `SOURCES` section (use when the script cites research like DORA or the CHAOS Report) is optional; omit unless it earns its place.

## Catchy Titles

The title is a declarative, second-person, curiosity-or-threat line — not a topic label. Study the channel's own:

- *Stop Overengineering* · *You Don't Need Kubernetes* · *Why Most ADRs Are Useless*
- *Your CI/CD Pipeline Is Slower Than Your Developers* · *Your Problem Is Not Technical*
- *You're Not Measuring AI. You're Just Paying For It* · *Your Model Can Disappear Overnight* · *The Spec-Driven Waterfall Trap*

Rules:
- Speak to the viewer ("you"/"your") or name a trap.
- Make a claim or create a gap — never describe ("A discussion of model lock-in" ❌).
- Short, no hype words ("ultimate", "insane"), no clickbait the video can't pay off.

**Always propose 3–5 title candidates** and let the user pick (or pick the strongest and say which). The chosen title becomes the `# 🎬 {Title}` heading.

## Script Structure

Some elements are **fixed** — they appear in every script, in this order:

1. **Title** — `# 🎬 {Title}`.
2. **Hook** — open cold on a concrete situation, no preamble. A real team ("A team I worked with recently…"), a vivid scenario, a sharp number, or a recent event. End the hook on tension — the thing that went wrong or the question nobody asked. Close the opening movement with `---`.
3. **Body sections** — `### {punchy header}` blocks of teleprompter lines, separated by `---`. Headers are short and pointed (*The promise is real* · *We've seen this movie before* · *Cheap isn't free* · *Decide now, not during the outage*). The body's **shape is not fixed** — see below.
4. **Spoken CTA** — after the final body section and before the sign-off, a short teleprompter passage (~6–12 lines) that turns the video's problem into an offer. Name the specific pain the video just diagnosed, then point to the booking link in the description. Keep it in the channel's voice — low-key, not salesy; a "if this is you, here's the door" aside, not a pitch. Arc: who it's for → what a call would actually do → "the link's in the description." Separate it from the body with `---`. Pattern:

   ```
   If your team is wrestling with exactly this -

   {the problem the video named} -

   that's the kind of thing I help teams untangle.

   There's a link in the description

   to book a call.

   No pitch.

   We just look at where you're stuck,

   and what to do about it.
   ```

5. **Sign-off** — a callback line referencing the hook ("If this made you look twice at a spec you wrote with a little too much confidence,"), then `leave a like`, then `subscribe` with the channel's niche, then:

   ```
   And don't forget:

   Build less.

   Think more.

   Ship smart.
   ```

### Vary the body shape — don't reuse one template

The fixed parts above (title, hook, CTA, sign-off) repeat every time. The **body must not**. The steelman → where-it-breaks → reframe arc is *one* option, not the house style — if every script uses it, they all read the same. Before drafting, pick the structure that actually fits *this* argument. Options, not a checklist:

- **Steelman → break → reframe** — best when you're pushing back on a popular practice (specs, microservices, "we need a European model").
- **Story spine** — follow one team/incident start to finish; let the lesson fall out of the narrative instead of sectioning it into claims.
- **Myth list** — three or four wrong beliefs about the topic, each taken apart in turn, building to the real point.
- **One example, dissected** — go deep on a single concrete case (one PR, one decision, one outage) and zoom out only at the end.
- **Chronological / "we've seen this before"** — trace how we got here, then show the pattern repeating now.
- **Question chain** — open a question, answer it, which raises the next, until the last answer is the thesis.
- **Two paths** — set up a fork (the obvious choice vs. the one you advocate) and walk both consequences.
- **Symptom → diagnosis → prescription** — start from what hurts, find the real cause, prescribe the fix.

Mix or invent as the topic demands. Also vary the surface so scripts don't rhyme: section **count** (4–7), header phrasing, where the turn lands, and the hook type (team anecdote vs. number vs. event vs. scenario) — don't open every video with "A team I worked with recently." Check the **2–3 most recent scripts** you read and deliberately choose a different shape than the last one or two.

### Teleprompter formatting (the defining rule)

- **One clause or short sentence per line.** Break on the natural breath, not the grammar.
- **A blank line between every line.** The body looks sparse — that's correct; it's read aloud, not on a page.
- Plain prose; `_italics_` only for a single word the argument hinges on. No bullet lists inside the spoken body.
- Use the channel's voice: direct, conversational asides ("Look, the code worked.", "Honestly, most people miss this."), restraint with "not X but Y" and intensifiers.

## Description Block (bottom of file)

After the sign-off, add `---`, then:

1. **Description** — 1–2 sentences capturing the hook and thesis (this is the YouTube description / SEO excerpt). Concrete, no "In this video I…".
2. **Chapter timestamps** — `00:00 Intro`, then one `??:??` line per `###` section header, in order. Leave the timestamps as `??:??` for the user to fill after editing.
3. **CTA links** — exactly:

   ```
   👉 Book a Strategy Call: https://calendly.com/fejlesztes-letscode/30min
   👉 Learn more: https://letscode.hu/en
   ```

4. If sources were cited, add a `## 🔗 SOURCES` section with the named references and URLs.

## Attached LinkedIn Share Copy

After writing the script, append a LinkedIn post to promote the video, following the `linkedin-post` skill's rules:

- Hook the first line (concrete situation, sharp claim, or number — it's the only line shown before "see more").
- One idea, short lines, generous whitespace, ~120–200 words.
- Lead with the insight so the post stands alone; one CTA + the video link near the end (leave `[VIDEO LINK]` if unknown).
- 3–5 specific hashtags at the very end. No emoji spam, no engagement-bait.
- Match the request's language; offer the other language as an add-on.

Deliver it in its own fenced code block, clearly labeled, so it's paste-ready and separate from the script.

## Output & Workflow

1. Present the 3–5 **title candidates** first (unless the user already gave a title).
2. Write the full script to `content/Youtube/Video {N+1} Script - {Title} (Teleprompter).md`, including the description block.
3. Output the **LinkedIn share copy** in a fenced code block in the chat.
4. Close with a short note: the filename written, the title used, and any `??:??` / `[VIDEO LINK]` placeholders the user still needs to fill.

Keep commentary minimal — the user wants a ready-to-record script plus paste-ready social copy, not analysis.
