import { Then, When } from '@cucumber/cucumber';
import { createExpedienteBlanqueoTestData } from '../fixtures/blanqueo/blanqueoData';
import type { CustomWorld } from '../support/world';

When('accedo al modulo Blanqueo de Capitales', async function (this: CustomWorld) {
  await this.blanqueoPage.navigateToBlanqueo();
});

When('creo un expediente de blanqueo con datos completos', async function (this: CustomWorld) {
  this.currentExpedienteBlanqueo = createExpedienteBlanqueoTestData();
  await this.contactosPage.navigateToContactos();
  await this.contactosPage.createPersonaFisica(this.currentExpedienteBlanqueo.titularPersona);
  await this.blanqueoPage.createExpedienteCompleto(this.currentExpedienteBlanqueo);
});

Then(
  'deberia visualizar el expediente de blanqueo creado con codigo automatico estado Incompleto origen Manual y NIF del titular',
  async function (this: CustomWorld) {
    if (!this.currentExpedienteBlanqueo) {
      throw new Error('No existe un expediente de blanqueo creado en el escenario actual.');
    }

    await this.blanqueoPage.assertExpedienteCreado(this.currentExpedienteBlanqueo);
    await this.attach(
      `Expediente de blanqueo creado: ${this.blanqueoPage.currentExpedienteCode()} - NIF ${this.blanqueoPage.currentNifValue()}`,
      'text/plain'
    );
  }
);

When('identifico un expediente de blanqueo existente', async function (this: CustomWorld) {
  this.currentBlanqueoExpedienteCode = await this.blanqueoPage.firstVisibleExpedienteCode();
});

When('busco el expediente de blanqueo por su identificador', async function (this: CustomWorld) {
  if (!this.currentBlanqueoExpedienteCode) {
    throw new Error('No existe un expediente de blanqueo identificado en el escenario actual.');
  }

  await this.blanqueoPage.searchExpedienteByCode(this.currentBlanqueoExpedienteCode);
});

Then('deberia visualizar el expediente de blanqueo en la lista', async function (this: CustomWorld) {
  if (!this.currentBlanqueoExpedienteCode) {
    throw new Error('No existe un expediente de blanqueo identificado en el escenario actual.');
  }

  await this.blanqueoPage.assertExpedienteAppears(this.currentBlanqueoExpedienteCode);
});

When('limpio la busqueda de expedientes de blanqueo', async function (this: CustomWorld) {
  await this.blanqueoPage.clearSearchAndFilters();
});

When('aplico el filtro de expedientes de blanqueo {string}', async function (
  this: CustomWorld,
  filterName: 'Activos' | 'Archivados'
) {
  await this.blanqueoPage.applyEstadoFilter(filterName);
});

Then('deberia visualizar el listado de expedientes de blanqueo filtrado por {string}', async function (
  this: CustomWorld,
  filterName: 'Activos' | 'Archivados'
) {
  await this.blanqueoPage.assertEstadoFilterApplied(filterName);
});

Then('deberia quedar el listado de expedientes de blanqueo sin filtros', async function (this: CustomWorld) {
  await this.blanqueoPage.clearSearchAndFilters();
  await this.blanqueoPage.assertExpedientesListWithoutFilters();
});

When('intento guardar un expediente de blanqueo sin Titular', async function (this: CustomWorld) {
  await this.blanqueoPage.trySaveExpedienteWithoutTitular();
});

Then('deberia visualizar la validacion de Titular obligatorio en el expediente de blanqueo', async function (
  this: CustomWorld
) {
  await this.blanqueoPage.assertTitularRequiredValidation();
});

When('preparo un expediente con alertas Pendiente y sin positivos visibles', async function (this: CustomWorld) {
  await this.blanqueoPage.prepareExpedienteForSanctionsCheck();
});

When('pulso el boton Comprobar Blanqueo en la cabecera del formulario', async function (this: CustomWorld) {
  await this.blanqueoPage.runComprobarBlanqueo();
});

Then('el stat button Alerta Blanqueo deberia incrementar con el total de coincidencias detectadas', async function (
  this: CustomWorld
) {
  await this.blanqueoPage.assertAlertaBlanqueoCountIncreased();
});

Then('la pestaña Positivos de Blanqueo deberia permanecer vacia mientras las coincidencias esten en estado Pendiente', async function (
  this: CustomWorld
) {
  await this.blanqueoPage.assertPositivosTabIsEmpty();
});
