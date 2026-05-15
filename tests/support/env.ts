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
  contactsUrl: process.env.CONTACTS_URL || '/odoo/contacts',
  credentials: {
    admin: {
      username: process.env.ADMIN_USER || '',
      password: process.env.ADMIN_PASSWORD || ''
    },
    internal: {
      username: process.env.INTERNAL_USER || process.env.QA_USER || '',
      password: process.env.INTERNAL_PASSWORD || process.env.QA_PASSWORD || ''
    }
  },
  qaUser: process.env.QA_USER || process.env.INTERNAL_USER || '',
  qaPassword: process.env.QA_PASSWORD || process.env.INTERNAL_PASSWORD || '',
  headless: parseBoolean(process.env.HEADLESS, true)
} as const;

export type UserRole = keyof typeof env.credentials;
