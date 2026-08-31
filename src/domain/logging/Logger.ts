export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogCategory = "domain" | "application" | "infrastructure";

export interface LogEntry {
  ts: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}
