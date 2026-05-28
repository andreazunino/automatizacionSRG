import { odooCommonSelectors } from './odooCommonSelectors';

export const bienesSelectors = {
  ...odooCommonSelectors,
  pageTitleText: /Tipo de Bienes|Tipos de Bienes|Bienes/i,
  validationText:
    '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger, .o_field_invalid, .is-invalid',
  invalidField: '[aria-invalid="true"], .o_field_invalid, .is-invalid, .o_form_invalid',
  descriptionInput:
    'div[name="name"] input, div[name="description"] input, div[name="descripcion"] input, input[name="name"], input[name="description"], input[name="descripcion"], h1 input',
  tipoGtiInput:
    'div[name="tipo_gti"] input, div[name="type_gti"] input, div[name="gti_type"] input, input[name="tipo_gti"], input[name="type_gti"], input[name="gti_type"]',
  tipoBeInput:
    'div[name="tipo_be"] input, div[name="type_be"] input, div[name="be_type"] input, input[name="tipo_be"], input[name="type_be"], input[name="be_type"]',
  limitarResponsabilidadPrincipalInput:
    'div[name="limit_resp_prin"] input, div[name="limitar_resp_prin"] input, div[name="limitar_responsabilidad_principal"] input, div[name="limit_main_responsibility"] input, input[name="limit_resp_prin"], input[name="limitar_resp_prin"], input[name="limitar_responsabilidad_principal"], input[name="limit_main_responsibility"]',
  labels: {
    descripcion: 'Descripcion',
    tipoGti: 'Tipo GTI',
    tipoBe: 'Tipo BE',
    limitarResponsabilidadPrincipal: 'Limitar con Resp. Prin.'
  }
} as const;
