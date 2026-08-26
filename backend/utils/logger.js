const formatTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, details = '') => {
    console.log(`[${formatTimestamp()}] [INFO] ${message}`, details ? JSON.stringify(details) : '');
  },
  success: (message, details = '') => {
    console.log(`[${formatTimestamp()}] [SUCCESS] ${message}`, details ? JSON.stringify(details) : '');
  },
  error: (message, error = '') => {
    console.error(`[${formatTimestamp()}] [ERROR] ${message}`, error?.message || error || '');
  }
};
