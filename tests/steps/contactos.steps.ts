import { Then, When } from '@cucumber/cucumber';
import {
  createEmpresaBancoEspanaTestData,
  createEmpresaCnaeDuplicadoTestData,
  createEmpresaCnaeTestData,
  createEmpresaDireccionExtendidaTestData,
  createEmpresaIaeTestData,
  createEmpresaInformeClienteTestData,
  createMaestroContactosTestData,
  createEmpresaRegistroMercantilTestData,
  createEmpresaRepresentanteTestData,
  createPersonaFisicaConFechaNacimientoFuturaTestData,
  createPersonaFisicaDocumentoTestData,
  createPersonaFisicaTestData,
  createTipologiaContactosTestData,
  createUnidadDecisionTestData,
  personaFisicaSinNombrePrimerApellido,
  personaFisicaSinPaisNacimiento
} from '../fixtures/testData';
import type { CustomWorld } from '../support/world';

When('accedo al módulo Contactos', async function (this: CustomWorld) {
  await this.contactosPage.navigateToContactos();
});

Then('debería visualizar la bandeja de Contactos', async function (this: CustomWorld) {
  await this.contactosPage.assertContactosPageIsVisible();
});

When('creo una persona física con todos los campos de identidad', async function (this: CustomWorld) {
  this.currentPersonaFisica = createPersonaFisicaTestData();
  await this.contactosPage.createPersonaFisica(this.currentPersonaFisica);
});

Then('debería visualizar la persona física guardada con nombre completo calculado', async function (
  this: CustomWorld
) {
  if (!this.currentPersonaFisica) {
    throw new Error('No existe una persona fisica creada en el escenario actual.');
  }

  await this.contactosPage.assertPersonaFisicaWasSaved(this.currentPersonaFisica);
});

When('creo una persona física para validar indicadores simples', async function (this: CustomWorld) {
  this.currentPersonaFisica = createPersonaFisicaTestData();
  await this.contactosPage.createPersonaFisica(this.currentPersonaFisica);
});

When('marco la persona física como fallecida y persona pública', async function (this: CustomWorld) {
  if (!this.currentPersonaFisica) {
    throw new Error('No existe una persona fisica creada en el escenario actual.');
  }

  await this.contactosPage.markPersonaFisicaAsFallecidaAndPersonaPublica();
});

Then('debería visualizar la persona física con los indicadores Fallecido y Persona Pública activos', async function (
  this: CustomWorld
) {
  if (!this.currentPersonaFisica) {
    throw new Error('No existe una persona fisica creada en el escenario actual.');
  }

  await this.contactosPage.assertPersonaFisicaFallecidaAndPersonaPublica();
});

When('intento guardar una persona física con fecha de nacimiento futura', async function (this: CustomWorld) {
  this.currentPersonaFisica = createPersonaFisicaConFechaNacimientoFuturaTestData();
  await this.contactosPage.trySavePersonaFisicaWithFutureBirthDate(this.currentPersonaFisica);
});

Then('debería visualizar la validación de fecha de nacimiento futura', async function (this: CustomWorld) {
  await this.contactosPage.assertFutureBirthDateValidation();
});

When('abro el formulario de nuevo contacto', async function (this: CustomWorld) {
  await this.contactosPage.openNewContactForm();
});

When('selecciono tipo Físico y verifico sus campos dinámicos', async function (this: CustomWorld) {
  await this.contactosPage.selectPersonaFisicaTypeAndAssertDynamicFields();
});

Then('al cambiar a tipo Jurídico debería visualizar la interfaz de empresa', async function (
  this: CustomWorld
) {
  await this.contactosPage.selectPersonaJuridicaTypeAndAssertDynamicFields();
});

When('edito el segundo apellido de la persona física', async function (this: CustomWorld) {
  if (!this.currentPersonaFisica) {
    throw new Error('No existe una persona fisica creada en el escenario actual.');
  }

  await this.contactosPage.updateSegundoApellido(this.currentPersonaFisica);
});

Then('debería visualizar el nombre recalculado de la persona física', async function (this: CustomWorld) {
  if (!this.currentPersonaFisica) {
    throw new Error('No existe una persona fisica creada en el escenario actual.');
  }

  await this.contactosPage.assertPersonaFisicaWasUpdated(this.currentPersonaFisica);
});

When('intento guardar una persona física sin Nombre ni Primer Apellido', async function (this: CustomWorld) {
  await this.contactosPage.trySavePersonaFisicaWithoutNombreAndPrimerApellido(
    personaFisicaSinNombrePrimerApellido
  );
});

Then('debería visualizar la validación de Nombre y Primer Apellido obligatorios', async function (
  this: CustomWorld
) {
  await this.contactosPage.assertNombreAndPrimerApellidoRequiredValidation();
});

When('intento guardar una persona física con NIF inválido', async function (this: CustomWorld) {
  this.currentPersonaFisicaDocumento = createPersonaFisicaDocumentoTestData();
  await this.contactosPage.trySavePersonaFisicaWithInvalidNif(this.currentPersonaFisicaDocumento);
});

Then('debería visualizar la validación de formato de NIF', async function (this: CustomWorld) {
  await this.contactosPage.assertInvalidNifValidation();
});

When('corrijo el NIF con un valor válido y guardo', async function (this: CustomWorld) {
  if (!this.currentPersonaFisicaDocumento) {
    throw new Error('No existe una persona fisica de documento en el escenario actual.');
  }

  await this.contactosPage.savePersonaFisicaWithValidNif(this.currentPersonaFisicaDocumento);
});

Then('debería visualizar la persona física guardada con NIF válido', async function (this: CustomWorld) {
  if (!this.currentPersonaFisicaDocumento) {
    throw new Error('No existe una persona fisica de documento en el escenario actual.');
  }

  await this.contactosPage.assertPersonaFisicaDocumentoWasSaved(this.currentPersonaFisicaDocumento.nifValido);
});

When('creo una persona física con NIE válido', async function (this: CustomWorld) {
  if (!this.currentPersonaFisicaDocumento) {
    this.currentPersonaFisicaDocumento = createPersonaFisicaDocumentoTestData();
  }

  await this.contactosPage.createPersonaFisicaWithValidNie(this.currentPersonaFisicaDocumento);
});

Then('debería visualizar la persona física guardada con NIE válido', async function (this: CustomWorld) {
  if (!this.currentPersonaFisicaDocumento) {
    throw new Error('No existe una persona fisica de documento en el escenario actual.');
  }

  await this.contactosPage.assertPersonaFisicaDocumentoWasSaved(this.currentPersonaFisicaDocumento.nieValido);
});

When('intento guardar una persona física sin país de nacimiento', async function (this: CustomWorld) {
  await this.contactosPage.trySavePersonaFisicaWithoutPaisNacimiento(personaFisicaSinPaisNacimiento);
});

Then('debería visualizar la validación de país de nacimiento obligatorio', async function (
  this: CustomWorld
) {
  await this.contactosPage.assertPaisNacimientoRequiredValidation();
});

When('creo una empresa para completar Informe Cliente', async function (this: CustomWorld) {
  this.currentEmpresaInformeCliente = createEmpresaInformeClienteTestData();
  await this.contactosPage.createEmpresaParaInformeCliente(this.currentEmpresaInformeCliente);
});

When('completo y guardo los campos de Informe Cliente', async function (this: CustomWorld) {
  if (!this.currentEmpresaInformeCliente) {
    throw new Error('No existe una empresa de Informe Cliente en el escenario actual.');
  }

  await this.contactosPage.fillInformeCliente(this.currentEmpresaInformeCliente);
});

Then('debería visualizar los campos de Informe Cliente guardados al reabrir la empresa', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaInformeCliente) {
    throw new Error('No existe una empresa de Informe Cliente en el escenario actual.');
  }

  await this.contactosPage.assertInformeClienteWasSaved(this.currentEmpresaInformeCliente);
});

When('creo una empresa para gestionar sus CNAEs', async function (this: CustomWorld) {
  this.currentEmpresaCnae = createEmpresaCnaeTestData();
  await this.contactosPage.createEmpresa(this.currentEmpresaCnae);
});

When('creo una empresa para validar CNAE duplicado', async function (this: CustomWorld) {
  this.currentEmpresaCnaeDuplicado = createEmpresaCnaeDuplicadoTestData();
  await this.contactosPage.createEmpresa(this.currentEmpresaCnaeDuplicado);
});

When('intento asignar el mismo código CNAE dos veces a la empresa', async function (this: CustomWorld) {
  if (!this.currentEmpresaCnaeDuplicado) {
    throw new Error('No existe una empresa de CNAE duplicado en el escenario actual.');
  }

  await this.contactosPage.assignCnaeAndTryDuplicate(this.currentEmpresaCnaeDuplicado);
});

Then('debería visualizar la validación de CNAE duplicado sin guardar el duplicado', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaCnaeDuplicado) {
    throw new Error('No existe una empresa de CNAE duplicado en el escenario actual.');
  }

  await this.contactosPage.assertDuplicatedCnaeValidationAndNoPersistedDuplicate(
    this.currentEmpresaCnaeDuplicado
  );
});

When('asigno múltiples CNAEs e intento marcar ambos como principal', async function (this: CustomWorld) {
  if (!this.currentEmpresaCnae) {
    throw new Error('No existe una empresa de CNAE en el escenario actual.');
  }

  await this.contactosPage.assignMultipleCnaesAndTryToMarkBothAsPrincipal(this.currentEmpresaCnae);
});

Then('debería visualizar ambos CNAEs y un único CNAE principal actualizado', async function (this: CustomWorld) {
  if (!this.currentEmpresaCnae) {
    throw new Error('No existe una empresa de CNAE en el escenario actual.');
  }

  await this.contactosPage.assertMultipleCnaesAndSinglePrincipal(this.currentEmpresaCnae);
});

When('completo la dirección extendida en una empresa', async function (this: CustomWorld) {
  this.currentEmpresaDireccionExtendida = createEmpresaDireccionExtendidaTestData();
  await this.contactosPage.createEmpresaConDireccionExtendida(this.currentEmpresaDireccionExtendida);
});

Then('debería visualizar la dirección extendida guardada correctamente', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaDireccionExtendida) {
    throw new Error('No existe una empresa con direccion extendida en el escenario actual.');
  }

  await this.contactosPage.assertDireccionExtendidaWasSaved(this.currentEmpresaDireccionExtendida);
});

When('añado un representante a una persona jurídica', async function (this: CustomWorld) {
  this.currentEmpresaRepresentante = createEmpresaRepresentanteTestData();
  await this.contactosPage.createEmpresaConRepresentante(this.currentEmpresaRepresentante);
});

Then('debería visualizar el representante vinculado a la persona jurídica', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaRepresentante) {
    throw new Error('No existe una empresa con representante en el escenario actual.');
  }

  await this.contactosPage.assertRepresentanteWasLinked(this.currentEmpresaRepresentante);
});

When('preparo una persona jurídica con una relación conocida', async function (this: CustomWorld) {
  this.currentEmpresaRepresentante = createEmpresaRepresentanteTestData();
  await this.contactosPage.createEmpresaConRepresentante(this.currentEmpresaRepresentante);
});

Then('debería visualizar las relaciones disponibles en la ficha con las discrepancias actuales', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaRepresentante) {
    throw new Error('No existe una empresa con relaciones en el escenario actual.');
  }

  await this.contactosPage.assertRelacionesDisponiblesEnFicha(this.currentEmpresaRepresentante);
});

When('completo los datos del Registro Mercantil en una empresa', async function (this: CustomWorld) {
  this.currentEmpresaRegistroMercantil = createEmpresaRegistroMercantilTestData();
  await this.contactosPage.createEmpresaConRegistroMercantil(this.currentEmpresaRegistroMercantil);
});

Then('debería visualizar los datos del Registro Mercantil guardados correctamente', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaRegistroMercantil) {
    throw new Error('No existe una empresa con datos de Registro Mercantil en el escenario actual.');
  }

  await this.contactosPage.assertRegistroMercantilWasSaved(this.currentEmpresaRegistroMercantil);
});

When('intento guardar una fecha de inscripción futura en el Registro Mercantil', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaRegistroMercantil) {
    throw new Error('No existe una empresa con datos de Registro Mercantil en el escenario actual.');
  }

  await this.contactosPage.trySaveRegistroMercantilWithFutureDate(this.currentEmpresaRegistroMercantil);
});

Then('debería visualizar la validación de fecha de inscripción futura', async function (this: CustomWorld) {
  await this.contactosPage.assertFutureRegistroMercantilDateValidation();
});

When('creo una empresa con actividad económica activada', async function (this: CustomWorld) {
  this.currentEmpresaIae = createEmpresaIaeTestData();
  await this.contactosPage.createEmpresaConActividadEconomica(this.currentEmpresaIae);
});

When('gestiono epígrafes IAE con fecha de baja', async function (this: CustomWorld) {
  if (!this.currentEmpresaIae) {
    throw new Error('No existe una empresa de IAE en el escenario actual.');
  }

  await this.contactosPage.manageIaeEpigrafesWithFechaBaja(this.currentEmpresaIae);
});

Then('debería visualizar el epígrafe principal activo y el epígrafe secundario inactivo', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaIae) {
    throw new Error('No existe una empresa de IAE en el escenario actual.');
  }

  await this.contactosPage.assertIaeEpigrafeActivationState(this.currentEmpresaIae);
});

When('completo los campos de Banco de España en una empresa', async function (this: CustomWorld) {
  this.currentEmpresaBancoEspana = createEmpresaBancoEspanaTestData();
  await this.contactosPage.createEmpresaConDatosBancoEspana(this.currentEmpresaBancoEspana);
});

Then('debería visualizar los datos de Banco de España guardados correctamente', async function (
  this: CustomWorld
) {
  if (!this.currentEmpresaBancoEspana) {
    throw new Error('No existe una empresa con datos de Banco de España en el escenario actual.');
  }

  await this.contactosPage.assertBancoEspanaDataWasSaved(this.currentEmpresaBancoEspana);
});

When('creo una forma jurídica desde configuración', async function (this: CustomWorld) {
  this.currentMaestroContactos = createMaestroContactosTestData();
  await this.configuracionContactosPage.createFormaJuridica(this.currentMaestroContactos.formaJuridica);
});

When('intento crear otra forma jurídica con el mismo código exacto', async function (this: CustomWorld) {
  if (!this.currentMaestroContactos) {
    throw new Error('No existen datos de maestros de contactos en el escenario actual.');
  }

  await this.configuracionContactosPage.tryCreateDuplicatedFormaJuridica(
    this.currentMaestroContactos.formaJuridica
  );
});

Then('debería visualizar el rechazo por código duplicado exacto', async function (this: CustomWorld) {
  await this.configuracionContactosPage.assertDuplicatedFormaJuridicaWasRejected();
});

When('creo una vinculación desde configuración', async function (this: CustomWorld) {
  if (!this.currentMaestroContactos) {
    throw new Error('No existen datos de maestros de contactos en el escenario actual.');
  }

  await this.configuracionContactosPage.createVinculacion(this.currentMaestroContactos.vinculacion);
});

Then('debería visualizar la vinculación disponible en configuración', async function (this: CustomWorld) {
  if (!this.currentMaestroContactos) {
    throw new Error('No existen datos de maestros de contactos en el escenario actual.');
  }

  await this.configuracionContactosPage.assertVinculacionAvailable(this.currentMaestroContactos.vinculacion);
});

When('creo una unidad de decisión desde configuración', async function (this: CustomWorld) {
  this.currentUnidadDecision = createUnidadDecisionTestData();
  await this.configuracionContactosPage.createUnidadDecision(this.currentUnidadDecision);
});

When(
  'vinculo la unidad de decisión con un miembro de un grupo económico existente',
  async function (this: CustomWorld) {
    if (!this.currentUnidadDecision) {
      throw new Error('No existen datos de unidad de decision en el escenario actual.');
    }

    await this.configuracionContactosPage.assignUnidadDecisionToExistingEconomicGroupMember(
      this.currentUnidadDecision
    );
  }
);

Then(
  'debería visualizar la unidad de decisión asignada al miembro del grupo económico',
  async function (this: CustomWorld) {
    if (!this.currentUnidadDecision) {
      throw new Error('No existen datos de unidad de decision en el escenario actual.');
    }

    await this.configuracionContactosPage.assertUnidadDecisionAssignedToEconomicGroupMember(
      this.currentUnidadDecision
    );
  }
);

When('creo una tipología para asignarla a contactos', async function (this: CustomWorld) {
  this.currentTipologiaContactos = createTipologiaContactosTestData();
  await this.configuracionContactosPage.createTipologia(this.currentTipologiaContactos.tipologiaNueva);
});

When('creo un contacto para asignarle tipologías', async function (this: CustomWorld) {
  if (!this.currentTipologiaContactos) {
    throw new Error('No existen datos de tipologia en el escenario actual.');
  }

  await this.contactosPage.createContactoParaTipologias(this.currentTipologiaContactos);
});

When('asigno la tipología nueva y otra existente al contacto', async function (
  this: CustomWorld
) {
  if (!this.currentTipologiaContactos) {
    throw new Error('No existen datos de tipologia en el escenario actual.');
  }

  await this.contactosPage.assignTipologiasToCurrentContact(this.currentTipologiaContactos);
});

Then('debería visualizar las tipologías asignadas en el contacto', async function (this: CustomWorld) {
  if (!this.currentTipologiaContactos) {
    throw new Error('No existen datos de tipologia en el escenario actual.');
  }

  await this.contactosPage.assertTipologiasAssignedToCurrentContact(this.currentTipologiaContactos);
});

Then('debería documentar que no existe filtro visible por tipología en el listado', async function (
  this: CustomWorld
) {
  if (!this.currentTipologiaContactos) {
    throw new Error('No existen datos de tipologia en el escenario actual.');
  }

  const note = await this.contactosPage.assertTipologiaFilterIsNotVisible(this.currentTipologiaContactos);
  await this.attach(note, 'text/plain');
});


