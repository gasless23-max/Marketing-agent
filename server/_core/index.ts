import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy, setMemoryStorage } from "./storageProxy";
import { memoryStorage } from "../storage";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initializeWebSocket } from "../websocket";
import { startRealtimeDataStream } from "../realtimeDataGenerator";
import { initializeWebhookSystem } from "../webhooks";
import { initializeLearningEngine } from "../learningEngine";
import { initializeAutonomousTaskExecutor } from "../autonomousTaskExecutor";

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
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Initialize memory storage for storage proxy
  setMemoryStorage(memoryStorage);
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  
  // Initialize WebSocket
  const io = initializeWebSocket(server);
  console.log('[Server] WebSocket initialized');
  
  // Initialize webhook system
  const webhookManager = initializeWebhookSystem(app, io);
  console.log('[Server] Webhook system initialized');
  
  // Initialize learning engine
  const learningEngine = initializeLearningEngine(io);
  console.log('[Server] Learning engine initialized');
  
  // Initialize autonomous task executor
  const taskExecutor = initializeAutonomousTaskExecutor(io, learningEngine);
  console.log('[Server] Autonomous task executor initialized');
  
  // Start real-time data streaming
  const stopDataStream = startRealtimeDataStream(io);
  console.log('[Server] Real-time data stream started');
  
  // Store instances in app for access in routes
  app.locals.io = io;
  app.locals.webhookManager = webhookManager;
  app.locals.learningEngine = learningEngine;
  app.locals.taskExecutor = taskExecutor;
  
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
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('[Server] Shutting down gracefully...');
    stopDataStream();
    server.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
  });
}

startServer().catch(console.error);
