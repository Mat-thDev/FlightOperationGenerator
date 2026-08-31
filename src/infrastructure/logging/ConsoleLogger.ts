import type { LogCategory, LogEntry, Logger, LogLevel } from "../../domain/logging/Logger";

export class ConsoleLogger implements Logger {
  private buffer: LogEntry[] = [];
  private maxSize = 50;

  private push(level: LogLevel, category: LogCategory, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      category,
      message,
      context,
    };
    this.buffer.push(entry);
    if (this.buffer.length > this.maxSize) this.buffer.shift();

    const prefix = `[FOG][${category}][${level}]`;
    const payload = context ? { ...context } : undefined;

    if (level === "error") {
      console.error(prefix, message, payload ?? "");
    } else if (level === "warn") {
      console.warn(prefix, message, payload ?? "");
    } else if (level === "debug") {
      console.debug(prefix, message, payload ?? "");
    } else {
      console.log(prefix, message, payload ?? "");
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.push("debug", "application", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.push("info", "application", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.push("warn", "application", message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.push("error", "application", message, context);
  }

  // Acesso ao buffer para debug futuro (sem UI)
  getEntries(): LogEntry[] {
    return [...this.buffer];
  }
}
