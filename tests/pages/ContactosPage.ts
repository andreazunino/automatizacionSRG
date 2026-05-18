import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import {
  type ContactoTestData,
  type EmpresaCnaeTestData,
  type EmpresaIaeTestData,
  type PersonaFisicaDocumentoTestData,
  type PersonaFisicaTestData,
  type PersonaFisicaValidacionRequeridosTestData,
  type TipoDocumentoPersonaFisica,
  testData
} from '../fixtures/testData';
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
    await expect(this.page).toHaveTitle(selectors.contactos.pageTitleText);
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
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.fillPersonaFisicaIdentity(persona);
    await this.fillPersonaFisicaDetails(persona);
    await this.saveCurrentContact();
  }

  async trySavePersonaFisicaWithoutNombreAndPrimerApellido(
    persona: PersonaFisicaValidacionRequeridosTestData
  ): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.personaFisicaTextbox('nombre').fill(persona.nombre);
    await this.personaFisicaTextbox('primerApellido').fill(persona.primerApellido);
    await this.personaFisicaTextbox('nif').fill(persona.nif);
    await this.openPersonasFisicasTab();
    await this.fillFechaNacimiento(persona.fechaNacimiento);
    await this.page.keyboard.press('Escape');
    await this.click(selectors.contactos.form.saveButton);
  }

  async assertNombreAndPrimerApellidoRequiredValidation(): Promise<void> {
    await expect(this.personaFisicaTextbox('nombre')).toBeVisible();
    await expect(this.personaFisicaTextbox('primerApellido')).toBeVisible();
    await expect(this.personaFisicaTextbox('nombre')).toHaveValue('');
    await expect(this.personaFisicaTextbox('primerApellido')).toHaveValue('');
    await expect(this.page).toHaveURL(/\/new(?:$|[/?#])/);

    await expect
      .poll(async () => this.hasRequiredFieldValidation())
      .toBeTruthy();
  }

  async trySavePersonaFisicaWithInvalidNif(persona: PersonaFisicaDocumentoTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.fillPersonaFisicaRequiredFields(persona, persona.nifInvalido);
    await this.saveExpectingValidationError();
  }

  async assertInvalidNifValidation(): Promise<void> {
    await expect(this.page.getByText(/NIF no tiene un formato correcto|formato correcto|control es erróneo/i)).toBeVisible();
  }

  async savePersonaFisicaWithValidNif(persona: PersonaFisicaDocumentoTestData): Promise<void> {
    await this.closeValidationDialogIfVisible();
    await this.personaFisicaTextbox('nif').fill(persona.nifValido);
    await this.saveCurrentContact();
  }

  async createPersonaFisicaWithValidNie(persona: PersonaFisicaDocumentoTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.selectTipoDocumento('NIE');
    await this.fillPersonaFisicaRequiredFields(
      {
        ...persona,
        nombre: `${persona.nombre} NIE`
      },
      persona.nieValido
    );
    await this.saveCurrentContact();
  }

  async assertPersonaFisicaDocumentoWasSaved(documento: string): Promise<void> {
    await expect(this.personaFisicaTextbox('nif')).toHaveValue(documento);
    await expect(this.page).not.toHaveURL(/\/new(?:$|[/?#])/);
  }

  async createEmpresa(empresa: EmpresaCnaeTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.saveCurrentContact();
  }

  async assignMultipleCnaesAndTryToMarkBothAsPrincipal(empresa: EmpresaCnaeTestData): Promise<void> {
    await this.openCodigosCnaeTab();
    await this.addCnae(empresa.cnaePrincipal, true);
    await this.addCnae(empresa.cnaeSecundario, false);
    await this.markCnaeAsPrincipal(empresa.cnaeSecundario);
    await this.saveCurrentContact();
  }

  async assertMultipleCnaesAndSinglePrincipal(empresa: EmpresaCnaeTestData): Promise<void> {
    await this.openCodigosCnaeTab();

    await expect(await this.cnaeRow(empresa.cnaePrincipal)).toBeVisible();
    await expect(await this.cnaeRow(empresa.cnaeSecundario)).toBeVisible();
    await expect(this.page.locator(selectors.contactos.empresa.cnaeHeaderPrincipal).first()).toBeVisible();
    await expect(this.page.locator(selectors.contactos.empresa.cnaeRows)).toHaveCount(2);
    const cnaePrincipal = await this.assertOnlyOneCnaePrincipal(empresa);
    await this.assertCnaePrincipalHeader(cnaePrincipal);
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(empresa.nombre), 'i'));
  }

  async createEmpresaConActividadEconomica(empresa: EmpresaIaeTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.openInformacionFiscalIaeTab();
    await this.activateActividadEconomica();
  }

  async manageIaeEpigrafesWithFechaBaja(empresa: EmpresaIaeTestData): Promise<void> {
    await this.openInformacionFiscalIaeTab();
    await this.addIaeEpigrafe(empresa.epigrafePrincipal, {
      principal: true,
      fechaInicio: empresa.fechaInicio
    });
    await this.addIaeEpigrafe(empresa.epigrafeSecundario, {
      principal: false,
      fechaBaja: empresa.fechaBaja
    });
    await this.saveCurrentContact();
  }

  async assertIaeEpigrafeActivationState(empresa: EmpresaIaeTestData): Promise<void> {
    await this.openInformacionFiscalIaeTab();

    await expect(await this.iaeRow(empresa.epigrafePrincipal)).toBeVisible();
    await expect(await this.iaeRow(empresa.epigrafeSecundario)).toBeVisible();
    await expect(await this.iaePrincipalInput(empresa.epigrafePrincipal)).toBeChecked();
    await expect(await this.iaePrincipalInput(empresa.epigrafeSecundario)).not.toBeChecked();
    await this.assertIaeRowHasDate(empresa.epigrafeSecundario, empresa.fechaBaja);
    await expect(this.page.locator(selectors.contactos.empresa.iaeRows)).toHaveCount(2);
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(empresa.nombre), 'i'));
  }

  async updateSegundoApellido(persona: PersonaFisicaTestData): Promise<void> {
    await this.personaFisicaTextbox('segundoApellido').fill(persona.segundoApellidoEditado);
    await this.saveCurrentContact();
  }

  async assertPersonaFisicaWasSaved(persona: PersonaFisicaTestData): Promise<void> {
    const fullName = this.fullName(persona);

    await expect(
      this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico })
    ).toBeChecked();
    await expect(this.personaFisicaTextbox('nombre')).toHaveValue(persona.nombre);
    await expect(this.personaFisicaTextbox('primerApellido')).toHaveValue(persona.primerApellido);
    await expect(this.personaFisicaTextbox('segundoApellido')).toHaveValue(persona.segundoApellido);
    await expect(this.personaFisicaTextbox('nif')).toHaveValue(persona.nif);
    await expect(this.page.getByText(fullName, { exact: true }).first()).toBeVisible();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(fullName), 'i'));
    await this.assertPersonaFisicaAge(persona.edadEsperada);
  }

  async assertPersonaFisicaWasUpdated(persona: PersonaFisicaTestData): Promise<void> {
    const fullName = this.fullName(persona, true);

    await expect(this.personaFisicaTextbox('segundoApellido')).toHaveValue(persona.segundoApellidoEditado);
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
    await this.personaFisicaTextbox('nombre').fill(persona.nombre);
    await this.personaFisicaTextbox('primerApellido').fill(persona.primerApellido);
    await this.personaFisicaTextbox('segundoApellido').fill(persona.segundoApellido);
    await this.personaFisicaTextbox('nif').fill(persona.nif);
  }

  private async fillPersonaFisicaDetails(persona: PersonaFisicaTestData): Promise<void> {
    await this.openPersonasFisicasTab();
    await this.fillFechaNacimiento(persona.fechaNacimiento);
    await this.fillAutocompleteTextbox(selectors.contactos.personaFisica.labels.sexo, persona.sexo);
    await this.fillAutocompleteCombobox(selectors.contactos.personaFisica.labels.paisNacimiento, persona.paisNacimiento);
  }

  private async fillPersonaFisicaRequiredFields(
    persona: Pick<PersonaFisicaDocumentoTestData, 'nombre' | 'primerApellido' | 'fechaNacimiento' | 'sexo' | 'paisNacimiento'>,
    documento: string
  ): Promise<void> {
    await this.personaFisicaTextbox('nombre').fill(persona.nombre);
    await this.personaFisicaTextbox('primerApellido').fill(persona.primerApellido);
    await this.openPersonasFisicasTab();
    await this.fillFechaNacimiento(persona.fechaNacimiento);
    await this.page.keyboard.press('Escape');
    await this.fillAutocompleteTextbox(selectors.contactos.personaFisica.labels.sexo, persona.sexo);
    await this.fillAutocompleteCombobox(selectors.contactos.personaFisica.labels.paisNacimiento, persona.paisNacimiento);
    await this.personaFisicaTextbox('nif').fill(documento);
    await expect(this.personaFisicaTextbox('nif')).toHaveValue(documento);
  }

  private async addCnae(cnaeCode: string, principal: boolean): Promise<void> {
    await this.page.locator(selectors.contactos.empresa.cnaeAddLineButton).first().click();
    const row = this.page.locator(selectors.contactos.empresa.cnaeRows).last();
    const cnaeInput = row.locator(selectors.contactos.empresa.cnaeCellInput).first();

    await expect(row).toBeVisible();
    await expect(cnaeInput).toBeVisible();
    await cnaeInput.click();
    await cnaeInput.fill('');
    await cnaeInput.pressSequentially(cnaeCode);
    await this.selectAutocompleteOptionByCode(cnaeCode);
    await expect(cnaeInput).toHaveValue(new RegExp(`^${this.escapeRegExp(cnaeCode)}`));

    if (principal) {
      await this.markCnaeAsPrincipal(cnaeCode);
    }
  }

  private async activateActividadEconomica(): Promise<void> {
    const configuredInput = this.page.locator(selectors.contactos.empresa.actividadEconomicaInput).first();

    if (await configuredInput.count()) {
      await this.checkIfNeeded(configuredInput);
      return;
    }

    const labelInput = this.page
      .locator(
        'xpath=//*[contains(normalize-space(), "Actividad económica")]/following::*[self::input and (@type="checkbox" or @type="radio")][1]'
      )
      .first();

    await expect(labelInput).toBeVisible();
    await this.checkIfNeeded(labelInput);
  }

  private async addIaeEpigrafe(
    epigrafeCode: string,
    options: { principal: boolean; fechaInicio?: string; fechaBaja?: string }
  ): Promise<void> {
    await this.page.locator(selectors.contactos.empresa.iaeAddLineButton).first().click();
    const row = this.page.locator(selectors.contactos.empresa.iaeRows).last();
    const epigrafeInput = row.locator(selectors.contactos.empresa.iaeEpigrafeInput).first();

    await expect(row).toBeVisible();
    await row.locator('td[name="iae_code_id"], td').first().click();
    await expect(epigrafeInput).toBeVisible();
    await epigrafeInput.click();
    await epigrafeInput.fill('');
    await epigrafeInput.pressSequentially(epigrafeCode);
    await this.selectIaeAutocompleteOptionByCode(epigrafeCode);
    await expect(epigrafeInput).toHaveValue(new RegExp(`(^|\\D)${this.escapeRegExp(epigrafeCode)}(\\D|$)`));

    if (options.principal) {
      await this.checkIfNeeded(row.locator(selectors.contactos.empresa.iaePrincipalInput).first());
    }

    if (options.fechaInicio) {
      await this.assertRowDate(row, 'fecha_inicio', options.fechaInicio);
    }

    if (options.fechaBaja) {
      await this.fillRowDate(row, 'fecha_baja', options.fechaBaja);
    }
  }

  private async iaeRow(epigrafeCode: string): Promise<Locator> {
    await expect
      .poll(async () => (await this.iaeValues()).some((value) => value.startsWith(epigrafeCode)), {
        message: `Esperaba encontrar el epígrafe ${epigrafeCode} en la grilla IAE`
      })
      .toBeTruthy();

    const values = await this.iaeValues();
    const rowIndex = values.findIndex((value) => value.startsWith(epigrafeCode));

    return this.page.locator(selectors.contactos.empresa.iaeRows).nth(rowIndex);
  }

  private async iaePrincipalInput(epigrafeCode: string): Promise<Locator> {
    return (await this.iaeRow(epigrafeCode)).locator(selectors.contactos.empresa.iaePrincipalInput).first();
  }

  private async assertIaeRowHasDate(epigrafeCode: string, expectedDate: string): Promise<void> {
    const row = await this.iaeRow(epigrafeCode);
    const bajaInput = row.locator(selectors.contactos.empresa.iaeFechaBajaInput).last();

    await expect(bajaInput).toHaveValue(expectedDate);
  }

  private async iaeValues(): Promise<string[]> {
    const rows = this.page.locator(selectors.contactos.empresa.iaeRows);
    const rowCount = await rows.count();
    const values: string[] = [];

    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      const epigrafeInput = row.locator(selectors.contactos.empresa.iaeEpigrafeInput).first();

      if (await epigrafeInput.count()) {
        values.push((await epigrafeInput.inputValue()).trim());
      } else {
        values.push(((await row.textContent()) ?? '').trim());
      }
    }

    return values;
  }

  private async assertRowDate(row: Locator, fieldName: string, value: string): Promise<void> {
    const cell = row.locator(`td[name="${fieldName}"]`).first();

    await expect(cell).toContainText(value);
  }

  private async fillRowDate(row: Locator, fieldName: string, value: string): Promise<void> {
    const cell = row.locator(`td[name="${fieldName}"]`).first();

    await expect(cell).toBeVisible();
    await cell.click();

    const input = cell.locator('input').first();
    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async checkIfNeeded(input: Locator): Promise<void> {
    await expect(input).toBeVisible();

    if (!(await input.isChecked())) {
      await input.check();
    }
  }

  private async markCnaeAsPrincipal(cnaeCode: string): Promise<void> {
    const row = await this.cnaeRow(cnaeCode);
    const principalInput = row.locator(selectors.contactos.empresa.cnaePrincipalInput).first();

    await expect(row).toBeVisible();
    await expect(principalInput).toBeVisible();

    if (!(await principalInput.isChecked())) {
      await principalInput.check();
    }
  }

  private async cnaeRow(cnaeCode: string): Promise<Locator> {
    await expect
      .poll(async () => (await this.cnaeValues()).some((value) => value.startsWith(cnaeCode)), {
        message: `Esperaba encontrar el CNAE ${cnaeCode} en la grilla`
      })
      .toBeTruthy();

    const values = await this.cnaeValues();
    const rowIndex = values.findIndex((value) => value.startsWith(cnaeCode));

    return this.page.locator(selectors.contactos.empresa.cnaeRows).nth(rowIndex);
  }

  private async cnaePrincipalInput(cnaeCode: string): Promise<Locator> {
    return (await this.cnaeRow(cnaeCode)).locator(selectors.contactos.empresa.cnaePrincipalInput).first();
  }

  private async assertOnlyOneCnaePrincipal(empresa: EmpresaCnaeTestData): Promise<string> {
    const principalInput = await this.cnaePrincipalInput(empresa.cnaePrincipal);
    const secundarioInput = await this.cnaePrincipalInput(empresa.cnaeSecundario);

    await expect(principalInput).toBeVisible();
    await expect(secundarioInput).toBeVisible();

    const principalChecked = await principalInput.isChecked();
    const secundarioChecked = await secundarioInput.isChecked();

    expect(principalChecked || secundarioChecked).toBeTruthy();
    expect(principalChecked && secundarioChecked).toBeFalsy();

    return secundarioChecked ? empresa.cnaeSecundario : empresa.cnaePrincipal;
  }

  private async assertCnaePrincipalHeader(cnaeCode: string): Promise<void> {
    await expect(
      this.page
        .locator(`xpath=//*[normalize-space()="CNAE principal"]/following::*[contains(normalize-space(), "${cnaeCode}")][1]`)
        .first()
    ).toBeVisible();
  }

  private async cnaeValues(): Promise<string[]> {
    const rows = this.page.locator(selectors.contactos.empresa.cnaeRows);
    const rowCount = await rows.count();
    const values: string[] = [];

    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      const cnaeInput = row.locator(selectors.contactos.empresa.cnaeCellInput).first();

      if (await cnaeInput.count()) {
        values.push((await cnaeInput.inputValue()).trim());
      } else {
        values.push(((await row.textContent()) ?? '').trim());
      }
    }

    return values;
  }

  private async fillAutocompleteTextbox(accessibleName: string, value: string): Promise<void> {
    const input = this.page.getByRole('textbox', { name: accessibleName });
    await input.fill(value);
    await this.selectAutocompleteOption(value);
  }

  private async fillFechaNacimiento(value: string): Promise<void> {
    await this.page.locator(selectors.contactos.personaFisica.birthDateInput).first().fill(value);
  }

  private async assertPersonaFisicaAge(expectedAge: string): Promise<void> {
    await this.openPersonasFisicasTab();

    const ageField = this.page.locator(selectors.contactos.personaFisica.ageField).first();

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
    await this.selectAutocompleteOption(value);
  }

  private async selectAutocompleteOptionByCode(code: string): Promise<void> {
    const option = this.page
      .locator(selectors.contactos.empresa.cnaeAutocompleteOption)
      .filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(code)}`) })
      .first();

    await expect(option).toBeVisible();
    await option.click();
  }

  private async selectIaeAutocompleteOptionByCode(code: string): Promise<void> {
    const option = this.page
      .locator(selectors.contactos.empresa.iaeAutocompleteOption)
      .filter({ hasText: new RegExp(`(^|\\D)${this.escapeRegExp(code)}(\\D|$)`) })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeVisible();
    await option.click();
  }

  private async selectAutocompleteOption(value: string): Promise<void> {
    const option = this.page.getByRole('option', { name: value, exact: true }).first();

    if (await option.isVisible()) {
      await option.click();
      return;
    }

    const odooOption = this.page
      .locator(
        `.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item`
      )
      .filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(value)}\\s*$`) })
      .first();

    if (await odooOption.isVisible()) {
      await odooOption.click();
      return;
    }

    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Escape');
  }

  private async selectTipoDocumento(tipoDocumento: TipoDocumentoPersonaFisica): Promise<void> {
    const label = selectors.contactos.personaFisica.labels.tipoDocumento;
    const combobox = this.page.getByRole('combobox', { name: label });
    const textbox = this.page.getByRole('textbox', { name: label });

    if (await combobox.count()) {
      await combobox.fill(tipoDocumento);
      await this.page.keyboard.press('Enter');
      return;
    }

    if (!(await textbox.count())) {
      return;
    }

    await textbox.fill(tipoDocumento);
    await this.page.keyboard.press('Enter');
  }

  private personaFisicaTextbox(label: keyof typeof selectors.contactos.personaFisica.labels) {
    return this.page.getByRole('textbox', { name: selectors.contactos.personaFisica.labels[label] });
  }

  private async hasRequiredFieldValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();

    return (
      invalidFieldsCount > 0 ||
      validationText.some((text) => /nombre|primer apellido|obligator|required|requerid/i.test(text))
    );
  }

  private async openPersonasFisicasTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.personaFisica.labels.tabPersonasFisicas }).click();
  }

  private async openCodigosCnaeTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabCodigosCnae }).click();
  }

  private async openInformacionFiscalIaeTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabInformacionFiscalIae }).click();
  }

  private async saveExpectingValidationError(): Promise<void> {
    await this.click(selectors.contactos.form.saveButton);
    await expect(this.page.getByText(/Error de validación/i)).toBeVisible();
  }

  private async closeValidationDialogIfVisible(): Promise<void> {
    const closeButton = this.page.locator(selectors.contactos.personaFisica.validationDialogCloseButton).first();

    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
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
