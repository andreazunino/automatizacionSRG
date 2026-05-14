import dotenv from 'dotenv';

dotenv.config();

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
};

export const env = {
  baseUrl: process.env.BASE_URL || 'https://example.local',
  qaUser: process.env.QA_USER || '',
  qaPassword: process.env.QA_PASSWORD || '',
  headless: parseBoolean(process.env.HEADLESS, true)
} as const;
