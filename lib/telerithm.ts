// Telerithm SDK client wrapper
// Since @telerithm/sdk-js doesn't exist yet, we use the raw API

interface TelerithmConfig {
  endpoint: string;
  sourceId: string;
  apiKey: string;
}

interface LogEntry {
  level: "info" | "warn" | "error" | "debug";
  service: string;
  message: string;
  fields?: Record<string, any>;
}

class TelerithmClient {
  private config: TelerithmConfig;
  private logCount = 0;

  constructor(config: TelerithmConfig) {
    this.config = config;
  }

  async sendLogs(logs: LogEntry[]): Promise<void> {
    // Add host to all logs if not set
    const logsWithHost = logs.map(l => ({ host: "play.telerithm.cloud", ...l }));
    const response = await fetch(
      `${this.config.endpoint}/api/v1/ingest/${this.config.sourceId}`,
      {
        method: "POST",
        headers: {
          "X-API-Key": this.config.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logs: logsWithHost }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send logs: ${response.status} ${error}`);
    }

    this.logCount += logs.length;
  }

  async info(message: string, fields?: Record<string, any>) {
    return this.sendLogs([{ level: "info", service: "playground", message, fields }]);
  }

  async warn(message: string, fields?: Record<string, any>) {
    return this.sendLogs([{ level: "warn", service: "playground", message, fields }]);
  }

  async error(message: string, fields?: Record<string, any>) {
    return this.sendLogs([{ level: "error", service: "playground", message, fields }]);
  }

  getLogCount(): number {
    return this.logCount;
  }
}

// Singleton instance
let client: TelerithmClient | null = null;

export function getTelerithmClient(): TelerithmClient {
  if (!client) {
    client = new TelerithmClient({
      endpoint: "https://demo.telerithm.cloud",
      sourceId: "4cc63084-12e6-4f07-8968-b23861ccbbe2",
      apiKey: "lf_d76b67b426384a08a1493777",
    });
  }
  return client;
}

export type { LogEntry };
