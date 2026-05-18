import { Then, When } from '@cucumber/cucumber';
import {
  createEmpresaCnaeTestData,
  createEmpresaIaeTestData,
  createPersonaFisicaDocumentoTestData,
  createPersonaFisicaTestData,
  personaFisicaSinNombrePrimerApellido,
  testData
} from '../fixtures/testData';
import type { CustomWorld } from '../support/world';

When('accedo al módulo Contactos', async function (this: CustomWorld) {
  await this.contactosPage.navigateToContactos();
});

Then('debería visualizar la bandeja de Contactos', async function (this: CustomWorld) {
  await this.contactosPage.assertContactosPageIsVisible();
});

When('creo un contacto con datos válidos', async function (this: CustomWorld) {
  await this.contactosPage.createContacto(testData.contactos.contactoValido);
});

Then('debería visualizar el mensaje de contacto creado', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoCreatedMessage();
});

Then('el contacto debería aparecer en la búsqueda', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoAppears(testData.contactos.contactoValido.documento);
});

When('busco un contacto existente', async function (this: CustomWorld) {
  await this.contactosPage.searchContacto(testData.contactos.contactoExistente.documento);
});

Then('debería visualizar el contacto en los resultados', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoAppears(testData.contactos.contactoExistente.documento);
});

When('edito un contacto existente', async function (this: CustomWorld) {
  await this.contactosPage.editContacto(testData.contactos.contactoEditado);
});

Then('debería visualizar el mensaje de contacto actualizado', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoUpdatedMessage();
});

Then('debería visualizar los datos actualizados del contacto', async function (this: CustomWorld) {
  await this.contactosPage.assertUpdatedContactoData();
});

When('elimino un contacto existente', async function (this: CustomWorld) {
  await this.contactosPage.deleteContacto(testData.contactos.contactoValido.documento);
});

Then('debería visualizar el mensaje de contacto eliminado', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoDeletedMessage();
});

Then('el contacto no debería aparecer en la búsqueda', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoDoesNotAppear(testData.contactos.contactoValido.documento);
});

When('intento crear un contacto sin completar campos obligatorios', async function (this: CustomWorld) {
  await this.contactosPage.tryCreateContactoWithoutRequiredFields();
});

Then('debería visualizar los mensajes de campos obligatorios', async function (this: CustomWorld) {
  await this.contactosPage.assertRequiredFieldsMessages();
});

When('intento crear un contacto duplicado', async function (this: CustomWorld) {
  await this.contactosPage.tryCreateDuplicatedContacto();
});

Then('debería visualizar el mensaje de contacto duplicado', async function (this: CustomWorld) {
  await this.contactosPage.assertDuplicatedContactoMessage();
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

When('creo una empresa para gestionar sus CNAEs', async function (this: CustomWorld) {
  this.currentEmpresaCnae = createEmpresaCnaeTestData();
  await this.contactosPage.createEmpresa(this.currentEmpresaCnae);
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
