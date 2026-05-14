import { Given, Then, When } from '@cucumber/cucumber';
import type { CustomWorld } from '../support/world';

Given('que navego a la aplicación', async function (this: CustomWorld) {
  await this.loginPage.navigateToApplication();
});

Given('que inicio sesión en la aplicación', async function (this: CustomWorld) {
  await this.loginPage.loginWithValidCredentials();
  await this.loginPage.assertHomeIsVisible();
});

When('inicio sesión con credenciales válidas', async function (this: CustomWorld) {
  await this.loginPage.login();
});

Then('debería visualizar la pantalla principal', async function (this: CustomWorld) {
  await this.loginPage.assertHomeIsVisible();
});
