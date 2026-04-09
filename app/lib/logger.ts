import "server-only";

type LogLevel = "INFO" | "WARN" | "ERROR";

const serializeMeta = (meta: unknown): string => {
  if (meta === undefined) return "";

  if (meta instanceof Error) {
    return ` ${JSON.stringify({
      name: meta.name,
      message: meta.message,
      stack: meta.stack,
    })}`;
  }

  if (typeof meta === "object") {
    try {
      return ` ${JSON.stringify(meta)}`;
    } catch {
      return " [unserializable-meta]";
    }
  }

  return ` ${String(meta)}`;
};

const writeLog = (
  stream: NodeJS.WriteStream,
  level: LogLevel,
  message: string,
  meta?: unknown,
) => {
  const timestamp = new Date().toISOString();
  stream.write(`[${timestamp}] [${level}] ${message}${serializeMeta(meta)}\n`);
};

export const logger = {
  info(message: string, meta?: unknown) {
    writeLog(process.stdout, "INFO", message, meta);
  },
  warn(message: string, meta?: unknown) {
    writeLog(process.stdout, "WARN", message, meta);
  },
  error(message: string, meta?: unknown) {
    writeLog(process.stderr, "ERROR", message, meta);
  },
};
