type LogLevel = 'info' | 'warn' | 'error';

const write = (level: LogLevel, message: string, data?: unknown): void => {
  const timestamp = new Date().toISOString();
  const payload = data === undefined ? '' : ` ${JSON.stringify(data)}`;
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}${payload}`);
};

export const logger = {
  info: (message: string, data?: unknown) => write('info', message, data),
  warn: (message: string, data?: unknown) => write('warn', message, data),
  error: (message: string, data?: unknown) => write('error', message, data)
};
