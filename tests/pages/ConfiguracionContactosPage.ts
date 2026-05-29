import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type {
  MaestroContactosTestData,
  TipologiaContactosTestData,
  UnidadDecisionTestData
} from '../fixtures/contactos/contactosData';
import { env } from '../support/env';
import { contactosSelectors } from '../utils/selectors/contactosSelectors';
import { configuracionContactosSelectors } from '../utils/selectors/configuracionContactosSelectors';
import { BasePage } from './BasePage';

export class ConfiguracionContactosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createFormaJuridica(data: MaestroContactosTestData['formaJuridica']): Promise<void> {
    await this.navigateToFormasJuridicas();
    await this.click(contactosSelectors.newButton);
    await this.fillMasterField(configuracionContactosSelectors.form.nameInput, data.nombre);
    await this.fillMasterField(configuracionContactosSelectors.form.codeInput, data.codigo);
    await this.saveCurrentMaster();
  }

  async tryCreateDuplicatedFormaJuridica(data: MaestroContactosTestData['formaJuridica']): Promise<void> {
    await this.navigateToFormasJuridicas();
    await this.click(contactosSelectors.newButton);
    await this.fillMasterField(configuracionContactosSelectors.form.nameInput, `${data.nombre} Duplicado`);
    await this.fillMasterField(configuracionContactosSelectors.form.codeInput, data.codigo);
    await this.click(configuracionContactosSelectors.form.saveButton);
  }

  async assertDuplicatedFormaJuridicaWasRejected(): Promise<void> {
    await expect(this.page.locator(configuracionContactosSelectors.validationText).first()).toContainText(
      /duplic|existe|unique|[uú]nico|ya existe|c[oó]digo/i
    );
    await this.closeValidationDialogIfVisible();
    await this.discardCurrentMasterIfNeeded();
  }

  async createVinculacion(data: MaestroContactosTestData['vinculacion']): Promise<void> {
    await this.navigateToVinculaciones();
    await this.click(contactosSelectors.newButton);
    await this.fillMasterField(configuracionContactosSelectors.form.nameInput, data.nombre);
    await this.saveCurrentMaster();
    await this.navigateToVinculaciones();
    await this.assertMasterAppears(data.nombre);
  }

  async assertVinculacionAvailable(data: MaestroContactosTestData['vinculacion']): Promise<void> {
    await this.navigateToVinculaciones();
    await this.assertMasterAppears(data.nombre);
  }

  async createUnidadDecision(data: UnidadDecisionTestData): Promise<void> {
    await this.navigateToUnidadesDecision();
    await this.click(contactosSelectors.newButton);
    await this.fillMasterField(configuracionContactosSelectors.form.nameInput, data.nombre);
    await this.fillMasterField(configuracionContactosSelectors.form.codeInput, data.codigo);
    await this.saveCurrentMaster();
  }

  async assignUnidadDecisionToExistingEconomicGroupMember(data: UnidadDecisionTestData): Promise<void> {
    await this.openGrupoEconomico(data.grupoEconomico);

    const memberRow = this.page.locator(configuracionContactosSelectors.grupoEconomico.memberRows).first();
    const decisionUnitCell = memberRow.locator(configuracionContactosSelectors.grupoEconomico.decisionUnitCell).first();

    await expect(memberRow).toBeVisible();
    await expect(decisionUnitCell).toBeVisible();
    await decisionUnitCell.click();

    const decisionUnitInput = memberRow.locator(configuracionContactosSelectors.grupoEconomico.decisionUnitInput).first();
    await expect(decisionUnitInput).toBeVisible();
    await decisionUnitInput.fill(data.nombre);
    await this.selectAutocompleteOption(data.nombre);
    await expect(decisionUnitInput).toHaveValue(data.nombre);
    await this.saveCurrentMaster();
  }

  async assertUnidadDecisionAssignedToEconomicGroupMember(data: UnidadDecisionTestData): Promise<void> {
    await this.openGrupoEconomico(data.grupoEconomico);
    await expect(this.page.locator(configuracionContactosSelectors.grupoEconomico.memberRows).first()).toContainText(
      data.nombre
    );
  }

  async createTipologia(data: TipologiaContactosTestData['tipologiaNueva']): Promise<void> {
    await this.navigateToTipologias();
    await this.click(contactosSelectors.newButton);
    await this.fillMasterField(configuracionContactosSelectors.form.nameInput, data.nombre);
    await this.fillOptionalMasterField(configuracionContactosSelectors.form.descriptionInput, data.descripcion);
    await this.saveCurrentMaster();
  }

  private async navigateToFormasJuridicas(): Promise<void> {
    await this.goto(env.actionUrls.formasJuridicas);
    await expect(this.page.locator(contactosSelectors.newButton)).toBeVisible();
  }

  private async navigateToVinculaciones(): Promise<void> {
    await this.goto(env.actionUrls.vinculaciones);
    await expect(this.page.locator(contactosSelectors.newButton)).toBeVisible();
  }

  private async navigateToUnidadesDecision(): Promise<void> {
    await this.goto(env.actionUrls.unidadesDecision);
    await expect(this.page.locator(contactosSelectors.newButton)).toBeVisible();
  }

  private async navigateToGruposEconomicos(): Promise<void> {
    await this.goto(env.actionUrls.gruposEconomicos);
    await expect(this.page.locator(contactosSelectors.newButton)).toBeVisible();
  }

  private async navigateToTipologias(): Promise<void> {
    await this.goto(env.contactsUrl);
    await this.page
      .locator('a, button')
      .filter({ hasText: configuracionContactosSelectors.menus.configuracion })
      .first()
      .click();
    await this.page
      .locator('a, button, [role="menuitem"]')
      .filter({ hasText: /Tipolog[ií]a|Tipologias|Tipologías/i })
      .first()
      .click();
    await expect(this.page.locator(contactosSelectors.newButton)).toBeVisible();
  }

  private async openGrupoEconomico(groupName: string): Promise<void> {
    await this.navigateToGruposEconomicos();
    await this.applySearch(groupName);
    const groupRow = this.page.locator(configuracionContactosSelectors.rows).filter({ hasText: groupName }).first();

    await expect(groupRow).toBeVisible();
    await groupRow.click();
    await expect(this.page.locator(configuracionContactosSelectors.grupoEconomico.memberRows).first()).toBeVisible();
  }

  private async fillMasterField(selector: string, value: string): Promise<void> {
    const field = this.page.locator(selector).first();

    await expect(field).toBeVisible();
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }

  private async fillOptionalMasterField(selector: string, value: string): Promise<void> {
    const field = this.page.locator(selector).first();

    if (!(await field.count())) {
      return;
    }

    await expect(field).toBeVisible();
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }

  private async saveCurrentMaster(): Promise<void> {
    await this.click(configuracionContactosSelectors.form.saveButton);
    await expect(this.page.locator('.o_form_dirty')).toHaveCount(0, { timeout: 30000 });
  }

  private async assertMasterAppears(searchText: string): Promise<void> {
    await this.applySearch(searchText);
    await expect(this.page.locator(configuracionContactosSelectors.firstResult)).toContainText(searchText);
  }

  private async applySearch(searchText: string): Promise<void> {
    await this.page.locator(configuracionContactosSelectors.searchInput).fill(searchText);
    const searchOption = this.page.getByRole('option').filter({ hasText: searchText }).first();

    if (await searchOption.isVisible()) {
      await searchOption.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  private async selectAutocompleteOption(value: string): Promise<void> {
    const option = this.page
      .locator(configuracionContactosSelectors.grupoEconomico.autocompleteOption)
      .filter({ hasText: value })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeVisible();
    await option.click();
  }

  private async closeValidationDialogIfVisible(): Promise<void> {
    const closeButton = this.page.locator(configuracionContactosSelectors.dialogCloseButton).first();

    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  private async discardCurrentMasterIfNeeded(): Promise<void> {
    const discardButton = this.page.locator(configuracionContactosSelectors.form.discardButton).first();

    if (await discardButton.isVisible()) {
      await discardButton.click();
    }
  }
}


