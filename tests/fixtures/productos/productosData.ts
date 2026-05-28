export interface ProductoFinancieroTestData {
  nombre: string;
  nombreCopia: string;
  tipologia: string;
  control: string;
  controlAlternativo: string;
  grupoAsignar: string;
  reavalMinimo: string;
  reavalMaximo: string;
  importeMinimo: string;
  importeMaximo: string;
  plazoMinimoMeses: string;
  plazoMaximoMeses: string;
  descuentoDias: string;
  interesInicial: string;
  interesEditado: string;
  porcentajeCompartidoMinimo: string;
  porcentajeCompartidoMaximo: string;
  receptorFijo: string;
  entidadFinanciera: string;
  receptorFijoContacto: string;
  contactoReceptor: string;
  cnaeSolapamiento: string;
  tipologiaClienteSolapamiento: string;
  entidadFinancieraSolapamiento: string;
  provinciaSolapamiento: string;
  codigoPostalSolapamiento: string;
  ciudadSolapamiento: string;
  lineaComision: {
    concepto: string;
    tipo: string;
    modo: string;
    porcentajeMinimo: string;
    porcentajeMaximo: string;
    porcentajeMaximoEditado: string;
    plazoMinimoMeses: string;
    importeMinimo: string;
    importeMaximo: string;
    periodicidad: string;
  };
  lineaComisionDuplicada: {
    concepto: string;
    tipo: string;
    modo: string;
    porcentajeMinimo: string;
    porcentajeMaximo: string;
    periodicidad: string;
  };
  comision: {
    nombre: string;
    valor: string;
  };
}

export interface ProductoComisionTestData {
  nombre: string;
  tipoEsperado: string;
}

export interface ConceptoComisionHuerfanoTestData {
  nombre: string;
  codigo: string;
  tipo: string;
  modo: string;
  porcentajeMinimo: string;
  porcentajeMaximo: string;
  periodicidad: string;
}

export interface ConceptoComisionNoProtegidoTestData {
  nombre: string;
  nombreEditado: string;
  codigo: string;
  productoComision: string;
}

export interface TipologiaProductoTestData {
  nombre: string;
  nombreEditado: string;
}

export interface NaturalezaT4TestData {
  codigo: string;
  descripcion: string;
  descripcionEditada: string;
}


const uniqueSuffix = (): string => Date.now().toString().slice(-6);

export const createProductoFinancieroTestData = (): ProductoFinancieroTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `PrÃ©stamo PYME Test ${suffix}`,
    nombreCopia: `Copia PrÃ©stamo PYME ${suffix}`,
    tipologia: 'InversiÃ³n',
    control: 'Control por importe',
    controlAlternativo: 'Control por riesgo vivo',
    grupoAsignar: 'Circulante',
    reavalMinimo: '10',
    reavalMaximo: '80',
    importeMinimo: '5000',
    importeMaximo: '500000',
    plazoMinimoMeses: '12',
    plazoMaximoMeses: '120',
    descuentoDias: '0',
    interesInicial: '3',
    interesEditado: '3.5',
    porcentajeCompartidoMinimo: '0',
    porcentajeCompartidoMaximo: '100',
    receptorFijo: 'Entidad financiera',
    entidadFinanciera: 'Banco Santander',
    receptorFijoContacto: 'Contacto',
    contactoReceptor: 'Banco Santander',
    cnaeSolapamiento: '0111',
    tipologiaClienteSolapamiento: 'PYME',
    entidadFinancieraSolapamiento: 'Banco Santander',
    provinciaSolapamiento: 'Guarda',
    codigoPostalSolapamiento: '46001',
    ciudadSolapamiento: 'Valencia',
    lineaComision: {
      concepto: 'ComisiÃ³n aval',
      tipo: 'InversiÃ³n',
      modo: 'Porcentual',
      porcentajeMinimo: '0.5',
      porcentajeMaximo: '2.0',
      porcentajeMaximoEditado: '2.5',
      plazoMinimoMeses: '1',
      importeMinimo: '1000',
      importeMaximo: '5000',
      periodicidad: 'Al tirÃ³n'
    },
    lineaComisionDuplicada: {
      concepto: 'ComisiÃ³n estudio',
      tipo: 'InversiÃ³n',
      modo: 'Porcentual',
      porcentajeMinimo: '0.5',
      porcentajeMaximo: '2.0',
      periodicidad: 'Al tirÃ³n'
    },
    comision: {
      nombre: 'ComisiÃ³n de apertura',
      valor: '1'
    }
  };
};

export const createProductoComisionTestData = (): ProductoComisionTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `ComisiÃ³n Aval Test ${suffix}`,
    tipoEsperado: 'Servicio'
  };
};

export const createConceptoComisionHuerfanoTestData = (): ConceptoComisionHuerfanoTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `Test Sin Producto ${suffix}`,
    codigo: `tsp${suffix}`,
    tipo: 'InversiÃ³n',
    modo: 'Porcentual',
    porcentajeMinimo: '0.5',
    porcentajeMaximo: '2.0',
    periodicidad: 'Al tirÃ³n'
  };
};

export const createConceptoComisionNoProtegidoTestData = (): ConceptoComisionNoProtegidoTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `ComisiÃ³n Personalizada Test ${suffix}`,
    nombreEditado: `ComisiÃ³n Personalizada Test v2 ${suffix}`,
    codigo: `cpt${suffix}`,
    productoComision: 'ComisiÃ³n aval Producto'
  };
};

export const createTipologiaProductoTestData = (): TipologiaProductoTestData => {
  const suffix = uniqueSuffix();

  return {
    nombre: `TÃ©cnico ${suffix}`,
    nombreEditado: `TÃ©cnico v2 ${suffix}`
  };
};

export const createNaturalezaT4TestData = (): NaturalezaT4TestData => {
  const suffix = uniqueSuffix();

  return {
    codigo: `T4-${suffix}`,
    descripcion: `Naturaleza T4 de prueba ${suffix}`,
    descripcionEditada: `Naturaleza T4 de prueba v2 ${suffix}`
  };
};


