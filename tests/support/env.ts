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
  productsUrl: process.env.PRODUCTS_URL || '/odoo/action-1194',
  commissionProductsUrl: process.env.COMMISSION_PRODUCTS_URL || '/odoo/action-1194',
  credentials: {
    admin: {
      username: process.env.ADMIN_USER || '',
      password: process.env.ADMIN_PASSWORD || ''
    },
    internal: {
      username: process.env.INTERNAL_USER || process.env.QA_USER || '',
      password: process.env.INTERNAL_PASSWORD || process.env.QA_PASSWORD || ''
    },
    productUser: {
      username: process.env.PRODUCT_USER || '',
      password: process.env.PRODUCT_PASSWORD || ''
    }
  },
  qaUser: process.env.QA_USER || process.env.INTERNAL_USER || '',
  qaPassword: process.env.QA_PASSWORD || process.env.INTERNAL_PASSWORD || '',
  headless: parseBoolean(process.env.HEADLESS, true),
  actionUrls: {
    bienes: process.env.ACTION_BIENES || '/odoo/action-858',
    formasJuridicas: process.env.ACTION_FORMAS_JURIDICAS || '/odoo/action-754',
    vinculaciones: process.env.ACTION_VINCULACIONES || '/odoo/action-880',
    unidadesDecision: process.env.ACTION_UNIDADES_DECISION || '/odoo/action-900',
    gruposEconomicos: process.env.ACTION_GRUPOS_ECONOMICOS || '/odoo/action-882',
    conceptosComision: process.env.ACTION_CONCEPTOS_COMISION || '/odoo/action-1194',
    tipologiasProducto: process.env.ACTION_TIPOLOGIAS_PRODUCTO || '/odoo/action-1194',
    naturalezaT4: process.env.ACTION_NATURALEZA_T4 || '/odoo/action-1194',
    gruposProducto: process.env.ACTION_GRUPOS_PRODUCTO || '/odoo/action-1194'
  }
} as const;

export type UserRole = keyof typeof env.credentials;
