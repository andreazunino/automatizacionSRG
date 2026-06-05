import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ExpedienteBlanqueoTestData } from '../fixtures/blanqueo/blanqueoData';
import { env } from '../support/env';
import { blanqueoSelectors } from '../utils/selectors/blanqueoSelectors';
import { BasePage } from './BasePage';

export class BlanqueoPage extends BasePage {
  private createdCode?: string;
  private createdNif?: string;

  constructor(page: Page) {
    super(page);
  }

  async navigateToBlanqueo(): Promise<void> {
    await this.goto(env.actionUrls.blanqueo);
    await expect(this.page).toHaveTitle(blanqueoSelectors.pageTitleText);
    await expect(this.page.locator(blanqueoSelectors.newButton).first()).toBeVisible();
  }

  async createExpedienteCompleto(data: ExpedienteBlanqueoTestData): Promise<void> {
    await this.navigateToBlanqueo();
    await this.click(blanqueoSelectors.newButton);
    await this.selectAutocompleteField(blanqueoSelectors.titularInput, blanqueoSelectors.labels.titular, data.titular);
    await this.fillDateIfNeeded(
      blanqueoSelectors.fechaAperturaInput,
      blanqueoSelectors.labels.fechaApertura,
      data.fechaApertura
    );
    await this.selectAutocompleteField(blanqueoSelectors.cnaeInput, blanqueoSelectors.labels.cnae, data.cnae);
    await this.selectCurrentUserIfEmpty(data.responsable);
    await this.fillInputBySelectorOrLabel(
      blanqueoSelectors.observacionesInput,
      blanqueoSelectors.labels.observaciones,
      data.observaciones
    );
    await this.saveCurrentForm('Esperaba que el expediente de blanqueo quedara guardado sin cambios pendientes.');

    this.createdCode = await this.currentCode();
    this.createdNif = await this.currentNif();
  }

  async assertExpedienteCreado(data: ExpedienteBlanqueoTestData): Promise<void> {
    const code = this.createdCode ?? (await this.currentCode());
    const nif = this.createdNif ?? (await this.currentNif());

    expect(code, 'Esperaba codigo automatico de expediente.').toMatch(/EXPBLA\d{4,8}-\d+/i);
    expect(nif, 'Esperaba NIF autocompletado desde el titular.').toContain(data.titularNif);

    await this.assertFieldContains(
      blanqueoSelectors.origenInput,
      blanqueoSelectors.origenValue,
      blanqueoSelectors.labels.origen,
      data.origenEsperado
    );
    await this.assertFieldContains(
      blanqueoSelectors.estadoInput,
      blanqueoSelectors.estadoValue,
      blanqueoSelectors.labels.estado,
      data.estadoInicial
    );
    await expect(this.page.locator(blanqueoSelectors.chatter).first()).toBeVisible();
  }

  currentExpedienteCode(): string | undefined {
    return this.createdCode;
  }

  currentNifValue(): string | undefined {
    return this.createdNif;
  }

  private async selectCurrentUserIfEmpty(fallbackValue: string): Promise<void> {
    const input = await this.optionalInputBySelectorOrLabel(
      blanqueoSelectors.responsableInput,
      blanqueoSelectors.labels.responsable
    );

    if (!input) {
      return;
    }

    const currentValue = (await input.inputValue().catch(() => '')).trim();

    if (currentValue !== '') {
      return;
    }

    const userCandidate = fallbackValue.trim() || env.qaUser || env.credentials.internal.username;

    if (userCandidate.trim() !== '') {
      await this.selectAutocompleteField(
        blanqueoSelectors.responsableInput,
        blanqueoSelectors.labels.responsable,
        userCandidate
      );
      return;
    }

    await this.selectFirstAutocompleteOption(
      blanqueoSelectors.responsableInput,
      blanqueoSelectors.labels.responsable,
      'a'
    );
  }

  private async currentCode(): Promise<string> {
    const value = await this.textOrInputValue(blanqueoSelectors.codeValue, blanqueoSelectors.labels.codigoExpediente);
    return value.replace(/\s+/g, ' ').trim();
  }

  private async currentNif(): Promise<string> {
    return this.textOrInputValueFromSelector(blanqueoSelectors.nifInput)
      .then((value) => value || this.textOrInputValueFromSelector(blanqueoSelectors.nifValue))
      .then((value) => value.replace(/\s+/g, ' ').trim());
  }

  private async fillDateIfNeeded(selector: string, label: string, value: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();

    const currentValue = (await input.inputValue().catch(() => '')).trim();

    if (this.normalizeDate(currentValue) === this.normalizeDate(value)) {
      return;
    }

    await input.click();
    await input.fill(value);
    await this.expectEditableValue(input, value);
    await this.closeActiveField();
  }

  private async fillInputBySelectorOrLabel(
    selector: string,
    label: string,
    value: string,
    closeField = false
  ): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();
    await input.fill(value);
    await this.expectEditableValue(input, value);

    if (closeField) {
      await this.closeActiveField();
    }
  }

  private async selectAutocompleteField(selector: string, label: string, value: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();
    await input.fill(value);

    const option = this.autocompleteOptions()
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await this.isVisibleWithin(option, 5000)) {
      await option.click();
      return;
    }

    await input.press('Enter');
    await input.press('Tab');
  }

  private async selectFirstAutocompleteOption(selector: string, label: string, searchText: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();
    await input.fill(searchText);

    const option = this.autocompleteOptions()
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await this.isVisibleWithin(option, 5000)) {
      await option.click();
      return;
    }

    await input.press('Escape');
    await input.press('Tab');
  }

  private async assertFieldContains(
    inputSelector: string,
    valueSelector: string,
    label: string,
    expectedValue: string
  ): Promise<void> {
    const value =
      (await this.textOrInputValueFromSelector(inputSelector)) ||
      (await this.textOrInputValueFromSelector(valueSelector)) ||
      (await this.textOrInputValue(valueSelector, label));

    expect(value).toMatch(new RegExp(this.escapeRegExp(expectedValue), 'i'));
  }

  private async textOrInputValue(selector: string, label: string): Promise<string> {
    const field = await this.optionalInputBySelectorOrLabel(selector, label);

    if (!field) {
      return '';
    }

    const inputValue = await field.inputValue().catch(() => '');

    if (inputValue.trim() !== '') {
      return inputValue.trim();
    }

    return ((await field.textContent().catch(() => '')) ?? '').trim();
  }

  private async textOrInputValueFromSelector(selector: string): Promise<string> {
    const field = this.page.locator(selector).first();

    if (!(await field.isVisible().catch(() => false))) {
      return '';
    }

    const inputValue = await field.inputValue().catch(() => '');

    if (inputValue.trim() !== '') {
      return inputValue.trim();
    }

    return ((await field.textContent().catch(() => '')) ?? '').trim();
  }

  private async inputBySelectorOrLabel(selector: string, label: string): Promise<Locator> {
    const bySelector = this.page.locator(selector).first();

    if (await bySelector.isVisible().catch(() => false)) {
      return bySelector;
    }

    const byCombobox = this.page.getByRole('combobox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byCombobox.isVisible().catch(() => false)) {
      return byCombobox;
    }

    const byTextbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byTextbox.isVisible().catch(() => false)) {
      return byTextbox;
    }

    const byPlaceholder = this.page.getByPlaceholder(new RegExp(this.escapeRegExp(label), 'i')).first();

    if (await byPlaceholder.isVisible().catch(() => false)) {
      return byPlaceholder;
    }

    return this.page.locator(this.inputNearLabelXPath(label)).first();
  }

  private async optionalInputBySelectorOrLabel(selector: string, label: string): Promise<Locator | undefined> {
    const bySelector = this.page.locator(selector).first();

    if (await bySelector.isVisible().catch(() => false)) {
      return bySelector;
    }

    const byCombobox = this.page.getByRole('combobox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byCombobox.isVisible().catch(() => false)) {
      return byCombobox;
    }

    const byTextbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byTextbox.isVisible().catch(() => false)) {
      return byTextbox;
    }

    const byPlaceholder = this.page.getByPlaceholder(new RegExp(this.escapeRegExp(label), 'i')).first();

    if (await byPlaceholder.isVisible().catch(() => false)) {
      return byPlaceholder;
    }

    const byLabel = this.page.locator(this.inputNearLabelXPath(label)).first();

    if (await byLabel.isVisible().catch(() => false)) {
      return byLabel;
    }

    return undefined;
  }

  private async saveCurrentForm(message = 'Esperaba que el formulario quedara guardado sin cambios pendientes.'): Promise<void> {
    const saveButton = this.page.locator(blanqueoSelectors.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect
      .poll(
        async () => {
          if (!(await saveButton.isVisible().catch(() => false))) {
            return true;
          }

          return saveButton.isDisabled().catch(() => false);
        },
        { message }
      )
      .toBeTruthy();
  }

  private autocompleteOptions(): Locator {
    return this.page.locator(blanqueoSelectors.autocompleteOption);
  }

  private async isVisibleWithin(locator: Locator, timeout: number): Promise<boolean> {
    return locator.waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);
  }

  private async expectEditableValue(locator: Locator, expectedValue: string): Promise<void> {
    const supportsInputValue = await locator.evaluate((element) => {
      return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
    });

    if (supportsInputValue) {
      await expect(locator).toHaveValue(expectedValue);
      return;
    }

    await expect(locator).toContainText(expectedValue);
  }

  private async closeActiveField(): Promise<void> {
    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Escape');
    await this.page.keyboard.press('Tab');
  }

  private inputNearLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::*[(self::input and not(@type="checkbox") and not(@type="radio") and not(@type="hidden") and not(contains(@class, "d-none"))) or self::textarea or @role="combobox"][1]`;
  }

  private normalizeDate(value: string): string {
    return value.replace(/\D/g, '');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
