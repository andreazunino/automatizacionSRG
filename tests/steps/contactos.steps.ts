import { Then, When } from '@cucumber/cucumber';
import { testData } from '../fixtures/testData';
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
  await this.contactosPage.searchContacto(testData.contactos.contactoValido.documento);
});

Then('debería visualizar el contacto en los resultados', async function (this: CustomWorld) {
  await this.contactosPage.assertContactoAppears(testData.contactos.contactoValido.documento);
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
