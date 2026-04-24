# TraceX Intelligence - Deployment Guide

## 🚀 Deploying to Vercel

The "black page" or "AI Analysis Failed" issues on Vercel are usually caused by missing environment variables or routing conflicts. Follow these exact steps:

### 1. Configure Environment Variables
In your Vercel Dashboard (**Settings > Environment Variables**), add these keys:
- `GEMINI_API_KEY`: Your key from AI Studio.
- `VITE_FIREBASE_API_KEY` (and other Firebase keys from your `.env`).
- `VIRUSTOTAL_API_KEY` (if using).
- `ABUSEIPDB_API_KEY` (if using).

### 2. General Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Authorize your Domain (IMPORTANT)
Firebase Authentication will block login requests from your Vercel URL unless you authorize it:
1.  Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project: `gen-lang-client-0190090633`.
3.  Go to **Build > Authentication > Settings > Authorized domains**.
4.  Click **Add domain** and paste your Vercel URL (e.g., `trace-x.vercel.app`).

### 4. Routing
The project includes a `vercel.json` which handles:
- Routing `/api/*` to the Express server.
- Routing all other traffic to the React SPA (`index.html`).

## 🛠️ Common Fixes

### Blank/Black Screen
- Ensure you have run `npm run build` locally or that Vercel is completing the build successfully.
- Check the browser console (F12) for errors. If it says "Gemini API key is missing", go to step 1.

### Analysis Fails
- This happens if the backend server isn't reachable or the API keys are invalid.
- Verify that your `GEMINI_API_KEY` is set correctly in Vercel.
- The project is configured to use `gemini-3-flash-preview` by default.
