import { Hono } from "hono";
import type { WebSocket as CFWebSocket } from "@cloudflare/workers-types";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

app.get("/websocket", (c) => {
  const upgradeHeader = c.req.header("Upgrade");
  if (upgradeHeader !== "websocket") {
    return c.text("Expected websocket", 400);
  }

  const webSocketPair = new WebSocketPair();
  const client = webSocketPair[0];
  const server = webSocketPair[1] as unknown as CFWebSocket;
  server.accept();
  server.send("Hello");

  server.addEventListener("message", (e) => {
    server.send(e.data+"!");
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
});

export default app;
