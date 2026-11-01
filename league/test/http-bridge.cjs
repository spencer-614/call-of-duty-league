// Test-only bridge: exercise the same Fetch handler served by Deno in production.
const http = require("node:http");
exports.asNodeApp = (handler) => ({
  listen(...args) {
    return http
      .createServer(async (req, res) => {
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const response = await handler(
            new Request("http://127.0.0.1" + req.url, {
              method: req.method,
              headers: req.headers,
              ...(chunks.length ? { body: Buffer.concat(chunks) } : {}),
            }),
          );
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (e) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: e.message }));
        }
      })
      .listen(...args);
  },
});
