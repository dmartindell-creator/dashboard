# Tumii: how to manage Darius Projects (v3, GitHub Pages)

## Feature freeze (set by Darius, Oct 15 2026)
The app is finished for now. Until the Nov 2 beta ships, do not change index.html or any app feature. After Nov 2, a change is allowed only if it directly helps Darius finish projects; park feature ideas in `ideas` for the Friday review. Updating projects.json (tasks, dates, statuses) is normal work.

## Temporary home
This GitHub Pages version runs until the DigitalOcean version (darius-projects repo) is live. Then follow SETUP.md step 7 there to retire this one.

The app at https://dmartindell-creator.github.io/dashboard/ reads one file: `projects.json` in this repo.
You only ever edit `projects.json`. Never edit `index.html`.

## Before every edit
1. Pull the latest `projects.json` from GitHub. Darius edits it from the app too.
2. Make your change.
3. Set `meta.updated` to the current ISO time and `meta.by` to `"Tumii"`.
4. Commit with a short message, for example: `Tumii: Manus finished Resend email`.

## How scheduling works (important)
The app calculates dates itself. For normal tasks you set **duration and dependencies**, not dates.
- `dur`: working days of calendar time (not hours). Weekends and `calendar.daysOff` are skipped.
- `deps`: ids of tasks that must finish first. The task starts the next working day after the last one finishes.
- `notBefore`: optional `YYYY-MM-DD`. The task won't start before this date even if its dependencies finish earlier.
- `start` and `end` get recalculated by the app. You can leave them as they are.
- `"schedule": "manual"` turns this off for a task; then `start` and `end` are fixed and you set them.
- Milestones (`"milestone": true`) are fixed deadlines. Set `start` and `end` to the same date. If work feeding a milestone runs past it, the app flags it "Will miss".
- Tasks with status `doing` keep their actual start date.

## Calendar
```json
"calendar": { "workdays": [1,2,3,4,5], "daysOff": [{ "date": "2026-11-26", "label": "Thanksgiving" }] }
```
Workdays use 0 = Sunday through 6 = Saturday. Add Darius's days off here when he tells you.

## Projects and phases
```json
{ "id": "ns", "name": "...", "status": "active", "owner": "darius", "color": "#5B9BFF",
  "summary": "Two sentences on what this is.", "next": "One sentence: the very next action.",
  "blocker": "", "shipLock": false, "links": [],
  "phases": [{ "id": "ph-legal", "name": "Legal and compliance" }] }
```
- `status`: `active`, `stalled`, `handed-off`, `long-term`, `paused`, `done`.
- Phases group the work in order (Design, Build, Test, Launch). Tasks point at one with `"phase": "ph-legal"`.
- `shipLock: true` means the current version ships before any restart. Don't turn it off unless Darius says so.

## Tasks
```json
{ "id": "ns-08", "project": "ns", "phase": "ph-app", "title": "Resend email: invites + password reset",
  "owner": "manus", "priority": 2, "status": "todo", "dur": 2, "deps": ["ns-05"], "est": 2,
  "description": "", "doneWhen": "", "needs": "", "checklist": [], "links": [], "log": [] }
```
- `id`: never change or reuse one. New ids are the project id plus a suffix (`ns-18`).
- `priority`: 1 urgent, 2 high, 3 normal, 4 low.
- `status`: `todo`, `doing`, `waiting`, `done`. When you change it, append to `statusHistory`: `{"status": "doing", "at": "YYYY-MM-DD"}`. This is how the app measures time spent waiting.
- Done: `"status": "done"` plus `"doneAt": "YYYY-MM-DD"`. Never delete done tasks.
- Waiting on a person: `"status": "waiting"`, `"waitingOn": "Doug signature"`, `"waitingSince": "YYYY-MM-DD"`.
- `est`: hours of work. `actual`: hours actually spent, when known. `pct`: percent complete if there's no checklist.
- `description`: two or three plain sentences anyone could follow. `doneWhen`: one sentence. `needs`: tools, access, or money required.
- `checklist`: `[{"text": "Sender domain", "done": false}]`. Percent complete comes from this.
- `log`: updates, `{"date": "...", "by": "Tumii", "text": "..."}`.

## When a finish date slips (always do this)
If you change something that makes a task finish later (bigger `dur`, later `notBefore`, new dependency), add a slip:
```json
"slips": [{ "date": "2026-10-15", "days": 2, "reason": "Waiting on a decision", "note": "Doug scope meeting moved", "by": "Tumii" }]
```
`reason` must be one of: Waiting on someone, Waiting on a decision, Scope grew, Underestimated, Interrupted by other work, Restarted or redone, Missing tool or access, Days off, Other.
This powers "Where the time went". Ask Darius for the reason if you don't know it.

## Baselines
`baselineStart` and `baselineEnd` are the agreed plan. Don't change them; Darius sets the baseline from the app. Slips are measured against them.

## Today's one thing
`today.taskId` points at a task (or null with `today.text`). `today.doneLooksLike` says what finished means.
Each evening, suggest the next one thing to Darius; set it only after he confirms.

## Ideas
New ideas go to the top of `ideas`, never straight into projects or tasks. They become projects only at the Friday review.

## Never
Never put passwords, keys, tokens, server addresses, or client health information in any field. The page is public.
