import type { PersonaFisicaTestData } from '../contactos/contactosData';

export interface ExpedienteBlanqueoTestData {
  titular: string;
  titularNif: string;
  titularPersona: PersonaFisicaTestData;
  cnae: string;
  responsable: string;
  observaciones: string;
  fechaApertura: string;
  estadoInicial: string;
  origenEsperado: string;
}

const spanishToday = (): string => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const uniqueSuffix = (): string => Date.now().toString().slice(-6);

const generateNif = (): string => {
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const number = 10_000_000 + (Date.now() % 90_000_000);
  const letter = letters[number % letters.length];

  return `${number}${letter}`;
};

export const createExpedienteBlanqueoTestData = (): ExpedienteBlanqueoTestData => {
  const suffix = uniqueSuffix();
  const titularNif = generateNif();
  const titularPersona: PersonaFisicaTestData = {
    nombre: `Titular Blanqueo ${suffix}`,
    primerApellido: 'QA',
    segundoApellido: 'Automation',
    segundoApellidoEditado: 'Automation Editado',
    nif: titularNif,
    fechaNacimiento: '01/01/1990',
    edadEsperada: '',
    paisNacimiento: 'España',
    sexo: 'Hombre'
  };

  return {
    titular: `${titularPersona.nombre} ${titularPersona.primerApellido} ${titularPersona.segundoApellido}`,
    titularNif,
    titularPersona,
    cnae: '011',
    responsable: '',
    observaciones: 'Expediente de prueba BLA-001',
    fechaApertura: spanishToday(),
    estadoInicial: 'Incompleto',
    origenEsperado: 'Manual'
  };
};
