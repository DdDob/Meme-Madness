# Meme Madness: Bracket Run 3D

A 3D browser game built with React, Three.js, and Tailwind. Deployable to Vercel.

## What's. in here

- `src/App.jsx` — the game itself
- `src/storageShim.js` — replaces the Claude-artifact `window.storage` API with
  real calls to a backend, so accounts / best scores / the leaderboard
  actually persist once this is live on the internet
- `api/storage.js` — a Vercel serverless function backed by **Vercel KV**
  that the shim talks to
- Standard Vite + React + Tailwind scaffolding around it

**Important:** in the original Claude artifact, `window.storage` was
provided automatically by the Claude.ai sandbox. A real website has no such
thing — without the shim + API route, every "log in" / save / leaderboard
call would silently fail. That's already handled here, but it does mean you
need to set up a KV store (free tier, five minutes, no credit card) — see
step 3 below.

## Deploy to Vercel

### 1. Push this folder to GitHub
```bash
cd meme-madness
git init
git add .
git commit -m "Meme Madness 3D"
git branch -M main
git remote add origin https://github.com/<your-username>/meme-madness.git
git push -u origin main
```
(Or just drag-and-drop this folder into a new GitHub repo via github.com/new
→ "uploading an existing file" if you'd rather not use git commands.)

### 2. Import the project into Vercel
- Go to https://vercel.com/new
- Select the GitHub repo you just pushed
- Framework preset should auto-detect as **Vite** — leave build settings as
  default (`npm run build`, output directory `dist`)
- Click **Deploy**. It will deploy successfully, but storage calls will
  fail until you finish step 3 (the game still runs — you just won't be
  able to save accounts/scores yet).

### 3. Add a Vercel KV store (this is what makes accounts/leaderboard work)
- In your Vercel project dashboard, go to the **Storage** tab
- Click **Create Database** → choose **KV**
- Give it a name and create it, then click **Connect** to link it to this
  project
- Vercel automatically injects the required environment variables
  (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.) — you don't need to copy
  anything manually
- Redeploy the project (Vercel usually prompts you to redeploy after
  linking storage — if not, go to **Deployments** → **...** → **Redeploy**)

### 4. Done
Visit your `*.vercel.app` URL — sign in with a name, play, and your
account/score/tokens should now persist across visits and devices.

## Local development
```bash
npm install
npm run dev
```
Note: the `/api/storage` route only works when deployed on Vercel (or via
`vercel dev`, which emulates it locally) — plain `vite dev` alone won't run
serverless functions. If you want to test locally with real storage:
```bash
npm i -g vercel
vercel dev
```

## If you'd rather skip the backend entirely
If you don't want to set up KV right now, you can swap `storageShim.js` to
use `localStorage` instead of `fetch` calls — this makes accounts
device-only (no cross-device leaderboard/login) but requires zero backend
setup. Ask and I can provide that simpler version.
