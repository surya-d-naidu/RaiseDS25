import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import helmet from 'helmet';
import enforce from 'express-sslify';
import https from 'https';
import http from 'http';
import fs from 'fs';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Note: Database tables are initialized via setup-db.sh script, not on every server start

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable trust proxy since we're behind a reverse proxy
app.enable('trust proxy');

// Add security headers and HTTPS redirect middleware
app.use((req, res, next) => {
  // Add security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Check for HTTP protocol and redirect to HTTPS
  const hostHeader = req.headers.host || '';
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  
  if (
    process.env.NODE_ENV === 'production' && 
    hostHeader.includes('raiseds25') &&  // Only redirect domain traffic
    !isHttps
  ) {
    return res.redirect(301, `https://${hostHeader}${req.url}`);
  }
  
  next();
});

// Serve static files from the public directory
const publicPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '../public');
app.use('/public', express.static(publicPath));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on the configured port (default 5000)
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
