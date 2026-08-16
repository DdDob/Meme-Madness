// Vercel serverless function backing the game's storage shim.
// Requires a Vercel KV store linked to this project (Storage tab in the
// Vercel dashboard) - once linked, the KV_* env vars are injected
// automatically and this needs no extra configuration.
import { kv } from "@vercel/kv";

const PREFIX = "meme-madness:";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "missing key" });
      const value = await kv.get(PREFIX + key);
      if (value === null || value === undefined) {
        return res.status(404).json({ error: "not found" });
      }
      return res.status(200).json({ key, value });
    }

    if (method === "POST") {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: "missing key" });
      await kv.set(PREFIX + key, value);
      return res.status(200).json({ key, value });
    }

    if (method === "DELETE") {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "missing key" });
      await kv.del(PREFIX + key);
      return res.status(200).json({ key, deleted: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "method not allowed" });
  } catch (err) {
    console.error("storage api error:", err);
    return res.status(500).json({ error: "storage backend error" });
  }
}
