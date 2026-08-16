import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const PREFIX = "meme-madness:";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "missing key" });
      const value = await redis.get(PREFIX + key);
      if (value === null || value === undefined) {
        return res.status(404).json({ error: "not found" });
      }
      return res.status(200).json({ key, value });
    }

    if (method === "POST") {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: "missing key" });
      await redis.set(PREFIX + key, value);
      return res.status(200).json({ key, value });
    }

    if (method === "DELETE") {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "missing key" });
      await redis.del(PREFIX + key);
      return res.status(200).json({ key, deleted: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "method not allowed" });
  } catch (err) {
    console.error("storage api error:", err);
    return res.status(500).json({ error: "storage backend error" });
  }
}
