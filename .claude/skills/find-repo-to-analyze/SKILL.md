---
name: find-repo-to-analyze
description: Find and rank open source repositories worth tearing apart in a letscode.hu YouTube video — either as an architecture walkthrough or as living proof of a thesis you already hold. Returns a verified, ranked shortlist with a proposed angle and concrete files to show on screen. Use when looking for a repo to analyze on video, hunting for a codebase that illustrates a point, or building a backlog of video-ready repos.
allowed-tools: Read, Glob, Grep, Bash, WebSearch, WebFetch
model: opus
---


## Goal

Return a ranked shortlist of open source repositories that would carry a letscode.hu video — each one verified to exist, sized for a single episode, and paired with a concrete angle and the specific files you would put on screen.

This is a research-and-suggest skill. It does not clone repos, map them module by module, or write the script. It stops at "here are 5–8 repos, here is what each one is good for, pick one." The deep dive and the script come after.

## Two Input Modes

The skill takes an optional argument. Both modes end in the same output format.

**Thesis given** — e.g. `find-repo-to-analyze "event sourcing is overrated for most CRUD apps"`.
You already know the point. The job is to find codebases that *prove or complicate* it. Search for repos that embody the pattern under attack, and for repos that deliberately avoided it. The strongest candidate is often the counterexample: a well-known project that skipped the "obvious" approach and is fine.

**Nothing given** — cold search.
Find interesting repos first, then derive an angle for each. Every candidate must leave with a proposed thesis or a clear architectural question it answers. A repo with no angle is not a candidate, however cool it is.

Also accept a partial seed: a theme (`"CLI tools"`), a language (`"Rust"`), or a constraint (`"something under 5k lines"`). Fold it into the search as a filter, not as the whole brief.

## Know the Existing Content First

Never suggest blind. Establish the baseline before searching:

- `content/Youtube/` — every script so far. Note the theses already argued; a repo that re-proves an argued point is a repeat unless it sharpens it.
- `src/data/blog-post-manifest.ts` — published slugs, titles, excerpts.
- `.claude/skills/video-script/SKILL.md` — the channel's voice, title style, and what a video-shaped argument looks like here.
- Skim 1–2 recent teleprompter scripts to calibrate how deep a video actually goes. A video argues *one* point with a handful of examples — that is the amount of code a candidate needs to supply, not a full architecture tour.

Build a short internal map of covered themes (overengineering, ADRs, AI-assisted delivery, CI/CD, spec-driven development, model lock-in, testing). A candidate should extend, sharpen, or contradict that map.

## What Makes a Repo Work On Video

Rank against these. The first three are non-negotiable.

- **Legible on screen** — you can open a file, and a viewer who has never seen the project understands what they are looking at within a few seconds. Dense generics, 400-line functions, and heavy metaprogramming kill a video even when the architecture is brilliant.
- **One clear decision to point at** — a boundary, a plugin system, a state machine, a deliberate omission. Something you can name in one sentence and defend or attack.
- **A thesis it can carry** — the repo is evidence for something. "Nice code" is not a video.
- **Recognizable** — name recognition earns the click. A tool the audience has installed beats an obscure gem of the same quality.
- **Alive** — pushed within roughly the last year. A dead repo invites "this is outdated" comments that derail the point.
- **Any language is fine** if the message is good — but the code shown on screen has to be readable to someone who does not write that language daily. Go, TypeScript, Python and Java read well cold; heavy Rust generics, Scala implicits and template-deep C++ do not.

### The tension to resolve, not ignore

**Recognizable** and **small enough to explain** pull in opposite directions. The redis/kubernetes tier is famous and unshowable; the perfect 800-line teaching repo has no audience.

Aim for the intersection: **well-known but compact.** These exist and they are the sweet spot — focused libraries and single-purpose tools that plenty of people depend on and almost nobody has read. Think one-job libraries rather than platforms.

Two escape hatches when nothing sits in the intersection:

- **A famous repo, one subsystem only.** Not "how Postgres works" but "how Postgres decides to use an index" — scoped to a directory you can actually cover. Say explicitly in the candidate which subsystem, and that the rest is out of frame.
- **An unknown repo carried by the thesis.** Works only when the argument is strong enough that the repo is an illustration, not the subject. The title then sells the idea, not the project name.

Name which of the three shapes each candidate is. Do not pretend a 2-million-line project is walkable.

## Search With Verified Data

Use `gh` for the actual finding — it is authenticated here, and it returns real stars, sizes, timestamps and licenses. Do not propose repos from memory; recall is where hallucinated stats and dead projects come from.

Repo search with the filters that matter:

```bash
gh api -X GET search/repositories \
  -f q='<keywords> stars:1000..30000 pushed:>2025-06-01' \
  -f sort=stars -f per_page=20 \
  --jq '.items[] | {full_name, stargazers_count, size, language, license: .license.spdx_id, pushed_at, description}'
```

The `q` field takes GitHub's full search syntax — `language:go`, `topic:parser`, `archived:false`, `size:<20000` (size is in KB, and counts the whole checkout, so it is a weak proxy). Run several searches with different keyword angles rather than one broad one; the good candidates are rarely on the first page of the obvious query.

Better size signal — bytes of actual source per language:

```bash
gh api repos/OWNER/REPO/languages
```

Under ~500 KB in the primary language is comfortably one-video territory. Over ~2 MB, you are scoping to a subsystem whether you admit it or not.

Structure, to find the files worth showing:

```bash
gh api repos/OWNER/REPO/git/trees/HEAD --jq '.tree[] | "\(.type)\t\(.path)"'
```

Add `?recursive=1` for a full listing when the top level is uninformative, and filter with `jq` — some trees are large.

Read the README and a key source file with `gh api repos/OWNER/REPO/contents/<path> --jq '.content' | base64 -d` before recommending. **Never recommend a repo whose code you have not looked at** — the "legible on screen" test cannot be judged from a description.

Use WebSearch and WebFetch for the surrounding conversation: why a project is talked about, what the criticism is, whether a design decision was publicly debated. A repo that already has an argument around it gives the video its tension for free. If Reddit tools are available, threads in r/ExperiencedDevs, r/programming or a language subreddit are good signal for what practitioners actually complain about — research only, no scraping for redistribution.

## Verify Before Listing

For every candidate that reaches the shortlist, confirm from live data:

- The repo exists at the exact `owner/name` given, and is not archived.
- Stars, primary language, license and last push date are read from the API, not estimated.
- The specific files you cite exist at the paths you cite — check the tree.
- The claim you make about the code is something you actually read.

If a claim cannot be verified, drop the claim or drop the candidate. A shortlist with one fabricated detail is worse than a shorter list.

## Output

Return a ranked shortlist, 5–8 candidates, strongest first. For each:

- **`owner/repo`** — with stars, primary language, source size, license, last push.
- **What it is** — one sentence, for someone who has never heard of it.
- **Shape** — `Compact & known` / `Subsystem of a big project` / `Carried by the thesis`.
- **The angle** — `Architecture walkthrough` or `Thesis`, with the thesis in one sentence if the latter.
- **Working title** — in the channel's style: second-person, a claim or a trap, never a topic label.
- **What to show on screen** — 2–4 concrete paths, each with one line on why that file makes the point.
- **Why it works on video** — the tension, the surprise, or the decision worth arguing about.
- **Originality note** — the closest existing script or post and how this differs, or "new ground."
- **Risks** — be blunt: too big, too clever, boring in the middle, license odd, maintainer might object, audience too niche.

Lead with the strongest two or three and say why they lead. Be honest about weak candidates instead of padding to eight — a three-candidate list where all three are real beats eight where five are filler.

Close by offering to take the chosen repo into a deep dive, and then into `video-script` for the actual script.
