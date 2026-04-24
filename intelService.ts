import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface IntelResults {
  vt?: any;
  error?: string;
}

/**
 * High-Velocity Telemetry Aggregator
 * Orchestrates VirusTotal scans and raw data retrieval with resilience.
 */
export async function analyzeIOC(type: string, value: string): Promise<any> {
  const v = value.trim();
  const vtKey = process.env.VIRUSTOTAL_API_KEY;

  let vtData = null;

  if (vtKey) {
    // Retry logic for mission-critical telemetry
    const maxRetries = 2;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        let endpoint = '';
        if (type === 'ip') endpoint = `ip_addresses/${v}`;
        else if (type === 'domain') endpoint = `domains/${v}`;
        else if (type === 'hash') endpoint = `files/${v}`;
        else if (type === 'cve') endpoint = `vulnerabilities/${v}`;

        if (endpoint) {
          const res = await axios.get(`https://www.virustotal.com/api/v3/${endpoint}`, {
            headers: { 'x-apikey': vtKey },
            timeout: 8000 // 8s cap for VT
          });
          vtData = res.data?.data?.attributes;
          break; // Success
        }
      } catch (err: any) {
        if (i === maxRetries) {
          console.warn(`[Sentinel Backend] VT Scan Failed after ${maxRetries} retries: ${err.message}`);
          vtData = { info: "Carrier Scan Delayed or IOC Not Found" };
        } else {
          console.log(`[Sentinel Backend] VT Retry ${i + 1}...`);
          await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
        }
      }
    }
  }

  const timestamp = new Date().toISOString();
  return {
    raw: {
      vt: vtData || { info: "VirusTotal Integration Required" }
    },
    type,
    value: v,
    timestamp
  };
}
