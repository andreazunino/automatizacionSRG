import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { type ContactoTestData, testData } from '../fixtures/testData';
import { selectors } from '../utils/selectors';
import { BasePage } from './BasePage';

export class ContactosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToContactos(): Promise<void> {
    await this.click(selectors.contactos.menuLink);
    await this.assertContactosPageIsVisible();
  }

  async assertContactosPageIsVisible(): Promise<void> {
    await expect(this.page.locator(selectors.contactos.pageTitle)).toBeVisible();
  }

  async createContacto(contacto: ContactoTestData = testData.contactos.contactoValido): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.fillContactoForm(contacto);
    await this.click(selectors.contactos.form.saveButton);
  }

  async searchContacto(searchText: string): Promise<void> {
    await this.fill(selectors.contactos.searchInput, searchText);
    await this.click(selectors.contactos.searchButton);
    await expect(this.page.locator(selectors.contactos.resultsTable)).toBeVisible();
  }

  async editContacto(contacto: ContactoTestData = testData.contactos.contactoEditado): Promise<void> {
    await this.searchContacto(contacto.documento);
    await this.click(selectors.contactos.editButton);
    await this.fillContactoForm(contacto);
    await this.click(selectors.contactos.form.saveButton);
  }

  async deleteContacto(documento = testData.contactos.contactoValido.documento): Promise<void> {
    await this.searchContacto(documento);
    await this.click(selectors.contactos.deleteButton);
    await this.click(selectors.contactos.confirmDeleteButton);
  }

  async tryCreateContactoWithoutRequiredFields(): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.click(selectors.contactos.form.saveButton);
  }

  async tryCreateDuplicatedContacto(): Promise<void> {
    await this.createContacto(testData.contactos.contactoDuplicado);
  }

  async assertContactoCreatedMessage(): Promise<void> {
    await this.expectText(selectors.common.successMessage, /creado|guardado/i);
  }

  async assertContactoUpdatedMessage(): Promise<void> {
    await this.expectText(selectors.common.successMessage, /actualizado|modificado/i);
  }

  async assertContactoDeletedMessage(): Promise<void> {
    await this.expectText(selectors.common.successMessage, /eliminado/i);
  }

  async assertDuplicatedContactoMessage(): Promise<void> {
    await this.expectText(selectors.common.errorMessage, /duplicado|existente/i);
  }

  async assertRequiredFieldsMessages(): Promise<void> {
    await expect(this.page.locator(selectors.common.validationMessage).first()).toBeVisible();
  }

  async assertContactoAppears(searchText = testData.contactos.contactoValido.documento): Promise<void> {
    await this.searchContacto(searchText);
    await expect(this.page.locator(selectors.contactos.firstResult)).toContainText(searchText);
  }

  async assertContactoDoesNotAppear(searchText = testData.contactos.contactoValido.documento): Promise<void> {
    await this.searchContacto(searchText);
    await expect(this.page.locator(selectors.contactos.resultsTable)).not.toContainText(searchText);
  }

  async assertUpdatedContactoData(): Promise<void> {
    await this.assertContactoAppears(testData.contactos.contactoEditado.email);
  }

  private async fillContactoForm(contacto: ContactoTestData): Promise<void> {
    await this.fill(selectors.contactos.form.nombreInput, contacto.nombre);
    await this.fill(selectors.contactos.form.apellidoInput, contacto.apellido);
    await this.fill(selectors.contactos.form.emailInput, contacto.email);
    await this.fill(selectors.contactos.form.telefonoInput, contacto.telefono);
    await this.fill(selectors.contactos.form.documentoInput, contacto.documento);
  }
}
