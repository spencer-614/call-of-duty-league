// Small Fetch-native adapter for the shared API's middleware/route interface.
// Production uses Deno.serve; the optional Node adapter uses Express.Router.
export function createFetchRouter() {
  const layers = [];
  const router = {
    use(fn) {
      layers.push({ fn, error: fn.length === 4 });
      return router;
    },
    get(path, fn) {
      layers.push({ method: "GET", path, fn });
      return router;
    },
    post(path, fn) {
      layers.push({ method: "POST", path, fn });
      return router;
    },
    async dispatch(request, path) {
      let body = {};
      if (!["GET", "HEAD"].includes(request.method)) {
        if (Number(request.headers.get("content-length")) > 1048576)
          return Response.json(
            { error: "Request body is too large" },
            { status: 413 },
          );
        const text = await request.text();
        if (new TextEncoder().encode(text).length > 1048576)
          return Response.json(
            { error: "Request body is too large" },
            { status: 413 },
          );
        if (text) {
          try {
            body = JSON.parse(text);
          } catch {
            return Response.json(
              { error: "Invalid JSON request body" },
              { status: 400 },
            );
          }
        }
        if (body === null || typeof body !== "object" || Array.isArray(body))
          return Response.json(
            { error: "Request body must be a JSON object" },
            { status: 400 },
          );
      }
      const req = {
        method: request.method,
        headers: Object.fromEntries(request.headers),
        params: {},
        query: Object.fromEntries(new URL(request.url).searchParams),
        body,
      };
      let status = 200,
        result,
        done = false;
      const res = {
        status(code) {
          status = code;
          return res;
        },
        json(value) {
          result = value;
          done = true;
          return res;
        },
      };
      const match = (pattern) => {
        const parts = path.split("/").filter(Boolean),
          expected = pattern.split("/").filter(Boolean);
        if (parts.length !== expected.length) return null;
        const params = {};
        for (let i = 0; i < parts.length; i++) {
          if (expected[i].startsWith(":"))
            params[expected[i].slice(1)] = decodeURIComponent(parts[i]);
          else if (parts[i] !== expected[i]) return null;
        }
        return params;
      };
      async function run(index, error) {
        if (done) return;
        for (let i = index; i < layers.length; i++) {
          const layer = layers[i];
          if (Boolean(error) !== Boolean(layer.error)) continue;
          if (layer.method) {
            if (layer.method !== req.method) continue;
            const params = match(layer.path);
            if (params === null) continue;
            req.params = params;
          }
          let nextPromise,
            called = false;
          const next = (e) => {
            called = true;
            nextPromise = run(i + 1, e);
            return nextPromise;
          };
          try {
            await (error
              ? layer.fn(error, req, res, next)
              : layer.fn(req, res, next));
            if (called) await nextPromise;
          } catch (e) {
            await run(i + 1, e);
          }
          return;
        }
        if (error) {
          status = error.status || 500;
          result = {
            error: error.status
              ? error.message
              : "League Edge Function request failed",
          };
          done = true;
        }
      }
      try {
        await run(0);
      } catch {
        status = 400;
        result = { error: "Invalid request path" };
        done = true;
      }
      if (!done) {
        status = 404;
        result = {
          error:
            "League API route not found. The base URL must end in /functions/v1/league.",
        };
      }
      return Response.json(result, { status });
    },
  };
  return router;
}
