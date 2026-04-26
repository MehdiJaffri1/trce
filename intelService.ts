import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface IntelResults {
  vt?: any;
  shodan?: any;
  abuseipdb?: any;
  otx?: any;
  error?: string;
}

/**
 * High-Velocity Telemetry Aggregator
 * Orchestrates multiple CTI providers with resilience.
 */
export async function analyzeIOC(type: string, value: string): Promise<any> {
  const v = value.trim();
  const vtKey = process.env.VIRUSTOTAL_API_KEY;
  const shodanKey = process.env.SHODAN_API_KEY;
  const abuseKey = process.env.ABUSEIPDB_API_KEY;
  const otxKey = process.env.OTX_API_KEY;

  const results: any = {
    vt: null,
    shodan: null,
    abuseipdb: null,
    otx: null
  };

  // 1. VirusTotal
  if (vtKey) {
    try {
      let endpoint = '';
      if (type === 'ip') endpoint = `ip_addresses/${v}`;
      else if (type === 'domain') endpoint = `domains/${v}`;
      else if (type === 'hash') endpoint = `files/${v}`;
      else if (type === 'cve') endpoint = `vulnerabilities/${v}`;

      if (endpoint) {
        const res = await axios.get(`https://www.virustotal.com/api/v3/${endpoint}`, {
          headers: { 'x-apikey': vtKey },
          timeout: 5000
        });
        results.vt = res.data?.data?.attributes;
      }
    } catch (err) { console.warn("[TraceX] VT bypassed"); }
  }

  // 2. Shodan (IP only)
  if (shodanKey && type === 'ip') {
    try {
      const res = await axios.get(`https://api.shodan.io/shodan/host/${v}?key=${shodanKey}`, { timeout: 5000 });
      results.shodan = res.data;
    } catch (err) { console.warn("[TraceX] Shodan bypassed"); }
  }

  // 3. AbuseIPDB (IP only)
  if (abuseKey && type === 'ip') {
    try {
      const res = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
        params: { ipAddress: v, maxAgeInDays: 90 },
        headers: { 'Key': abuseKey, 'Accept': 'application/json' },
        timeout: 5000
      });
      results.abuseipdb = res.data?.data;
    } catch (err) { console.warn("[TraceX] AbuseIPDB bypassed"); }
  }

  // 4. OTX AlienVault
  if (otxKey) {
    try {
      let otxPath = '';
      if (type === 'ip') otxPath = `IPv4/${v}`;
      else if (type === 'domain') otxPath = `domain/${v}`;
      else if (type === 'hash') otxPath = `file/${v}`;
      
      if (otxPath) {
        const res = await axios.get(`https://otx.alienvault.com/api/v1/indicators/${otxPath}/general`, {
          headers: { 'X-OTX-API-KEY': otxKey },
          timeout: 5000
        });
        results.otx = res.data;
      }
    } catch (err) { console.warn("[TraceX] OTX bypassed"); }
  }

  const timestamp = new Date().toISOString();
  return {
    raw: results,
    type,
    value: v,
    timestamp
  };
}
