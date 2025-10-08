import axios from "axios";
import { Buffer } from "buffer"; // needed in Node < 20

class VirusTotalServiceV3 {
  constructor() {
    this.baseUrl = "https://www.virustotal.com/api/v3";
    this.apiKey = null;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async validateApiKey(key) {
    try {
      const testUrl = "http://www.google.com";
      // must use base64url encoding (no +, /, or =)
      const urlId = Buffer.from(testUrl)
        .toString("base64")
        .replace(/=+$/, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      const response = await axios.get(`${this.baseUrl}/urls/${urlId}`, {
        headers: {
          "x-apikey": key,
        },
        timeout: 10000,
      });

      return response.status === 200;
    } catch (error) {
      console.error(
        "API key validation failed:",
        error.response?.data || error.message
      );
      return false;
    }
  }

  async scanUrl(url, retryCount = 0, maxRetries = 3) {
    if (!this.apiKey) throw new Error("API key not set");

    // 1. Submit URL for scanning
    const submitResponse = await axios.post(
      `${this.baseUrl}/urls`,
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          "x-apikey": this.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const analysisId = submitResponse.data.data.id; // looks like "u-xxxx..."

    // 2. Poll the analysis endpoint with progressive delays
    const delays = [3000, 5000, 8000, 10000];
    const delay = delays[retryCount] || 10000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const reportResponse = await axios.get(
      `${this.baseUrl}/analyses/${analysisId}`,
      {
        headers: {
          "x-apikey": this.apiKey,
        },
      }
    );

    // Some analyses may still be "in-progress" or "queued"
    const attributes = reportResponse.data.data.attributes;
    if (attributes.status === "queued" || attributes.status === "in-progress") {
      if (retryCount < maxRetries) {
        // Retry with exponential backoff
        return this.scanUrl(url, retryCount + 1, maxRetries);
      } else {
        throw new Error("QUEUED");
      }
    }

    return this.parseVirusTotalReportV3(reportResponse.data);
  }

  parseVirusTotalReportV3(data) {
    if (!data || !data.data) {
      return {
        positives: 0,
        total: 0,
        scanDate: new Date().toISOString(),
        permalink: "",
        scans: {},
        responseCode: 0,
        message: "URL not found in VirusTotal database",
      };
    }

    const attributes = data.data.attributes;
    const stats = attributes.stats || {}; // ✅ in analyses endpoint it’s "stats"
    const scans = attributes.results || {}; // ✅ in analyses endpoint it’s "results"

    return {
      positives: stats.malicious || 0,
      total:
        (stats.malicious || 0) +
        (stats.undetected || 0) +
        (stats.harmless || 0) +
        (stats.suspicious || 0),
      scanDate: attributes.date
        ? new Date(attributes.date * 1000).toISOString()
        : new Date().toISOString(),
      permalink: `https://www.virustotal.com/gui/url/${data.data.id}`,
      scans: this.formatScans(scans),
      responseCode: 1,
      message: "Analysis completed successfully",
      url: attributes.url,
      threatNames: this.extractThreatNames(scans),
    };
  }

  formatScans(scans) {
    const formattedScans = {};
    Object.entries(scans).forEach(([engine, result]) => {
      formattedScans[engine] = {
        detected:
          result.category === "malicious" || result.category === "suspicious",
        result: result.result || result.category,
        method: result.method,
        engine_version: result.engine_version,
        engine_update: result.engine_update,
      };
    });
    return formattedScans;
  }

  extractThreatNames(scans) {
    const threatNames = [];
    Object.entries(scans).forEach(([engine, result]) => {
      if (result.category === "malicious" && result.result) {
        threatNames.push(`${engine}: ${result.result}`);
      }
    });
    return threatNames;
  }

  determineSecurityLevel(report) {
    if (report.responseCode === 0) return "UNKNOWN";

    const ratio = report.positives / report.total;

    if (ratio === 0) return "SAFE";
    if (ratio < 0.1) return "SUSPICIOUS";
    return "MALICIOUS";
  }
}

export default VirusTotalServiceV3;
