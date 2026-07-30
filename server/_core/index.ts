import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite HMR compatibility
    crossOriginEmbedderPolicy: false,
  }));

  // Rate Limiting (Prevents DDoS and brute-force on API)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 API requests per 15 mins
    message: "Muitas requisições deste IP, tente novamente em 15 minutos."
  });
  app.use("/api", limiter);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Health-check / keep-alive endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({ status: "ok", uptime: Math.floor(process.uptime()), timestamp: new Date().toISOString() });
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    startKeepAlive();
  });
}

/**
 * Pings the server's own /api/ping endpoint every 14 minutes to prevent
 * Render free-tier from sleeping the service after 15 min of inactivity.
 * Only runs in production when RENDER_EXTERNAL_URL is set.
 */
function startKeepAlive() {
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (!renderUrl || process.env.NODE_ENV !== "production") return;

  const pingUrl = `${renderUrl.replace(/\/$/, "")}/api/ping`;
  const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

  console.log(`[keep-alive] Pinging ${pingUrl} every 14 min to prevent sleep.`);

  setInterval(async () => {
    try {
      const res = await fetch(pingUrl);
      if (res.ok) {
        const data = await res.json() as { uptime: number };
        console.log(`[keep-alive] Ping OK — server uptime: ${data.uptime}s`);
      } else {
        console.warn(`[keep-alive] Ping retornou status ${res.status}`);
      }
    } catch (err) {
      console.error(`[keep-alive] Falha no ping:`, err);
    }
  }, INTERVAL_MS);
}

startServer().catch(console.error);
