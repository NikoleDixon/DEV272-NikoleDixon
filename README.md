# DEV 272 – Fall 2026 Starter App

Bellevue College · Mobile Application Development Fundamentals · Tuesdays 5:30–7:40pm on Zoom

This is the starting point for every individual assignment in Weeks 1–6. You copy this repository once in Week 1 and keep building on the same app each week. Teams may also use it as the base for the team project in Weeks 7–12.

**Stack:** Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router · pnpm

> [!IMPORTANT]
> **AI tools tutor here; they do not write your code.** Read [section 10](#10-ai-tools-read-this-before-you-ask-an-ai-for-help) before you ask Copilot, Claude, ChatGPT, or Cursor for help. Deleting or editing the AI files in this repo costs 50% on every assignment.

---

## 1. Prerequisites (do this before Week 1 class if you can)

| Tool | What to install | Check it works |
| --- | --- | --- |
| Node.js (LTS) | https://nodejs.org — pick the **LTS** download | `node --version` prints `v22.x` or `v24.x` |
| pnpm | `npm install -g pnpm` | `pnpm --version` prints `10.x` or higher |
| Git | https://git-scm.com/downloads (macOS: comes with Xcode Command Line Tools) | `git --version` |
| GitHub account | Sign up through the **Student Developer Pack** at https://education.github.com/pack using your **BC email**. Already have an account? Add your BC email in Settings → Emails and apply for the pack; do not make a second account. | You can sign in |
| VS Code | https://code.visualstudio.com | Open it. Install the **Expo Tools** extension when prompted |
| A way to run the app | **One** of the options below | See section 3 |

**Windows users:** run all commands in PowerShell or Windows Terminal. Do not use Git Bash for `pnpm start`.

This course uses **pnpm**, not npm or yarn. If you run `npm install` by mistake the project will stop you with a message. Run `pnpm install` instead.

## 2. Get your copy of this repo

1. Click the green **Use this template** button at the top of this page → **Create a new repository**.
2. Name it `dev272-<yourname>` (for example `dev272-zbrinlee`). Leave it **Public**, or **Private** with the instructor added as a collaborator.
3. Clone your new repository (not this one):

   ```bash
   git clone https://github.com/<your-username>/dev272-<yourname>.git
   cd dev272-<yourname>
   pnpm install
   ```

`pnpm install` takes a minute the first time. You only run it again when a `package.json` change adds a dependency.

## 3. Run the app

```bash
pnpm start
```

Expo prints a QR code and a menu. Pick one way to see the app:

| Option | How | Notes |
| --- | --- | --- |
| **Your phone (Expo Go)** | Install **Expo Go** from the App Store / Play Store. Scan the QR code (iPhone: Camera app; Android: inside Expo Go). Phone and computer must be on the same Wi-Fi. | Fastest to set up. Expo Go must support **SDK 57** — check the app's version in the store listing. If the store version lags, use a simulator (below) for now. |
| **iOS Simulator** (Mac only) | Install Xcode from the App Store, open it once to finish setup, then press `i` in the Expo terminal. | Large download. |
| **Android Emulator** | Install Android Studio, create a device in Device Manager, start it, then press `a` in the Expo terminal. | Works on Mac, Windows, Linux. |
| **Web browser** | Press `w`. | Handy for quick checks. Not a substitute for a device or simulator on assignments. |

You should see the DEV 272 home screen. Leave `pnpm start` running while you work. Saving a file reloads the app automatically. Press `r` in the terminal to reload manually, `?` to see all commands.

## 4. Week 1 assignment: make your first change

1. Open `src/app/index.tsx`.
2. Change the two lines marked `👇` (your name and your app idea). Save. Watch the screen update.
3. Commit and push:

   ```bash
   git add .
   git commit -m "Week 1: personalize home screen"
   git push
   ```

4. Submit the URL of your repository in Canvas.

## 5. How every assignment is submitted

Weeks 1–6 build on this same repo. Each week:

1. Do the work in this repo, committing as you go (small commits with clear messages).
2. Push to GitHub.
3. Submit **your repository URL** (or a link to the specific commit) in the Canvas assignment.

The instructor clones your repo and runs `pnpm install && pnpm start`. If that does not work, the assignment does not work. Before submitting, run these two checks:

```bash
pnpm exec tsc --noEmit   # TypeScript: no errors
pnpm start               # App starts and the screen renders
```

## 6. What you will add, week by week

| Week | Topic | You add to this repo |
| --- | --- | --- |
| 1 | Setup | Your copy of the template, running, with a personalized home screen |
| 2 | React Native fundamentals | A landing screen built from core components (Text, TextInput, Button, ScrollView) and Flexbox layout |
| 3 | Navigation and state | Expo Router stack + tabs, a detail screen that receives route params, `useState`/`useEffect` state |
| 4 | User input | A form with validation that creates items held in state |
| 5 | Data and storage | Supabase as the remote database, TanStack Query for fetching/caching, AsyncStorage for local persistence |
| 6 | Code quality and testing | ESLint + Prettier, Husky pre-commit hook, Jest + React Native Testing Library unit tests |

Weeks 7–12 are the team project. Your team may start from a fresh copy of this template or from one member's Week 6 repo.

## 7. Project structure

```
src/
  app/            Screens and layouts. Every file here is a route (Expo Router).
    _layout.tsx   Root layout: the navigation Stack.
    index.tsx     Home screen, route "/".
assets/           App icon, splash image, favicon.
app.json          Expo app config (name, icon, plugins).
package.json      Dependencies and scripts. Run scripts with `pnpm <name>`.
tsconfig.json     TypeScript config. `@/` points at `src/`.
AGENTS.md         Rules for AI coding assistants: tutor, do not write code. Leave it in place.
CLAUDE.md         Loads AGENTS.md for Claude Code. Leave it in place.
.github/          Issue templates and copilot-instructions.md (same rules for Copilot Chat).
.vscode/          Editor settings, including Copilot inline completions turned off.
```

Put components, hooks, and utilities in `src/` next to `app/` (for example `src/components/`). Only screens and layouts go in `src/app/`.

## 8. Common problems

| Symptom | Fix |
| --- | --- |
| `npm install` prints "Use pnpm instead" | Run `pnpm install`. |
| `pnpm: command not found` | Install pnpm: `npm install -g pnpm`, then reopen the terminal. |
| Expo Go says the project uses an unsupported SDK | Your Expo Go app and this project are on different SDK versions. Update Expo Go from the store, or use a simulator/emulator. |
| Phone cannot connect / QR code does nothing | Same Wi-Fi network as the computer? Try `pnpm start --tunnel`. |
| Red error screen after editing | Read the first line of the error. Undo the last change, save, and reapply it in smaller steps. |
| Weird cache behavior | Stop the server, run `pnpm start --clear`. |
| Nothing works | Delete `node_modules/`, run `pnpm install`, then `pnpm start --clear`. |

## 9. Getting help

- Class time and office hours (see Canvas syllabus).
- Post in the **Q&A + Blockers** discussion in Canvas (pinned in the Resources module). Include the exact error text, your OS, and what you tried. Classmates and the instructor watch it.
- Expo docs for SDK 57: https://docs.expo.dev/versions/v57.0.0/
- React Native docs: https://reactnative.dev/docs/getting-started

---

## 10. AI tools: read this before you ask an AI for help

> [!CAUTION]
> **Do not alter or delete any AI-related file in this repository.**
> If `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, or the Copilot settings in `.vscode/settings.json` are changed or removed, **every assignment submitted from that repository automatically loses 50% of its grade.** This applies to your Week 7 team repository too, where these files are also a graded requirement.

> [!IMPORTANT]
> **AI tools are learning assistants in this course, not code generators.**
> Copilot, ChatGPT, Claude, Cursor, and similar tools are welcome for explaining concepts, reviewing code you wrote, helping you read an error, and finding the right docs. They are not allowed to write, complete, or rewrite your code. You write every line, you must be able to explain every line, and you cite significant AI help in your README. Full policy: the course syllabus in Canvas.

| File | What it does |
| --- | --- |
| `AGENTS.md` | The rules. Read by Claude Code, Cursor, Codex, Copilot's agent, and others. |
| `CLAUDE.md` | Loads `AGENTS.md` for Claude Code. |
| `.github/copilot-instructions.md` | The same rules for Copilot Chat in VS Code. |
| `.vscode/settings.json` | Turns off Copilot inline completions for this workspace. |

If an AI tool starts writing code for you anyway, stop, and ask it to explain instead. That is the tool ignoring the rules, and the grade is still yours.
