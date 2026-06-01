import { When, Then } from '@cucumber/cucumber';
import {
  createBienAgrupacionTestData,
  createBienCargaHistoricoTestData,
  createBienCargaHipotecariaTestData,
  createBienCargaImportesNegativosTestData,
  createBienDocumentosTestData,
  createBienBusquedaFiltrosTestData,
  createBienPrincipalTestData,
  createBienPropietariosExcesoTestData,
  createBienPropietariosFechasTestData,
  createBienPropietarioBajaTestData,
  createBienPropietariosTestData,
  createBienSeguridadCrudTestData,
  createBienSinAgrupacionTestData,
  createBienTasacionGarantiaTestData,
  createBienTasacionJustificacionesTestData,
  createBienTasacionManualTestData,
  createSolicitudTasacionDominiosTestData,
  createSolicitudTasacionMailValidationTestData,
  createSolicitudTasacionWorkflowTestData,
  createMotivoSolicitudTestData,
  createRegistroPropiedadTestData,
  createTipoBienTestData,
  createTipoCargaTestData
} from '../fixtures/bienes/tipoBienData';
import type { CustomWorld } from '../support/world';

When('accedo al modulo Bienes', async function (this: CustomWorld) {
  await this.bienesPage.navigateToBienes();
});

When('creo edito archivo y activo un Tipo de Bienes', async function (this: CustomWorld) {
  this.currentTipoBien = createTipoBienTestData();
  await this.bienesPage.createEditArchiveAndReactivateTipoBien(this.currentTipoBien);
});

When('intento guardar un Tipo de Bienes sin Descripcion', async function (this: CustomWorld) {
  await this.bienesPage.trySaveTipoBienWithoutDescription();
});

When('creo edito archivo y valido Cod Registro obligatorio en Registro de Propiedad', async function (
  this: CustomWorld
) {
  this.currentRegistroPropiedad = createRegistroPropiedadTestData();
  await this.bienesPage.createEditArchiveRegistroPropiedadAndValidateRequiredCode(
    this.currentRegistroPropiedad
  );
});


When('gestiono Motivos de Solicitud y verifico limpieza del campo secundario', async function (
  this: CustomWorld
) {
  this.currentMotivoSolicitud = createMotivoSolicitudTestData();
  await this.bienesPage.manageMotivosSolicitudAndValidateConditionalSecondary(this.currentMotivoSolicitud);
});

When('gestiono Tipos de Carga y valido codigo unico', async function (this: CustomWorld) {
  this.currentTipoCarga = createTipoCargaTestData();
  await this.bienesPage.manageTiposCargaAndValidateUniqueCode(this.currentTipoCarga);
});

When('creo edito y archivo un Bien con sus campos principales', async function (this: CustomWorld) {
  this.currentBienPrincipal = createBienPrincipalTestData();
  await this.bienesPage.createEditAndArchiveBienPrincipal(this.currentBienPrincipal);
});

When('intento guardar un Bien sin Descripcion', async function (this: CustomWorld) {
  await this.bienesPage.trySaveBienPrincipalWithoutDescription();
});

When('creo un Bien y abro su carpeta de documentos', async function (this: CustomWorld) {
  this.currentBienDocumentos = createBienDocumentosTestData();
  await this.bienesPage.createBienAndOpenDocumentsFolder(this.currentBienDocumentos);
});

When('renombro un Bien con carpeta de documentos', async function (this: CustomWorld) {
  this.currentBienDocumentos = createBienDocumentosTestData();
  await this.bienesPage.renameBienAndOpenDocumentsFolder(this.currentBienDocumentos);
});

When('preparo bienes y valido busqueda global filtros y agrupacion', async function (this: CustomWorld) {
  this.currentBienBusquedaFiltros = createBienBusquedaFiltrosTestData();
  await this.bienesPage.validateBienesSearchFiltersAndGrouping(this.currentBienBusquedaFiltros);
});

When(
  'gestiono propietarios de un Bien y verifico el total calculado tras cada operacion',
  async function (this: CustomWorld) {
    this.currentBienPropietarios = createBienPropietariosTestData();
    await this.bienesPage.manageBienOwnersAndValidateActiveTotal(this.currentBienPropietarios);
  }
);

When(
  'intento guardar propietarios activos de un Bien superando el cien por ciento',
  async function (this: CustomWorld) {
    this.currentBienPropietariosExceso = createBienPropietariosExcesoTestData();
    await this.bienesPage.trySaveBienOwnersAboveOneHundredPercent(this.currentBienPropietariosExceso);
  }
);

When('intento guardar propietarios de un Bien con fechas invalidas', async function (this: CustomWorld) {
  this.currentBienPropietariosFechas = createBienPropietariosFechasTestData();
  await this.bienesPage.trySaveBienOwnersWithInvalidDates(this.currentBienPropietariosFechas);
});

When('doy de baja un propietario de un Bien con dos propietarios activos', async function (this: CustomWorld) {
  this.currentBienPropietarioBaja = createBienPropietarioBajaTestData();
  await this.bienesPage.deactivateBienOwnerAndValidateActiveTotal(this.currentBienPropietarioBaja);
});

When('agrupo dos bienes y luego desagrupo el bien hijo', async function (this: CustomWorld) {
  this.currentBienAgrupacion = createBienAgrupacionTestData();
  await this.bienesPage.groupAndUngroupBienChild(this.currentBienAgrupacion);
});

When('abro un Bien sin finca agrupadora', async function (this: CustomWorld) {
  this.currentBienSinAgrupacion = createBienSinAgrupacionTestData();
  await this.bienesPage.openBienWithoutGroupingParent(this.currentBienSinAgrupacion);
});

When('preparo bienes agrupados y valido filtros de agrupacion', async function (this: CustomWorld) {
  this.currentBienAgrupacion = createBienAgrupacionTestData();
  await this.bienesPage.validateGroupingFilters(this.currentBienAgrupacion);
});

When('añado una carga hipotecaria a un Bien y edito su descripcion', async function (this: CustomWorld) {
  this.currentBienCargaHipotecaria = createBienCargaHipotecariaTestData();
  await this.bienesPage.addMortgageChargeAndValidateTotal(this.currentBienCargaHipotecaria);
});

When('doy de baja una carga vigente de un Bien', async function (this: CustomWorld) {
  this.currentBienCargaHistorico = createBienCargaHistoricoTestData();
  await this.bienesPage.deactivateMortgageChargeAndValidateHistory(this.currentBienCargaHistorico);
});

When('valido que los importes de carga no admiten valores negativos', async function (this: CustomWorld) {
  this.currentBienCargaImportesNegativos = createBienCargaImportesNegativosTestData();
  await this.bienesPage.validateMortgageChargeAmountsRejectNegativeValues(
    this.currentBienCargaImportesNegativos
  );
});

When('valido dominios de Titular y Tasadora en una Solicitud de Tasacion', async function (
  this: CustomWorld
) {
  this.currentSolicitudTasacionDominios = createSolicitudTasacionDominiosTestData();
  await this.bienesPage.validateTasacionTitularAndTasadoraDomains(this.currentSolicitudTasacionDominios);
});

When('ejecuto el workflow completo de una Solicitud de Tasacion', async function (this: CustomWorld) {
  this.currentSolicitudTasacionWorkflow = createSolicitudTasacionWorkflowTestData();
  await this.bienesPage.validateAppraisalRequestFullWorkflow(this.currentSolicitudTasacionWorkflow);
});

When('valido el envio de mail de Solicitud de Tasacion con tasadora sin email', async function (
  this: CustomWorld
) {
  this.currentSolicitudTasacionMailValidation = createSolicitudTasacionMailValidationTestData();
  await this.bienesPage.validateAppraisalRequestMailSendingRules(
    this.currentSolicitudTasacionMailValidation
  );
});

When('preparo un Bien con propietario y abro la ficha del Contacto propietario', async function (
  this: CustomWorld
) {
  this.currentBienPropietarios = createBienPropietariosTestData();
  await this.bienesPage.createBienWithOwnerForContactIntegration(this.currentBienPropietarios);
  await this.contactosPage.openContactoByName(this.currentBienPropietarios.propietarioPrincipal.nombre);
});

When('valido acceso CRUD completo de Bienes con usuario interno estandar', async function (this: CustomWorld) {
  this.currentBienSeguridadCrud = createBienSeguridadCrudTestData();
  await this.bienesPage.validateStandardInternalUserFullCrudAccess(this.currentBienSeguridadCrud);
});

When('creo una tasacion manual en un Bien y verifico su secuencia', async function (this: CustomWorld) {
  this.currentBienTasacionManual = createBienTasacionManualTestData();
  await this.bienesPage.createManualAppraisalAndValidateSequence(this.currentBienTasacionManual);
});

When('copio una tasacion existente mediante Tasada en Garantia y modifico el valor', async function (
  this: CustomWorld
) {
  this.currentBienTasacionGarantia = createBienTasacionGarantiaTestData();
  await this.bienesPage.copyAppraisalFromWarrantyAndValidate(this.currentBienTasacionGarantia);
});

When('valido No Tasable No Valorar y No declarable al BDE en una tasacion', async function (
  this: CustomWorld
) {
  this.currentBienTasacionJustificaciones = createBienTasacionJustificacionesTestData();
  await this.bienesPage.validateAppraisalNotAppraisedAndNotValuedFields(
    this.currentBienTasacionJustificaciones
  );
});

Then('deberia completarse el ciclo CRUD de Tipo de Bienes', async function (this: CustomWorld) {
  if (!this.currentTipoBien) {
    throw new Error('No existe un Tipo de Bienes creado en el escenario actual.');
  }

  await this.attach(
    `Tipo de Bienes activo nuevamente: ${this.currentTipoBien.descripcionEditada}`,
    'text/plain'
  );
});

Then('deberia visualizar la validacion de Descripcion obligatoria y el Tipo de Bienes no se guarda', async function (
  this: CustomWorld
) {
  await this.bienesPage.assertDescriptionRequiredValidationAndRecordWasNotSaved();
});

Then('deberia completarse el ciclo de Registro de Propiedad y rechazarse el alta sin Cod Registro', async function (
  this: CustomWorld
) {
  if (!this.currentRegistroPropiedad) {
    throw new Error('No existe un Registro de Propiedad creado en el escenario actual.');
  }

  await this.attach(
    `Registro de Propiedad validado: ${this.currentRegistroPropiedad.descripcionEditada}`,
    'text/plain'
  );
});

Then(
  'deberia completarse la gestion de Tipos de Carga con rechazo de duplicado y archivado correcto',
  async function (this: CustomWorld) {
    if (!this.currentTipoCarga) {
      throw new Error('No existen Tipos de Carga creados en el escenario actual.');
    }

    await this.attach(
      `Tipos de Carga validados: ${this.currentTipoCarga.hipoteca.codigo} rechazado como duplicado y ${this.currentTipoCarga.sgr.codigo} creado con flag SGR.`,
      'text/plain'
    );
  }
);

Then('deberia quedar validada la gestion de Motivos de Solicitud y nombre calculado dinamico', async function (
  this: CustomWorld
) {
  if (!this.currentMotivoSolicitud) {
    throw new Error('No existen Motivos de Solicitud creados en el escenario actual.');
  }

  await this.attach(
    'Validado: el campo secundario cambia por Motivo y se limpia al modificar el Motivo del registro.',
    'text/plain'
  );
});

Then('deberia completarse el ciclo CRUD del Bien y desaparecer de la lista activa', async function (
  this: CustomWorld
) {
  if (!this.currentBienPrincipal) {
    throw new Error('No existe un Bien creado en el escenario actual.');
  }

  await this.attach(
    `Bien archivado correctamente: ${this.currentBienPrincipal.descripcionEditada}`,
    'text/plain'
  );
});

Then('deberia visualizar la validacion de Descripcion obligatoria y el Bien no se guarda', async function (
  this: CustomWorld
) {
  await this.bienesPage.assertBienPrincipalDescriptionRequiredValidationAndRecordWasNotSaved();
});

Then('deberia visualizar la carpeta de documentos del Bien dentro de 04 - Bienes', async function (
  this: CustomWorld
) {
  if (!this.currentBienDocumentos) {
    throw new Error('No existe un Bien con documentos creado en el escenario actual.');
  }

  await this.bienesPage.assertDocumentsFolderIsFilteredByBien(this.currentBienDocumentos);
});

Then('deberia visualizar la carpeta de documentos con el nuevo nombre del Bien', async function (
  this: CustomWorld
) {
  if (!this.currentBienDocumentos) {
    throw new Error('No existe un Bien con documentos renombrado en el escenario actual.');
  }

  await this.bienesPage.assertDocumentsFolderWasRenamedWithBien(this.currentBienDocumentos);
});

Then(
  'deberia quedar validada la busqueda por multiples campos filtros predefinidos y agrupacion por Tipo',
  async function (this: CustomWorld) {
    if (!this.currentBienBusquedaFiltros) {
      throw new Error('No existen Bienes preparados para validar busqueda y filtros.');
    }

    await this.attach(
      `Busqueda y filtros validados para: ${this.currentBienBusquedaFiltros.pisoOcupado.descripcion}`,
      'text/plain'
    );
  }
);

Then(
  'deberia quedar validado el recalculo del total de propietarios activos del Bien',
  async function (this: CustomWorld) {
    if (!this.currentBienPropietarios) {
      throw new Error('No existe un Bien con propietarios en el escenario actual.');
    }

    await this.attach(
      `Total recalculado tras altas y eliminacion de propietarios en ${this.currentBienPropietarios.bien.descripcion}.`,
      'text/plain'
    );
  }
);

Then(
  'deberia visualizar la validacion de porcentaje total de propietarios activos superior al cien por ciento',
  async function (this: CustomWorld) {
    await this.bienesPage.assertActiveOwnerPercentageAboveOneHundredValidation();
  }
);

Then('deberia visualizar las validaciones de fechas de propietarios', async function (this: CustomWorld) {
  if (!this.currentBienPropietariosFechas) {
    throw new Error('No existen datos de fechas invalidas de propietarios en el escenario actual.');
  }

  await this.attach(
    'Validadas fecha de adquisicion futura, baja sin adquisicion y adquisicion posterior a baja.',
    'text/plain'
  );
});

Then('deberia visualizar que el porcentaje activo excluye al propietario dado de baja', async function (
  this: CustomWorld
) {
  if (!this.currentBienPropietarioBaja) {
    throw new Error('No existe un Bien con propietario dado de baja en el escenario actual.');
  }

  await this.attach(
    `Propietario dado de baja excluido del total activo en ${this.currentBienPropietarioBaja.bien.descripcion}.`,
    'text/plain'
  );
});

Then('deberia visualizar que el bien hijo se reactiva y pierde la finca agrupadora', async function (
  this: CustomWorld
) {
  if (!this.currentBienAgrupacion) {
    throw new Error('No existen bienes de agrupacion en el escenario actual.');
  }

  await this.attach(
    `Bien hijo reactivado sin finca agrupadora: ${this.currentBienAgrupacion.hija.descripcion}.`,
    'text/plain'
  );
});

Then('no deberia visualizar accion ni registro de desagrupar en la agrupacion del Bien', async function (
  this: CustomWorld
) {
  await this.bienesPage.assertUngroupIsNotAvailableForBienWithoutParent();
});

Then(
  'deberia quedar validado que los filtros muestran padres e hijos agrupados correctamente',
  async function (this: CustomWorld) {
    if (!this.currentBienAgrupacion) {
      throw new Error('No existen bienes agrupados en el escenario actual.');
    }

    await this.attach(
      `Filtros de agrupacion validados para padre ${this.currentBienAgrupacion.agrupadora.descripcion} e hijo ${this.currentBienAgrupacion.hija.descripcion}.`,
      'text/plain'
    );
  }
);

Then('deberia visualizar el total hipotecario calculado correctamente y la edicion persistida', async function (
  this: CustomWorld
) {
  if (!this.currentBienCargaHipotecaria) {
    throw new Error('No existe una carga hipotecaria en el escenario actual.');
  }

  await this.attach(
    `Carga hipotecaria validada con total ${this.currentBienCargaHipotecaria.totalEsperado}.`,
    'text/plain'
  );
});

Then('deberia visualizar la carga en historico y no en vigentes', async function (this: CustomWorld) {
  if (!this.currentBienCargaHistorico) {
    throw new Error('No existe una carga enviada a historico en el escenario actual.');
  }

  await this.attach(
    `Carga enviada a historico: ${this.currentBienCargaHistorico.descripcion}.`,
    'text/plain'
  );
});

Then('deberia quedar validada la restriccion de importes negativos en cargas', async function (
  this: CustomWorld
) {
  if (!this.currentBienCargaImportesNegativos) {
    throw new Error('No existen datos de carga con importes negativos en el escenario actual.');
  }

  await this.attach(
    `Importes negativos rechazados y carga positiva validada con total ${this.currentBienCargaImportesNegativos.totalEsperado}.`,
    'text/plain'
  );
});

Then('deberia visualizar estado Solicitada y validacion por campos obligatorios pendientes', async function (
  this: CustomWorld
) {
  if (!this.currentSolicitudTasacionDominios) {
    throw new Error('No existen datos de Solicitud de Tasacion en el escenario actual.');
  }

  await this.bienesPage.assertTasacionDefaultStateAndRequiredFieldsValidation(
    this.currentSolicitudTasacionDominios
  );
});

Then('deberia quedar validado el workflow completo de Solicitud de Tasacion', async function (
  this: CustomWorld
) {
  if (!this.currentSolicitudTasacionWorkflow) {
    throw new Error('No existen datos de workflow de Solicitud de Tasacion en el escenario actual.');
  }

  await this.attach(
    `Workflow validado hasta estado ${this.currentSolicitudTasacionWorkflow.estadoConfirmado}.`,
    'text/plain'
  );
});
Then('deberia quedar validada la regla de envio de mail de Solicitud de Tasacion', async function (
  this: CustomWorld
) {
  if (!this.currentSolicitudTasacionMailValidation) {
    throw new Error('No existen datos de validacion de envio de mail de Solicitud de Tasacion.');
  }

  await this.attach(
    `Envio de mail validado para ${this.currentSolicitudTasacionMailValidation.tasadoraSinEmail}.`,
    'text/plain'
  );
});
Then('deberia visualizar el Bien en la pestaña Bienes del Contacto y abrir su formulario', async function (
  this: CustomWorld
) {
  if (!this.currentBienPropietarios) {
    throw new Error('No existe un Bien con propietario en el escenario actual.');
  }

  await this.contactosPage.assertOwnerBienIsVisibleAndOpenIt({
    bienDescripcion: this.currentBienPropietarios.bien.descripcion,
    porcentaje: this.currentBienPropietarios.propietarioPrincipal.porcentaje
  });
});

Then('deberia quedar validado el acceso CRUD completo al modulo Bienes', async function (this: CustomWorld) {
  if (!this.currentBienSeguridadCrud) {
    throw new Error('No existen datos de seguridad CRUD en el escenario actual.');
  }

  await this.attach(
    `Acceso CRUD validado para usuario interno estandar sobre ${this.currentBienSeguridadCrud.bien.descripcionEditada}.`,
    'text/plain'
  );
});

Then('deberia quedar validada la tasacion manual con secuencia y ultima tasacion actualizada', async function (
  this: CustomWorld
) {
  if (!this.currentBienTasacionManual) {
    throw new Error('No existe una tasacion manual creada en el escenario actual.');
  }

  await this.attach(
    `Tasacion manual validada para ${this.currentBienTasacionManual.bien.descripcion} con fecha valor ${this.currentBienTasacionManual.fechaValor}.`,
    'text/plain'
  );
});

Then('deberia quedar validada la tasacion copiada desde Tasada en Garantia', async function (
  this: CustomWorld
) {
  if (!this.currentBienTasacionGarantia) {
    throw new Error('No existe una tasacion copiada desde garantia en el escenario actual.');
  }

  await this.attach(
    `Tasacion copiada validada con valor ${this.currentBienTasacionGarantia.valorModificado}.`,
    'text/plain'
  );
});

Then('deberia quedar validada la persistencia de No Tasable No Valorar y No declarable al BDE', async function (
  this: CustomWorld
) {
  if (!this.currentBienTasacionJustificaciones) {
    throw new Error('No existen datos de justificaciones de tasacion en el escenario actual.');
  }

  await this.attach(
    `Justificaciones validadas: ${this.currentBienTasacionJustificaciones.justificacionNoTasable} / ${this.currentBienTasacionJustificaciones.justificacionNoValorar}.`,
    'text/plain'
  );
});
