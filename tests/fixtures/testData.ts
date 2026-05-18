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

export interface PersonaFisicaValidacionRequeridosTestData {
  nombre: string;
  primerApellido: string;
  nif: string;
  fechaNacimiento: string;
}

export type TipoDocumentoPersonaFisica = 'NIF' | 'NIE';

export interface PersonaFisicaDocumentoTestData {
  nombre: string;
  primerApellido: string;
  nifInvalido: string;
  nifValido: string;
  nieValido: string;
  fechaNacimiento: string;
  paisNacimiento: string;
  sexo: string;
}

export interface EmpresaCnaeTestData {
  nombre: string;
  cnaePrincipal: string;
  cnaeSecundario: string;
}

export interface EmpresaIaeTestData {
  nombre: string;
  epigrafePrincipal: string;
  epigrafeSecundario: string;
  fechaInicio: string;
  fechaBaja: string;
}

const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

const generateNif = (): string => {
  const number = 10_000_000 + (Date.now() % 90_000_000);
  const letter = NIF_LETTERS[number % NIF_LETTERS.length];

  return `${number}${letter}`;
};

const uniqueSuffix = (): string => Date.now().toString().slice(-6);

const todayAsSpanishDate = (): string => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

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

export const personaFisicaSinNombrePrimerApellido: PersonaFisicaValidacionRequeridosTestData = {
  nombre: '',
  primerApellido: '',
  nif: '34129080R',
  fechaNacimiento: '01/01/1990'
};

export const createPersonaFisicaDocumentoTestData = (): PersonaFisicaDocumentoTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Documento ${suffix}`,
    primerApellido: 'Validacion',
    nifInvalido: '11111111A',
    nifValido: '12345678Z',
    nieValido: 'X1234567L',
    fechaNacimiento: '01/01/1990',
    paisNacimiento: 'España',
    sexo: 'Hombre'
  };
};

export const createEmpresaCnaeTestData = (): EmpresaCnaeTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa CNAE ${suffix}`,
    cnaePrincipal: '6202',
    cnaeSecundario: '6209'
  };
};

export const createEmpresaIaeTestData = (): EmpresaIaeTestData => {
  const suffix = uniqueSuffix();
  const today = todayAsSpanishDate();

  return {
    nombre: `Empresa IAE ${suffix}`,
    epigrafePrincipal: '722',
    epigrafeSecundario: '6201',
    fechaInicio: today,
    fechaBaja: today
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
