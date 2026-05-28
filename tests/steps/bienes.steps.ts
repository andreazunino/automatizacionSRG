import { When, Then } from '@cucumber/cucumber';
import { createTipoBienTestData } from '../fixtures/bienes/tipoBienData';
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
