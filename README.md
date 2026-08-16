# Meme Madness: Bracket Run 3D

## Deploy to Vercel — delete everything in your repo first, then upload
these exact files (keeping the `src/` and `api/` folders), commit, and
import fresh into Vercel (or let it auto-redeploy if already connected).

## After it builds successfully
Go to your Vercel project → **Storage** tab → add a **Redis** database
(powered by Upstash) → connect it to this project → redeploy. That's what
makes accounts/scores/leaderboard actually save.

## What changed from the last version
- `lucide-react` bumped to a modern version (the old pinned 0.383.0 was
  missing some icons the game uses, which was breaking the build)
- Tailwind is now loaded via CDN script tag in `index.html` instead of a
  separate PostCSS build step — one less thing that can misconfigure
