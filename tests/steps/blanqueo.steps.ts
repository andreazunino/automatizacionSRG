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
