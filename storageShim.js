// Replaces the Claude-artifact-only `window.storage` API with a real
// implementation backed by a Vercel serverless function + KV store, so
// account/leaderboard persistence actually works once deployed.
//
// Personal (shared:false) data is scoped to a per-browser client id stored
// in localStorage. Shared (shared:true) data - accounts and the leaderboard
// - is global, matching how the game already uses it (accounts are looked
// up by username on purpose, so the same name works across devices).

function getClientId() {
  let id = localStorage.getItem("mm_client_id");
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("mm_client_id", id);
  }
  return id;
}

async function apiCall(method, params, body) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/storage?${qs}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 404) {
    throw new Error("not_found");
  }
  if (!res.ok) {
    throw new Error(`storage_error_${res.status}`);
  }
  return res.json();
}

window.storage = {
  async get(key, shared) {
    const namespacedKey = shared ? key : `${getClientId()}:${key}`;
    const data = await apiCall("GET", { key: namespacedKey });
    return { key, value: data.value, shared: !!shared };
  },
  async set(key, value, shared) {
    const namespacedKey = shared ? key : `${getClientId()}:${key}`;
    await apiCall("POST", {}, { key: namespacedKey, value });
    return { key, value, shared: !!shared };
  },
  async delete(key, shared) {
    const namespacedKey = shared ? key : `${getClientId()}:${key}`;
    await apiCall("DELETE", { key: namespacedKey });
    return { key, deleted: true, shared: !!shared };
  },
};
