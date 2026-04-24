import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  generateAIReport: async (type: string, value: string, telemetry?: any) => {
    // Platform Automatic Key Usage (Frontend Only)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY is not defined. Ensure it is set in your environment.");
    
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const vtContext = telemetry?.vt && !telemetry.vt.info ? JSON.stringify(telemetry.vt) : "No live VT data available.";

    const prompt = `Act as a Lead Threat Intelligence Researcher.
    Analyze this Indicator of Compromise (IOC) using your tools, internal knowledge, and provided telemetry.
    
    IOC: ${type}:${value}
    VirusTotal Telemetry Context: ${vtContext}
    
    If the type is 'cve', focus on CVSS scores, affected software versions, exploit availability (PoC vs in-the-wild), and remediation actions.
    If the type is 'ip', 'domain', or 'hash', focus on attribution, malware campaigns, and infrastructure reputation.
    
    Your mission is to provide a surgical, high-fidelity intelligence report. 
    Focus on attribution, campaigns, and technical indicators.

    Return a JSON threat report with:
    - summary: 2-sentence executive summary.
    - report: Comprehensive technical breakdown (Markdown supported). Include attribution, malware family names, and historical context if found.
    - threatLevel: EXACTLY one of: "Critical", "High", "Medium", "Low", "Informational".
    - confidenceScore: 0-100 indicating your certainty.
    - tlp: EXACTLY one of: "TLP:RED", "TLP:AMBER", "TLP:GREEN", "TLP:WHITE".
    - asn: The ASN, ISP, or Organization associated with this IOC.
    - recommendations: Array of 3 strategic actions.`;

    const models = [
      { name: "gemini-3-flash-preview", useSearch: true },
      { name: "gemini-3.1-pro-preview", useSearch: true },
      { name: "gemini-3.1-flash-lite-preview", useSearch: true },
      { name: "gemini-3-flash-preview", useSearch: false }, // Fail-safe (No Search)
      { name: "gemini-flash-latest", useSearch: false }    // Legacy Fail-safe
    ];
    
    let lastError = "All correlation tiers were bypassed.";
    
    for (const model of models) {
      try {
        console.log(`[Sentinel AI 2.0] Analyzing via: ${model.name} (Search: ${model.useSearch})`);
        
        const config: any = {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              report: { type: Type.STRING },
              threatLevel: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              tlp: { type: Type.STRING },
              asn: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "report", "threatLevel", "confidenceScore", "tlp", "asn"]
          }
        };

        if (model.useSearch) {
          config.tools = [{ googleSearch: {} }];
          config.toolConfig = { includeServerSideToolInvocations: true };
        }

        const result = await ai.models.generateContent({
          model: model.name,
          contents: prompt,
          config
        });

        if (result.text) {
          const parsed = JSON.parse(result.text);
          if (parsed.summary && parsed.report) return parsed;
        }
      } catch (e: any) {
        lastError = e.message;
        console.warn(`[Sentinel AI 2.0] ${model.name} bypassed:`, e.message);
        continue;
      }
    }

    // Ultimate Resilience Fallback
    return {
      summary: "AI Infrastructure Warning: Pipeline restricted or API mismatch detected.",
      report: `### System Diagnostic\nThe Sentinel AI researcher encountered a critical block. \n\n**ERROR_TRACE:** \`${lastError}\`\n\n**ACTION REQUIRED:** Verify that your \`GEMINI_API_KEY\` is correctly set in your hosting environment (Vercel/Render). Current telemetry for ${value} indicates checking organization: ${telemetry?.vt?.as_owner || 'Unknown'}.`,
      threatLevel: "Manual Review",
      confidenceScore: 0,
      tlp: "TLP:WHITE",
      asn: telemetry?.vt?.as_owner || "Gathering...",
      recommendations: ["Manually pivot to VT", "Check firewall logs", "Isolate endpoint"]
    };
  }
};
