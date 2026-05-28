import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { TipoBienTestData } from '../fixtures/bienes/tipoBienData';
import { env } from '../support/env';
import { bienesSelectors } from '../utils/selectors/bienesSelectors';
import { BasePage } from './BasePage';

export class BienesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToBienes(): Promise<void> {
    await this.goto(env.actionUrls.bienes);
    await expect(this.page).toHaveTitle(bienesSelectors.pageTitleText);
    await expect(this.page.locator(bienesSelectors.newButton).first()).toBeVisible();
  }

  async createEditArchiveAndReactivateTipoBien(data: TipoBienTestData): Promise<void> {
    await this.createTipoBien(data);
    await this.assertTipoBienIsVisibleInActiveList(data.descripcion);
    await this.openTipoBien(data.descripcion);
    await this.updateTipoBienDescription(data.descripcionEditada);
    await this.archiveCurrentTipoBien();
    await this.assertTipoBienIsNotVisibleInActiveList(data.descripcionEditada);
    await this.openArchivedTipoBien(data.descripcionEditada);
    await this.reactivateCurrentTipoBien();
    await this.assertTipoBienIsVisibleInActiveList(data.descripcionEditada);
  }

  async trySaveTipoBienWithoutDescription(): Promise<void> {
    await this.click(bienesSelectors.newButton);
    await this.fillDescription('');
    await this.clickSaveExpectingValidation();
  }

  async assertDescriptionRequiredValidationAndRecordWasNotSaved(): Promise<void> {
    const descriptionInput = await this.inputBySelectorOrLabel(
      bienesSelectors.descriptionInput,
      bienesSelectors.labels.descripcion
    );

    await expect(descriptionInput).toBeVisible();
    await expect(descriptionInput).toHaveValue('');
    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasDescriptionRequiredValidation(), {
        message: 'Esperaba validacion de Descripcion obligatoria en Tipo de Bienes.'
      })
      .toBeTruthy();
  }

  private async createTipoBien(data: TipoBienTestData): Promise<void> {
    await this.click(bienesSelectors.newButton);
    await this.fillDescription(data.descripcion);
    await this.fillTipoGti(data.tipoGti);
    await this.fillTipoBe(data.tipoBe);
    await this.setLimitarResponsabilidadPrincipal(data.limitarResponsabilidadPrincipal);
    await this.saveCurrentTipoBien();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(data.descripcion), 'i'));
  }

  private async updateTipoBienDescription(description: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.fillDescription(description);
    await this.saveCurrentTipoBien();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(description), 'i'));
  }

  private async fillDescription(value: string): Promise<void> {
    await this.fillInputBySelectorOrLabel(bienesSelectors.descriptionInput, bienesSelectors.labels.descripcion, value);
  }

  private async fillTipoGti(value: string): Promise<void> {
    await this.fillInputBySelectorOrLabel(bienesSelectors.tipoGtiInput, bienesSelectors.labels.tipoGti, value);
  }

  private async fillTipoBe(value: string): Promise<void> {
    await this.fillInputBySelectorOrLabel(bienesSelectors.tipoBeInput, bienesSelectors.labels.tipoBe, value);
  }

  private async setLimitarResponsabilidadPrincipal(checked: boolean): Promise<void> {
    const checkbox = await this.inputBySelectorOrLabel(
      bienesSelectors.limitarResponsabilidadPrincipalInput,
      bienesSelectors.labels.limitarResponsabilidadPrincipal
    );

    await expect(checkbox).toBeVisible();

    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.check({ force: true });
    }
  }

  private async saveCurrentTipoBien(): Promise<void> {
    const saveButton = this.page.locator(bienesSelectors.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeHidden({ timeout: 30000 });
  }

  private async clickSaveExpectingValidation(): Promise<void> {
    const saveButton = this.page.locator(bienesSelectors.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeVisible();
  }

  private async openTipoBien(description: string): Promise<void> {
    await this.navigateToBienes();
    await this.searchInCurrentList(description);
    const row = this.tipoBienRow(description).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async openArchivedTipoBien(description: string): Promise<void> {
    await this.navigateToBienes();
    await this.enableArchivedFilter();
    await this.searchInCurrentList(description);

    const row = this.tipoBienRow(description).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async archiveCurrentTipoBien(): Promise<void> {
    await this.openActionMenu();
    await this.page.locator(bienesSelectors.archiveMenuItem).first().click();

    const confirmButton = this.page.locator(bienesSelectors.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(this.page.locator(bienesSelectors.unarchiveButton).first()).toBeVisible({ timeout: 30000 });
  }

  private async reactivateCurrentTipoBien(): Promise<void> {
    const directButton = this.page.locator(bienesSelectors.unarchiveButton).first();

    if (await directButton.isVisible().catch(() => false)) {
      await directButton.click();
    } else {
      await this.openActionMenu();
      await this.page.locator(bienesSelectors.unarchiveButton).first().click();
    }

    await expect(this.page.locator(bienesSelectors.unarchiveButton).first()).toBeHidden({ timeout: 30000 });
  }

  private async assertTipoBienIsVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToBienes();
    await this.searchInCurrentList(description);
    await expect(this.tipoBienRow(description).first()).toBeVisible();
  }

  private async assertTipoBienIsNotVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToBienes();
    await this.searchInCurrentList(description);
    await expect(this.tipoBienRow(description)).toHaveCount(0);
  }

  private async enableArchivedFilter(): Promise<void> {
    const filterButton = this.page.locator(bienesSelectors.filterButton).first();

    await expect(filterButton).toBeVisible();
    await filterButton.click();

    const archivedFilter = this.page.locator(bienesSelectors.archivedFilterOption).first();

    await expect(archivedFilter).toBeVisible();
    await archivedFilter.click();
  }

  private async searchInCurrentList(value: string): Promise<void> {
    const searchInput = this.page.locator(bienesSelectors.searchInput).first();

    await expect(searchInput).toBeVisible();
    await searchInput.fill(value);

    const searchOption = this.page.getByRole('option').filter({ hasText: value }).first();

    if (await searchOption.isVisible().catch(() => false)) {
      await searchOption.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  private async enterEditModeIfNeeded(): Promise<void> {
    const saveButton = this.page.locator(bienesSelectors.saveButton).first();

    if (await saveButton.isVisible().catch(() => false)) {
      return;
    }

    const editButton = this.page.locator(bienesSelectors.editButton).first();

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  private async openActionMenu(): Promise<void> {
    const actionButton = this.page.locator(bienesSelectors.actionButton).first();

    await expect(actionButton).toBeVisible();
    await actionButton.click();
  }

  private tipoBienRow(description: string): Locator {
    return this.page.locator(bienesSelectors.rows).filter({ hasText: new RegExp(this.escapeRegExp(description), 'i') });
  }

  private async fillInputBySelectorOrLabel(selector: string, label: string, value: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async inputBySelectorOrLabel(selector: string, label: string): Promise<Locator> {
    const bySelector = this.page.locator(selector).first();

    if (await bySelector.isVisible().catch(() => false)) {
      return bySelector;
    }

    const byTextbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byTextbox.isVisible().catch(() => false)) {
      return byTextbox;
    }

    return this.page.locator(this.inputNearLabelXPath(label)).first();
  }

  private inputNearLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::*[self::input or self::textarea or @role="combobox"][1]`;
  }

  private async hasDescriptionRequiredValidation(): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(bienesSelectors.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return invalidFieldsCount > 0 || /descripci[oó]n.*obligator|required|requerid/i.test(text);
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
