import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { type ContactoTestData, type PersonaFisicaTestData, testData } from '../fixtures/testData';
import { env } from '../support/env';
import { selectors } from '../utils/selectors';
import { BasePage } from './BasePage';

export class ContactosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToContactos(): Promise<void> {
    await this.goto(env.contactsUrl);
    await this.assertContactosPageIsVisible();
  }

  async assertContactosPageIsVisible(): Promise<void> {
    await expect(this.page).toHaveTitle(/Contactos/i);
    await expect(this.page.locator(selectors.contactos.newButton)).toBeVisible();
    await expect(this.page.locator(selectors.contactos.resultsTable)).toBeVisible();
  }

  async createContacto(contacto: ContactoTestData = testData.contactos.contactoValido): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.fillContactoForm(contacto);
    await this.click(selectors.contactos.form.saveButton);
  }

  async searchContacto(searchText: string): Promise<void> {
    await this.fill(selectors.contactos.searchInput, searchText);
    await this.page.keyboard.press('Enter');
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

  async createPersonaFisica(persona: PersonaFisicaTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: 'Físico' }).check();
    await this.fillPersonaFisicaIdentity(persona);
    await this.fillPersonaFisicaDetails(persona);
    await this.saveCurrentContact();
  }

  async updateSegundoApellido(persona: PersonaFisicaTestData): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Segundo Apellido' }).fill(persona.segundoApellidoEditado);
    await this.saveCurrentContact();
  }

  async assertPersonaFisicaWasSaved(persona: PersonaFisicaTestData): Promise<void> {
    const fullName = this.fullName(persona);

    await expect(this.page.getByRole('radio', { name: 'Físico' })).toBeChecked();
    await expect(this.page.getByRole('textbox', { name: 'Nombre?' })).toHaveValue(persona.nombre);
    await expect(this.page.getByRole('textbox', { name: 'Primer Apellido?' })).toHaveValue(persona.primerApellido);
    await expect(this.page.getByRole('textbox', { name: 'Segundo Apellido' })).toHaveValue(persona.segundoApellido);
    await expect(this.page.getByRole('textbox', { name: 'NIF?' })).toHaveValue(persona.nif);
    await expect(this.page.getByText(fullName, { exact: true }).first()).toBeVisible();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(fullName), 'i'));
    await this.assertPersonaFisicaAge(persona.edadEsperada);
  }

  async assertPersonaFisicaWasUpdated(persona: PersonaFisicaTestData): Promise<void> {
    const fullName = this.fullName(persona, true);

    await expect(this.page.getByRole('textbox', { name: 'Segundo Apellido' })).toHaveValue(
      persona.segundoApellidoEditado
    );
    await expect(this.page.getByText(fullName, { exact: true }).first()).toBeVisible();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(fullName), 'i'));
  }

  private async fillContactoForm(contacto: ContactoTestData): Promise<void> {
    await this.fill(selectors.contactos.form.nombreInput, contacto.nombre);
    await this.fill(selectors.contactos.form.apellidoInput, contacto.apellido);
    await this.fill(selectors.contactos.form.emailInput, contacto.email);
    await this.fill(selectors.contactos.form.telefonoInput, contacto.telefono);
    await this.fill(selectors.contactos.form.documentoInput, contacto.documento);
  }

  private async fillPersonaFisicaIdentity(persona: PersonaFisicaTestData): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Nombre?' }).fill(persona.nombre);
    await this.page.getByRole('textbox', { name: 'Primer Apellido?' }).fill(persona.primerApellido);
    await this.page.getByRole('textbox', { name: 'Segundo Apellido' }).fill(persona.segundoApellido);
    await this.page.getByRole('textbox', { name: 'NIF?' }).fill(persona.nif);
  }

  private async fillPersonaFisicaDetails(persona: PersonaFisicaTestData): Promise<void> {
    await this.page.getByRole('tab', { name: 'Personas Físicas' }).click();
    await this.page.getByRole('textbox', { name: 'Fecha de nacimiento?' }).fill(persona.fechaNacimiento);
    await this.fillAutocompleteTextbox('Sexo?', persona.sexo);
    await this.fillAutocompleteCombobox('País de nacimiento?', persona.paisNacimiento);
  }

  private async fillAutocompleteTextbox(accessibleName: string, value: string): Promise<void> {
    const input = this.page.getByRole('textbox', { name: accessibleName });
    await input.fill(value);
    await this.page.keyboard.press('Enter');
  }

  private async assertPersonaFisicaAge(expectedAge: string): Promise<void> {
    await this.page.getByRole('tab', { name: 'Personas Físicas' }).click();

    const ageField = this.page
      .locator(
        'xpath=//*[normalize-space()="Edad" or normalize-space()="Edad?"]/following::*[self::input or self::span or self::div][1]'
      )
      .first();

    await expect
      .poll(async () => {
        return ageField.evaluate((element) => {
          if (element instanceof HTMLInputElement) {
            return element.value;
          }

          return element.textContent?.trim() ?? '';
        });
      })
      .toBe(expectedAge);
  }

  private async fillAutocompleteCombobox(accessibleName: string, value: string): Promise<void> {
    const input = this.page.getByRole('combobox', { name: accessibleName });
    await input.fill(value);
    await this.page.keyboard.press('Enter');
  }

  private async saveCurrentContact(): Promise<void> {
    await this.click(selectors.contactos.form.saveButton);
    await expect(this.page).not.toHaveURL(/\/new(?:$|[/?#])/, { timeout: 30000 });
  }

  private fullName(persona: PersonaFisicaTestData, edited = false): string {
    return `${persona.nombre} ${persona.primerApellido} ${
      edited ? persona.segundoApellidoEditado : persona.segundoApellido
    }`;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
