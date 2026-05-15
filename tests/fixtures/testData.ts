export interface ContactoTestData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
}

export interface PersonaFisicaTestData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  segundoApellidoEditado: string;
  nif: string;
  fechaNacimiento: string;
  edadEsperada: string;
  paisNacimiento: string;
  sexo: string;
}

const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

const generateNif = (): string => {
  const number = 10_000_000 + (Date.now() % 90_000_000);
  const letter = NIF_LETTERS[number % NIF_LETTERS.length];

  return `${number}${letter}`;
};

const uniqueSuffix = (): string => Date.now().toString().slice(-6);

export const createPersonaFisicaTestData = (): PersonaFisicaTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Juan ${suffix}`,
    primerApellido: 'Garcia',
    segundoApellido: 'Lopez',
    segundoApellidoEditado: 'Martinez',
    nif: generateNif(),
    fechaNacimiento: '15/03/1980',
    edadEsperada: '46',
    paisNacimiento: 'España',
    sexo: 'Hombre'
  };
};

export const testData: { contactos: Record<string, ContactoTestData> } = {
  contactos: {
    contactoExistente: {
      nombre: 'Andrea Garcia Garcia',
      apellido: '',
      email: 'andrea@atlas.com',
      telefono: '',
      documento: 'andrea@atlas.com'
    },
    contactoValido: {
      nombre: 'Contacto QA',
      apellido: 'Automatizado',
      email: 'contacto.qa@example.com',
      telefono: '1122334455',
      documento: '30111222'
    },
    contactoEditado: {
      nombre: 'Contacto QA Editado',
      apellido: 'Automatizado',
      email: 'contacto.qa.editado@example.com',
      telefono: '1199887766',
      documento: '30111222'
    },
    contactoDuplicado: {
      nombre: 'Contacto Duplicado',
      apellido: 'Automatizado',
      email: 'contacto.duplicado@example.com',
      telefono: '1100001111',
      documento: '30999888'
    }
  }
};
