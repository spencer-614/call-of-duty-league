// Browser-only: public project key and signed-in user's JWT. Never a bot secret.
export function createLeagueClient({
  baseUrl,
  anonKey,
  getSession,
  fetchImpl = globalThis.fetch,
}) {
  const base = String(baseUrl || "").replace(/\/+$/, "");
  return async function call(path, body) {
    if (!base) throw Error("League service is not configured.");
    const session = await getSession();
    if (!session?.access_token)
      throw Error(
        "Sign in with Discord on the admin portal, then return here.",
      );
    const response = await fetchImpl(`${base}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw Error(
        `League service returned HTTP ${response.status} without JSON. Check that the league Edge Function is deployed.`,
      );
    }
    if (!response.ok)
      throw Error(
        result.error ||
          result.message ||
          `League request failed (HTTP ${response.status})`,
      );
    return result;
  };
}
