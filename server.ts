import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import admin from 'firebase-admin';
import { analyzeIOC } from "./intelService";

dotenv.config();

// Initialize Firebase Admin for Secure API Authorization
if (!admin.apps.length) {
  // Try to use the config file first for perfect alignment with frontend
  admin.initializeApp({
    projectId: "gen-lang-client-0190090633"
  });
}

const app = express();
export default app;
app.use(cors());
app.use(express.json());

// Security Middleware: Verifies Firebase ID Token
const authMiddleware = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'TraceX Security: Authentication Required' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ error: 'TraceX Security: Invalid Session Token' });
  }
};

// Health Check
app.get("/api/health", (req, res) => {
  res.send({ status: "ok", message: "TraceX Mission Control Running 🚀" });
});

// RESTful IOC Lookups
app.get("/api/ioc/:type/:value", authMiddleware, async (req, res) => {
  try {
    const { type, value } = req.params;
    const result = await analyzeIOC(type, value);
    return res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: "Telemetry Retrieval Failed", detail: error.message });
  }
});

// Unified Analysis Endpoint
app.post("/api/analyze", authMiddleware, async (req, res) => {
  try {
    const { type, value, input } = req.body;
    const finalType = type || 'ip';
    const finalValue = value || input;

    if (!finalValue) {
      return res.status(400).json({
        status: "error",
        message: "No input provided",
      });
    }

    const result = await analyzeIOC(finalType, finalValue);
    return res.json(result);
  } catch (error: any) {
    console.error("ANALYZE ERROR:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      detail: error.message
    });
  }
});

const PORT = 3000; // MUST be 3000 for AI Studio

// ONLY start the server if not running on Vercel's serverless environment
if (!process.env.VERCEL) {
  async function startApp() {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) return;
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      // Development mode with Vite middleware
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[TraceX SOC] System active at: http://0.0.0.0:${PORT}`);
      console.log(`[TraceX SOC] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
  startApp();
}
