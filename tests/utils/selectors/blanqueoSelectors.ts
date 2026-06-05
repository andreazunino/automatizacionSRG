import { odooCommonSelectors } from './odooCommonSelectors';

export const blanqueoSelectors = {
  ...odooCommonSelectors,
  pageTitleText: /Blanqueo|Exp\.?\s*Blanqueo|Expedientes de blanqueo/i,
  codeValue:
    'div[name="name"], div[name="code"], div[name="codigo_expediente"], div[name="aml_code"], span[name="name"], span[name="code"], span[name="codigo_expediente"], span[name="aml_code"], input[name="name"], input[name="code"], input[name="codigo_expediente"], input[name="aml_code"], h1',
  titularInput:
    'div[name="partner_id"] input, div[name="titular_id"] input, div[name="holder_id"] input, div[name="contact_id"] input, input[name="partner_id"], input[name="titular_id"], input[name="holder_id"], input[name="contact_id"]',
  fechaAperturaInput:
    'div[name="open_date"] input, div[name="opening_date"] input, div[name="fecha_apertura"] input, div[name="date_open"] input, div[name="date"] input, input[name="open_date"], input[name="opening_date"], input[name="fecha_apertura"], input[name="date_open"], input[name="date"]',
  cnaeInput:
    'div[name="cnae_id"] input, div[name="cnae"] input, div[name="activity_id"] input, div[name="actividad_id"] input, input[name="cnae_id"], input[name="cnae"], input[name="activity_id"], input[name="actividad_id"]',
  responsableInput:
    'div[name="user_id"] input, div[name="responsable_id"] input, div[name="responsible_id"] input, input[name="user_id"], input[name="responsable_id"], input[name="responsible_id"]',
  observacionesInput:
    'div[name="notes"] [contenteditable="true"], div[name="notes"] input, div[name="notes"] textarea, div[name="observations"] input, div[name="observaciones"] input, div[name="note"] input, div[name="observations"] textarea, div[name="observaciones"] textarea, div[name="note"] textarea, input[name="notes"], input[name="observations"], input[name="observaciones"], input[name="note"], textarea[name="notes"], textarea[name="observations"], textarea[name="observaciones"], textarea[name="note"]',
  nifInput:
    'div[name="identification_code"] input, div[name="nif"] input, div[name="vat"] input, div[name="vat_number"] input, div[name="nif_titular"] input, input[name="identification_code"], input[name="nif"], input[name="vat"], input[name="vat_number"], input[name="nif_titular"]',
  nifValue:
    'div[name="identification_code"], div[name="nif"], div[name="vat"], div[name="vat_number"], div[name="nif_titular"], span[name="identification_code"], span[name="nif"], span[name="vat"], span[name="vat_number"], span[name="nif_titular"]',
  origenInput:
    'div[name="origin"] input, div[name="origen"] input, div[name="source"] input, input[name="origin"], input[name="origen"], input[name="source"]',
  origenValue:
    'div[name="origin"], div[name="origen"], div[name="source"], span[name="origin"], span[name="origen"], span[name="source"]',
  estadoInput:
    'div[name="state"] input, div[name="estado"] input, input[name="state"], input[name="estado"]',
  estadoValue: `div[name="state"], div[name="estado"], span[name="state"], span[name="estado"], ${odooCommonSelectors.statusbarActive}`,
  labels: {
    codigoExpediente: 'Codigo de expediente',
    titular: 'Titular',
    fechaApertura: 'Fecha de Apertura',
    cnae: 'CNAE',
    responsable: 'Responsable',
    observaciones: 'Observaciones',
    nif: 'NIF',
    origen: 'Origen',
    estado: 'Estado'
  }
} as const;
