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

export interface PersonaFisicaSinPaisNacimientoTestData {
  nombre: string;
  primerApellido: string;
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

export interface EmpresaCnaeDuplicadoTestData {
  nombre: string;
  cnae: string;
}

export interface EmpresaIaeTestData {
  nombre: string;
  epigrafePrincipal: string;
  epigrafeSecundario: string;
  fechaInicio: string;
  fechaBaja: string;
}

export interface EmpresaBancoEspanaTestData {
  nombre: string;
  situacionBe: string;
  vinculacionAapp: string;
  sectorInstitucional: string;
}

export interface EmpresaDireccionExtendidaTestData {
  nombre: string;
  tipoVia: string;
  numero: string;
  planta: string;
  puerta: string;
  codigoPostal: string;
}

export interface EmpresaRepresentanteTestData {
  nombreEmpresa: string;
  nombreRepresentante: string;
  tipoVinculacion: string;
}

export interface EmpresaRegistroMercantilTestData {
  nombre: string;
  provinciaInscripcion: string;
  fechaInscripcion: string;
  fechaInscripcionFutura: string;
  tomo: string;
  folio: string;
  hoja: string;
  inscripcion: string;
}

export interface EmpresaInformeClienteTestData {
  nombre: string;
  experienciaCliente: string;
  descripcionActividad: string;
  instalacionesMaquinaria: string;
  proveedoresHabituales: string;
  clientesRelevantes: string;
}

export interface MaestroContactosTestData {
  formaJuridica: {
    nombre: string;
    codigo: string;
  };
  vinculacion: {
    nombre: string;
  };
}

export interface UnidadDecisionTestData {
  nombre: string;
  codigo: string;
  grupoEconomico: string;
}

export interface TipologiaContactosTestData {
  contactoNombre: string;
  tipologiaNueva: {
    nombre: string;
    descripcion: string;
  };
  tipologiaExistente: string;
}

const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

const generateNif = (): string => {
  const number = 10_000_000 + (Date.now() % 90_000_000);
  const letter = NIF_LETTERS[number % NIF_LETTERS.length];

  return `${number}${letter}`;
};

const generateNie = (): string => {
  const prefixes = ['X', 'Y', 'Z'] as const;
  const prefixIndex = Date.now() % prefixes.length;
  const prefix = prefixes[prefixIndex];
  const number = 1_000_000 + ((Date.now() >> 1) % 9_000_000);
  const combined = prefixIndex * 10_000_000 + number;
  const letter = NIF_LETTERS[combined % NIF_LETTERS.length];

  return `${prefix}${number}${letter}`;
};

const uniqueSuffix = (): string => Date.now().toString().slice(-6);

const uniqueThreeLetterCode = (): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let value = Date.now() % (alphabet.length ** 3);
  const third = alphabet[value % alphabet.length];
  value = Math.floor(value / alphabet.length);
  const second = alphabet[value % alphabet.length];
  value = Math.floor(value / alphabet.length);
  const first = alphabet[value % alphabet.length];

  return `${first}${second}${third}`;
};

const uniqueDecisionUnitCode = (): string => {
  return `U${(Date.now() % 10000).toString().padStart(4, '0')}`;
};

const todayAsSpanishDate = (): string => {
  const today = new Date();
  return toSpanishDate(today);
};

const calculateAge = (birthDateSpanish: string): string => {
  const [day, month, year] = birthDateSpanish.split('/').map(Number);
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthday) age -= 1;
  return age.toString();
};

const futureSpanishDate = (yearsToAdd: number): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + yearsToAdd);

  return toSpanishDate(date);
};

const toSpanishDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const PERSONA_FISICA_BIRTH_DATE = '15/03/1980';

export const createPersonaFisicaTestData = (): PersonaFisicaTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Juan ${suffix}`,
    primerApellido: 'Garcia',
    segundoApellido: 'Lopez',
    segundoApellidoEditado: 'Martinez',
    nif: generateNif(),
    fechaNacimiento: PERSONA_FISICA_BIRTH_DATE,
    edadEsperada: calculateAge(PERSONA_FISICA_BIRTH_DATE),
    paisNacimiento: 'España',
    sexo: 'Hombre'
  };
};

export const createPersonaFisicaConFechaNacimientoFuturaTestData = (): PersonaFisicaTestData => {
  return {
    ...createPersonaFisicaTestData(),
    nombre: `Fecha futura ${uniqueSuffix()}`,
    fechaNacimiento: futureSpanishDate(1),
    edadEsperada: ''
  };
};

export const personaFisicaSinNombrePrimerApellido: PersonaFisicaValidacionRequeridosTestData = {
  nombre: '',
  primerApellido: '',
  nif: '34129080R',
  fechaNacimiento: '01/01/1990'
};

export const personaFisicaSinPaisNacimiento: PersonaFisicaSinPaisNacimientoTestData = {
  nombre: 'Ana',
  primerApellido: 'Lopez'
};

export const createPersonaFisicaDocumentoTestData = (): PersonaFisicaDocumentoTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Documento ${suffix}`,
    primerApellido: 'Validacion',
    nifInvalido: '11111111A',
    nifValido: generateNif(),
    nieValido: generateNie(),
    fechaNacimiento: '01/01/1990',
    paisNacimiento: 'España',
    sexo: 'Hombre'
  };
};

export const createEmpresaCnaeTestData = (): EmpresaCnaeTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa CNAE ${suffix}`,
    cnaePrincipal: '0111',
    cnaeSecundario: '0620'
  };
};

export const createEmpresaCnaeDuplicadoTestData = (): EmpresaCnaeDuplicadoTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa CNAE Duplicado ${suffix}`,
    cnae: '0111'
  };
};

export const createEmpresaIaeTestData = (): EmpresaIaeTestData => {
  const suffix = uniqueSuffix();
  const today = todayAsSpanishDate();

  return {
    nombre: `Empresa IAE ${suffix}`,
    epigrafePrincipal: '372',
    epigrafeSecundario: '062',
    fechaInicio: today,
    fechaBaja: today
  };
};

export const createEmpresaBancoEspanaTestData = (): EmpresaBancoEspanaTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa BE ${suffix}`,
    situacionBe: 'Activo',
    vinculacionAapp: 'Dependiente de la Administración Central española',
    sectorInstitucional: 'Sociedades no financieras'
  };
};

export const createEmpresaDireccionExtendidaTestData = (): EmpresaDireccionExtendidaTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa Dirección ${suffix}`,
    tipoVia: 'Calle',
    numero: '25',
    planta: '3',
    puerta: 'B',
    codigoPostal: '46001'
  };
};

export const createEmpresaRepresentanteTestData = (): EmpresaRepresentanteTestData => {
  const suffix = uniqueSuffix();

  return {
    nombreEmpresa: `Empresa Representante ${suffix}`,
    nombreRepresentante: `Representante ${suffix}`,
    tipoVinculacion: 'Representante'
  };
};

export const createEmpresaRegistroMercantilTestData = (): EmpresaRegistroMercantilTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa Registro ${suffix}`,
    provinciaInscripcion: 'Madrid',
    fechaInscripcion: todayAsSpanishDate(),
    fechaInscripcionFutura: futureSpanishDate(1),
    tomo: '250',
    folio: '75',
    hoja: `V-${suffix}`,
    inscripcion: '1'
  };
};

export const createEmpresaInformeClienteTestData = (): EmpresaInformeClienteTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Empresa Informe Cliente ${suffix}`,
    experienciaCliente: 'Mas de 10 anos en el sector industrial',
    descripcionActividad: 'Fabricacion de componentes metalicos',
    instalacionesMaquinaria: 'Nave industrial de 2.000 m2, tornos CNC',
    proveedoresHabituales: 'Aceros del Norte SL, Metal Iberica SA',
    clientesRelevantes: 'Empresa A, Empresa B'
  };
};

export const createMaestroContactosTestData = (): MaestroContactosTestData => {
  const suffix = uniqueSuffix();

  return {
    formaJuridica: {
      nombre: `Cooperativa de Credito ${suffix}`,
      codigo: uniqueThreeLetterCode()
    },
    vinculacion: {
      nombre: `Proveedor estrategico ${suffix}`
    }
  };
};

export const createUnidadDecisionTestData = (): UnidadDecisionTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Unidad Decision Test ${suffix}`,
    codigo: uniqueDecisionUnitCode(),
    grupoEconomico: 'Grupo económico con miembros'
  };
};

export const createTipologiaContactosTestData = (): TipologiaContactosTestData => {
  const suffix = uniqueSuffix();

  return {
    contactoNombre: `Contacto Tipologia ${suffix}`,
    tipologiaNueva: {
      nombre: `BLQ ${suffix}`,
      descripcion: `Bloqueo de Solicitud ${suffix}`
    },
    tipologiaExistente: 'Cliente'
  };
};

