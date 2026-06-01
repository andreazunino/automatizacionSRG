export interface TipoBienTestData {
  descripcion: string;
  descripcionEditada: string;
  tipoGti: string;
  tipoBe: string;
  limitarResponsabilidadPrincipal: boolean;
}

export interface RegistroPropiedadTestData {
  codigo: string;
  descripcion: string;
  descripcionEditada: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  telefono: string;
  email: string;
  web: string;
}

export interface MotivoSolicitudItemTestData {
  motivo: string;
  tipoSolicitud: string;
  nombreCompletoEsperado: string;
}

export interface MotivoSolicitudTestData {
  solicitudManual: MotivoSolicitudItemTestData;
  caducidadDud: MotivoSolicitudItemTestData;
}

export interface TipoCargaItemTestData {
  codigo: string;
  descripcion: string;
  secuencia: string;
  cargaFavorSgr: boolean;
}

export interface TipoCargaTestData {
  hipoteca: TipoCargaItemTestData;
  duplicado: TipoCargaItemTestData;
  sgr: TipoCargaItemTestData;
}

export interface BienPrincipalTestData {
  codigo: string;
  descripcion: string;
  descripcionEditada: string;
  tipo: string;
  fechaNoSimple: string;
  registroPropiedad: string;
  libro: string;
  hoja: string;
  folio: string;
  numeroFinca: string;
  referenciaCatastral: string;
  superficieEdificada: string;
  superficieUtil: string;
  valorMercado: string;
  llaves: boolean;
  ocupado: boolean;
}

export interface BienDocumentosTestData {
  descripcion: string;
  descripcionEditada: string;
  tipo: string;
}

export interface BienBusquedaFiltrosTestData {
  pisoOcupado: BienPrincipalTestData;
  naveLibre: BienPrincipalTestData;
  localOcupado: BienPrincipalTestData;
  busquedaDescripcion: string;
  busquedaReferenciaCatastral: string;
}

export interface BienPropietarioTestData {
  nombre: string;
  porcentaje: string;
  fechaAdquisicion?: string;
  registrarPropiedad: boolean;
}

export interface BienPropietariosTestData {
  bien: BienPrincipalTestData;
  propietarioPrincipal: BienPropietarioTestData;
  propietarioSecundario: BienPropietarioTestData;
}

export interface BienPropietariosExcesoTestData {
  bien: BienPrincipalTestData;
  propietarioInicial: BienPropietarioTestData;
  propietarioExceso: BienPropietarioTestData;
}

export interface BienPropietariosFechasTestData {
  fechaAdquisicionFutura: {
    bien: BienPrincipalTestData;
    propietario: BienPropietarioTestData;
  };
  bajaSinAdquisicion: {
    bien: BienPrincipalTestData;
    propietario: BienPropietarioTestData;
    fechaBaja: string;
  };
  adquisicionPosteriorABaja: {
    bien: BienPrincipalTestData;
    propietario: BienPropietarioTestData;
    fechaBaja: string;
  };
}

export interface BienPropietarioBajaTestData {
  bien: BienPrincipalTestData;
  propietarioActivo: BienPropietarioTestData;
  propietarioBaja: BienPropietarioTestData;
  fechaAdquisicionBaja: string;
  fechaBaja: string;
}

export interface BienAgrupacionTestData {
  agrupadora: BienPrincipalTestData;
  hija: BienPrincipalTestData;
}

export interface BienSinAgrupacionTestData {
  bien: BienPrincipalTestData;
}

export interface BienCargaHipotecariaTestData {
  bien: BienPrincipalTestData;
  descripcion: string;
  descripcionEditada: string;
  tipoCarga: string;
  beneficiario: string;
  fechaBaja: string;
  importePrincipal: string;
  interesesOrdinarios: string;
  interesesDemora: string;
  gastos: string;
  totalEsperado: string;
}

export interface BienCargaHistoricoTestData {
  bien: BienPrincipalTestData;
  descripcion: string;
  tipoCarga: string;
  beneficiario: string;
  fechaBaja: string;
  importePrincipal: string;
}

export interface BienCargaImportesNegativosTestData {
  bien: BienPrincipalTestData;
  descripcion: string;
  tipoCarga: string;
  orden: number;
  responsabilidadHipotecariaNegativa: string;
  importePrincipalNegativo: string;
  responsabilidadHipotecaria: string;
  importePrincipal: string;
  interesesOrdinarios: string;
  interesesDemora: string;
  gastos: string;
  totalEsperado: string;
}

export interface BienTasacionManualTestData {
  bien: BienPrincipalTestData;
  fechaValor: string;
  fechaCaducidad: string;
  valor: string;
  cumpleEco: boolean;
  tasadora: string;
  metodoTasacion: string;
}

export interface BienTasacionGarantiaTestData {
  tasacionOrigen: BienTasacionManualTestData;
  valorModificado: string;
}

export interface BienTasacionJustificacionesTestData {
  tasacion: BienTasacionManualTestData;
  justificacionNoTasable: string;
  justificacionNoValorar: string;
}

export interface SolicitudTasacionDominiosTestData {
  bien: BienPrincipalTestData;
  titularTasador: string;
  tasadoraNoTasadora: string;
  estadoEsperado: string;
}

export interface SolicitudTasacionWorkflowTestData {
  bien: BienPrincipalTestData;
  titular: string;
  tasadora: string;
  estadoInicial: string;
  estadoEnviada: string;
  estadoDocRecibido: string;
  estadoConfirmado: string;
}

export interface SolicitudTasacionMailValidationTestData {
  bien: BienPrincipalTestData;
  titular: string;
  tasadoraSinEmail: string;
  emailTasadora: string;
  estadoSolicitada: string;
  estadoEnviada: string;
}

export interface BienSeguridadCrudTestData {
  bien: BienPrincipalTestData;
  tipoBien: TipoBienTestData;
  registroPropiedad: RegistroPropiedadTestData;
  tipoCarga: TipoCargaItemTestData;
  carga: BienCargaHipotecariaTestData;
}

const uniqueSuffix = (): string => Date.now().toString().slice(-6);

export const createTipoBienTestData = (): TipoBienTestData => {
  const suffix = uniqueSuffix();

  return {
    descripcion: `Inmueble Residencial Test ${suffix}`,
    descripcionEditada: `Inmueble Residencial Test - Mod ${suffix}`,
    tipoGti: '001',
    tipoBe: 'INM',
    limitarResponsabilidadPrincipal: true
  };
};

export const createRegistroPropiedadTestData = (): RegistroPropiedadTestData => {
  const suffix = uniqueSuffix();

  return {
    codigo: `REG-TEST-${suffix}`,
    descripcion: `Registro Madrid Centro ${suffix}`,
    descripcionEditada: `Registro Madrid Centro - Mod ${suffix}`,
    direccion: 'C/ Prueba 1',
    codigoPostal: '28001',
    poblacion: 'Madrid',
    telefono: '912345678',
    email: `registro${suffix}@test.es`,
    web: 'www.test.es'
  };
};

export const createMotivoSolicitudTestData = (): MotivoSolicitudTestData => {
  return {
    solicitudManual: {
      motivo: 'Solicitud',
      tipoSolicitud: 'Nueva operación Manual',
      nombreCompletoEsperado: 'Solicitud Nueva operación Manual'
    },
    caducidadDud: {
      motivo: 'Caducidad',
      tipoSolicitud: 'DUD',
      nombreCompletoEsperado: 'Caducidad DUD'
    }
  };
};

export const createTipoCargaTestData = (): TipoCargaTestData => {
  const suffix = uniqueSuffix();
  const hipotecaCodigo = `HIP-TEST-${suffix}`;

  return {
    hipoteca: {
      codigo: hipotecaCodigo,
      descripcion: `Hipoteca Test ${suffix}`,
      secuencia: '50',
      cargaFavorSgr: false
    },
    duplicado: {
      codigo: hipotecaCodigo,
      descripcion: `Hipoteca Test Duplicada ${suffix}`,
      secuencia: '51',
      cargaFavorSgr: false
    },
    sgr: {
      codigo: `SGR-TEST-${suffix}`,
      descripcion: `Embargo SGR Test ${suffix}`,
      secuencia: '60',
      cargaFavorSgr: true
    }
  };
};

export const createBienPrincipalTestData = (): BienPrincipalTestData => {
  const suffix = uniqueSuffix();

  return {
    codigo: `BIE-TEST-${suffix}`,
    descripcion: `Piso Test Madrid ${suffix}`,
    descripcionEditada: `Piso Test Madrid - Test ${suffix}`,
    tipo: 'Inmueble',
    fechaNoSimple: '01/01/2024',
    registroPropiedad: 'Registro',
    libro: '1',
    hoja: '100',
    folio: '5',
    numeroFinca: '12345',
    referenciaCatastral: `9999999AB0001S${suffix.slice(-4)}`,
    superficieEdificada: '80',
    superficieUtil: '65',
    valorMercado: '150000',
    llaves: true,
    ocupado: true
  };
};

export const createBienDocumentosTestData = (): BienDocumentosTestData => {
  const suffix = uniqueSuffix();

  return {
    descripcion: `Bien Docs Test ${suffix}`,
    descripcionEditada: `Bien Docs Test - Renombrado ${suffix}`,
    tipo: 'Inmueble'
  };
};

export const createBienBusquedaFiltrosTestData = (): BienBusquedaFiltrosTestData => {
  const suffix = uniqueSuffix();
  const createBien = (
    descripcion: string,
    referenciaCatastral: string,
    ocupado: boolean
  ): BienPrincipalTestData => ({
    codigo: `BIE-FILT-${suffix}-${ocupado ? 'O' : 'L'}-${descripcion.slice(0, 1).toUpperCase()}`,
    descripcion: `${descripcion} ${suffix}`,
    descripcionEditada: `${descripcion} Editado ${suffix}`,
    tipo: 'Inmueble',
    fechaNoSimple: '01/01/2024',
    registroPropiedad: 'Registro',
    libro: '1',
    hoja: '100',
    folio: '5',
    numeroFinca: '12345',
    referenciaCatastral,
    superficieEdificada: '80',
    superficieUtil: '65',
    valorMercado: '150000',
    llaves: true,
    ocupado
  });

  const pisoOcupado = createBien(`Piso Busqueda Test`, `9999999AB0001${suffix.slice(-4)}`, true);

  return {
    pisoOcupado,
    naveLibre: createBien(`Nave Busqueda Test`, `8888888AB0001${suffix.slice(-4)}`, false),
    localOcupado: createBien(`Local Busqueda Test`, `7777777AB0001${suffix.slice(-4)}`, true),
    busquedaDescripcion: 'Piso',
    busquedaReferenciaCatastral: pisoOcupado.referenciaCatastral
  };
};

export const createBienPropietariosTestData = (): BienPropietariosTestData => {
  return {
    bien: createBienPrincipalTestData(),
    propietarioPrincipal: {
      nombre: 'Juan García',
      porcentaje: '60',
      fechaAdquisicion: '01/01/2020',
      registrarPropiedad: true
    },
    propietarioSecundario: {
      nombre: 'María López',
      porcentaje: '40',
      registrarPropiedad: false
    }
  };
};

export const createBienPropietariosExcesoTestData = (): BienPropietariosExcesoTestData => {
  return {
    bien: createBienPrincipalTestData(),
    propietarioInicial: {
      nombre: 'Juan García',
      porcentaje: '60',
      fechaAdquisicion: '01/01/2020',
      registrarPropiedad: true
    },
    propietarioExceso: {
      nombre: 'Pedro Sánchez',
      porcentaje: '50',
      registrarPropiedad: false
    }
  };
};

export const createBienPropietariosFechasTestData = (): BienPropietariosFechasTestData => {
  return {
    fechaAdquisicionFutura: {
      bien: createBienPrincipalTestData(),
      propietario: {
        nombre: 'Juan García',
        porcentaje: '30',
        fechaAdquisicion: futureSpanishDate(1),
        registrarPropiedad: false
      }
    },
    bajaSinAdquisicion: {
      bien: createBienPrincipalTestData(),
      propietario: {
        nombre: 'María López',
        porcentaje: '30',
        registrarPropiedad: false
      },
      fechaBaja: '01/01/2023'
    },
    adquisicionPosteriorABaja: {
      bien: createBienPrincipalTestData(),
      propietario: {
        nombre: 'Pedro Sánchez',
        porcentaje: '30',
        fechaAdquisicion: '01/06/2023',
        registrarPropiedad: false
      },
      fechaBaja: '01/01/2020'
    }
  };
};

export const createBienPropietarioBajaTestData = (): BienPropietarioBajaTestData => {
  return {
    bien: createBienPrincipalTestData(),
    propietarioActivo: {
      nombre: 'Juan García',
      porcentaje: '60',
      fechaAdquisicion: '01/01/2020',
      registrarPropiedad: true
    },
    propietarioBaja: {
      nombre: 'María López',
      porcentaje: '40',
      registrarPropiedad: false
    },
    fechaAdquisicionBaja: '15/03/2020',
    fechaBaja: '01/03/2026'
  };
};

export const createBienAgrupacionTestData = (): BienAgrupacionTestData => {
  const suffix = uniqueSuffix();
  const createBienAgrupacion = (descripcion: string): BienPrincipalTestData => ({
    ...createBienPrincipalTestData(),
    codigo: `BIE-AGR-${suffix}-${descripcion.includes('Hija') ? 'H' : 'P'}`,
    descripcion: `${descripcion} ${suffix}`,
    descripcionEditada: `${descripcion} Editada ${suffix}`,
    referenciaCatastral: `${descripcion.includes('Hija') ? '6666666' : '5555555'}AB0001${suffix.slice(-4)}`
  });

  return {
    agrupadora: createBienAgrupacion('Finca Agrupadora Test'),
    hija: createBienAgrupacion('Finca Hija Test')
  };
};

export const createBienSinAgrupacionTestData = (): BienSinAgrupacionTestData => {
  return {
    bien: createBienPrincipalTestData()
  };
};

export const createBienCargaHipotecariaTestData = (): BienCargaHipotecariaTestData => {
  return {
    bien: createBienPrincipalTestData(),
    descripcion: 'Hipoteca Banco Test',
    descripcionEditada: 'Hipoteca Banco Test - Mod',
    tipoCarga: 'HIPOTECA',
    beneficiario: 'Juan García',
    fechaBaja: '01/01/2040',
    importePrincipal: '100000',
    interesesOrdinarios: '5000',
    interesesDemora: '2000',
    gastos: '1500',
    totalEsperado: '108500'
  };
};

export const createBienCargaHistoricoTestData = (): BienCargaHistoricoTestData => {
  return {
    bien: createBienPrincipalTestData(),
    descripcion: 'Hipoteca Banco Test',
    tipoCarga: 'HIPOTECA',
    beneficiario: 'Juan García',
    fechaBaja: '01/01/2024',
    importePrincipal: '100000'
  };
};

export const createBienCargaImportesNegativosTestData = (): BienCargaImportesNegativosTestData => {
  return {
    bien: createBienPrincipalTestData(),
    descripcion: 'Hipoteca Test Negativo',
    tipoCarga: 'HIPOTECA',
    orden: 10,
    responsabilidadHipotecariaNegativa: '-5000',
    importePrincipalNegativo: '-1000',
    responsabilidadHipotecaria: '5000',
    importePrincipal: '1000',
    interesesOrdinarios: '200',
    interesesDemora: '300',
    gastos: '400',
    totalEsperado: '1900'
  };
};

export const createBienTasacionManualTestData = (): BienTasacionManualTestData => {
  return {
    bien: createBienPrincipalTestData(),
    fechaValor: '01/01/2025',
    fechaCaducidad: '01/01/2027',
    valor: '150000',
    cumpleEco: true,
    tasadora: 'AESVAL LOGICA DE VALORACIONES S.A.',
    metodoTasacion: 'Método'
  };
};

export const createBienTasacionGarantiaTestData = (): BienTasacionGarantiaTestData => {
  return {
    tasacionOrigen: createBienTasacionManualTestData(),
    valorModificado: '160000'
  };
};

export const createBienTasacionJustificacionesTestData = (): BienTasacionJustificacionesTestData => {
  return {
    tasacion: createBienTasacionManualTestData(),
    justificacionNoTasable: 'Bien con litigio judicial activo',
    justificacionNoValorar: 'Cliente aporta valoración propia'
  };
};

export const createSolicitudTasacionDominiosTestData = (): SolicitudTasacionDominiosTestData => {
  return {
    bien: createBienPrincipalTestData(),
    titularTasador: 'Contacto Tasadora Test',
    tasadoraNoTasadora: 'Contacto Titular Test',
    estadoEsperado: 'Solicitada'
  };
};

export const createSolicitudTasacionWorkflowTestData = (): SolicitudTasacionWorkflowTestData => {
  return {
    bien: createBienPrincipalTestData(),
    titular: 'Juan García',
    tasadora: 'AESVAL LOGICA DE VALORACIONES S.A.',
    estadoInicial: 'solicitada',
    estadoEnviada: 'enviada',
    estadoDocRecibido: 'doc_recibido',
    estadoConfirmado: 'confirmado'
  };
};

export const createSolicitudTasacionMailValidationTestData = (): SolicitudTasacionMailValidationTestData => {
  const suffix = uniqueSuffix();

  return {
    bien: createBienPrincipalTestData(),
    titular: 'Juan García',
    tasadoraSinEmail: `Tasadora Sin Email ${suffix}`,
    emailTasadora: `tasadora.sin.email.${suffix}@example.com`,
    estadoSolicitada: 'solicitada',
    estadoEnviada: 'enviada'
  };
};

export const createBienSeguridadCrudTestData = (): BienSeguridadCrudTestData => {
  const suffix = uniqueSuffix();
  const bien: BienPrincipalTestData = {
    ...createBienPrincipalTestData(),
    codigo: `SEG-TEST-${suffix}`,
    descripcion: `Test Seguridad ${suffix}`,
    descripcionEditada: `Test Seguridad - Mod ${suffix}`
  };
  const tipoCarga: TipoCargaItemTestData = {
    codigo: `SEG-CARGA-${suffix}`,
    descripcion: `Tipo Carga Seguridad ${suffix}`,
    secuencia: '70',
    cargaFavorSgr: false
  };

  return {
    bien,
    tipoBien: createTipoBienTestData(),
    registroPropiedad: createRegistroPropiedadTestData(),
    tipoCarga,
    carga: {
      bien,
      descripcion: `Carga Seguridad ${suffix}`,
      descripcionEditada: `Carga Seguridad - Mod ${suffix}`,
      tipoCarga: tipoCarga.codigo,
      beneficiario: 'Juan García',
      fechaBaja: '01/01/2040',
      importePrincipal: '100000',
      interesesOrdinarios: '5000',
      interesesDemora: '2000',
      gastos: '1500',
      totalEsperado: '108500'
    }
  };
};

const futureSpanishDate = (daysToAdd: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
