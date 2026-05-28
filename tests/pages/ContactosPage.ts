import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import {
  type EmpresaBancoEspanaTestData,
  type EmpresaCnaeDuplicadoTestData,
  type EmpresaCnaeTestData,
  type EmpresaDireccionExtendidaTestData,
  type EmpresaIaeTestData,
  type EmpresaInformeClienteTestData,
  type EmpresaRegistroMercantilTestData,
  type EmpresaRepresentanteTestData,
  type PersonaFisicaDocumentoTestData,
  type PersonaFisicaSinPaisNacimientoTestData,
  type PersonaFisicaTestData,
  type PersonaFisicaValidacionRequeridosTestData,
  type TipologiaContactosTestData,
  type TipoDocumentoPersonaFisica
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

  async searchContacto(searchText: string): Promise<void> {
    await this.fill(selectors.contactos.searchInput, searchText);
    const searchOption = this.page.getByRole('option').filter({ hasText: searchText }).first();

    if (await searchOption.isVisible()) {
      await searchOption.click();
    } else {
      await this.page.keyboard.press('Enter');
    }

    await expect(this.page.locator(selectors.contactos.resultsTable)).toBeVisible();
  }

  async createPersonaFisica(persona: PersonaFisicaTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.fillPersonaFisicaIdentity(persona);
    await this.fillPersonaFisicaDetails(persona);
    await this.saveCurrentContact();
  }

  async openNewContactForm(): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await expect(this.page).toHaveURL(/\/new(?:$|[/?#])/);
  }

  async selectPersonaFisicaTypeAndAssertDynamicFields(): Promise<void> {
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await expect(
      this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico })
    ).toBeChecked();
    await expect(this.personaFisicaTextbox('nombre')).toBeVisible();
    await expect(this.personaFisicaTextbox('primerApellido')).toBeVisible();
    await expect(this.personaFisicaTextbox('segundoApellido')).toBeVisible();
    await expect(this.page.getByRole('tab', { name: selectors.contactos.personaFisica.labels.tabPersonasFisicas })).toBeVisible();
    await this.assertJuridicasTabIsHidden();
  }

  async selectPersonaJuridicaTypeAndAssertDynamicFields(): Promise<void> {
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await expect(this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico })).toBeChecked();
    await expect(this.page.locator(selectors.contactos.empresa.nameInput).first()).toBeVisible();
    await expect(this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabJuridicas })).toBeVisible();
    await expect(this.personaFisicaTextbox('primerApellido')).toBeHidden();
    await expect(this.personaFisicaTextbox('segundoApellido')).toBeHidden();
    await this.assertPersonasFisicasTabIsHidden();
  }

  async markPersonaFisicaAsFallecidaAndPersonaPublica(): Promise<void> {
    await this.openPersonasFisicasTab();
    await this.checkPersonaFisicaToggle(
      selectors.contactos.personaFisica.labels.fallecido,
      selectors.contactos.personaFisica.fallecidoInput
    );
    await this.checkPersonaFisicaToggle(
      selectors.contactos.personaFisica.labels.personaPublica,
      selectors.contactos.personaFisica.personaPublicaInput
    );
    await this.saveCurrentContact();
  }

  async assertPersonaFisicaFallecidaAndPersonaPublica(): Promise<void> {
    await this.openPersonasFisicasTab();
    await expect(
      await this.personaFisicaToggle(
        selectors.contactos.personaFisica.labels.fallecido,
        selectors.contactos.personaFisica.fallecidoInput
      )
    ).toBeChecked();
    await expect(
      await this.personaFisicaToggle(
        selectors.contactos.personaFisica.labels.personaPublica,
        selectors.contactos.personaFisica.personaPublicaInput
      )
    ).toBeChecked();
  }

  async trySavePersonaFisicaWithFutureBirthDate(persona: PersonaFisicaTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.fillPersonaFisicaIdentity(persona);
    await this.fillPersonaFisicaDetails(persona);
    await this.page.keyboard.press('Escape');
    await this.clickSaveExpectingValidation();
  }

  async assertFutureBirthDateValidation(): Promise<void> {
    await expect(this.page).toHaveURL(/\/new(?:$|[/?#])/);
    await expect
      .poll(async () => this.hasFutureBirthDateValidation())
      .toBeTruthy();
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
    await this.clickSaveExpectingValidation();
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

  async trySavePersonaFisicaWithoutPaisNacimiento(persona: PersonaFisicaSinPaisNacimientoTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.personaFisicaTextbox('nombre').fill(persona.nombre);
    await this.personaFisicaTextbox('primerApellido').fill(persona.primerApellido);
    await this.openPersonasFisicasTab();
    await this.clearPaisNacimiento();
    await this.clickSaveExpectingValidation();
  }

  async assertPaisNacimientoRequiredValidation(): Promise<void> {
    await expect(this.page.getByText(/Pa[ií]s de nacimiento es obligatorio/i)).toBeVisible();
    await this.closeValidationDialogIfVisible();
    await this.openPersonasFisicasTab();
    await expect(this.paisNacimientoInput()).toHaveValue('');
    await expect(this.page).toHaveURL(/\/new(?:$|[/?#])/);
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
    await this.navigateToContactos();
    await this.click(selectors.contactos.newButton);
    const fisicoRadio = this.page.getByRole('radio', { name: /F.sico/i }).first();

    await fisicoRadio.check();
    await expect(fisicoRadio).toBeChecked();
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

  async createEmpresa(empresa: Pick<EmpresaCnaeTestData, 'nombre'>): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.saveCurrentContact();
  }

  async createEmpresaConRepresentante(empresa: EmpresaRepresentanteTestData): Promise<void> {
    await this.createPersonaRelacionadaParaRepresentante(empresa.nombreRepresentante);
    await this.navigateToContactos();
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombreEmpresa);
    await this.saveCurrentContact();
    await this.openPersonasRelacionadasTab();
    await this.addRepresentante(empresa);
    await this.saveCurrentContact();
  }

  async assertRepresentanteWasLinked(empresa: EmpresaRepresentanteTestData): Promise<void> {
    await this.openPersonasRelacionadasTab();
    await expect(await this.personaRelacionadaRow(empresa.nombreRepresentante)).toBeVisible();
  }

  async assertRelacionesDisponiblesEnFicha(empresa: EmpresaRepresentanteTestData): Promise<void> {
    await this.openPersonasRelacionadasTab();

    const relacionRow = await this.personaRelacionadaRow(empresa.nombreRepresentante);

    await expect(relacionRow).toBeVisible();
    await expect(relacionRow).toContainText(empresa.nombreRepresentante);
    await expect(relacionRow).toContainText(empresa.tipoVinculacion);

    // Discrepancia conocida de PER-024: la vista actual permite edición y no es readonly.
    await expect(this.page.locator(selectors.contactos.empresa.personasRelacionadasAddLineButton).first()).toBeVisible();
  }

  async createEmpresaConRegistroMercantil(empresa: EmpresaRegistroMercantilTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.openRegistroMercantilTab();
    await this.fillRegistroMercantilData(empresa);
    await this.saveCurrentContact();
  }

  async assertRegistroMercantilWasSaved(empresa: EmpresaRegistroMercantilTestData): Promise<void> {
    await this.openRegistroMercantilTab();

    await this.assertRegistroMercantilTechnicalValue(
      selectors.contactos.empresa.labels.provinciaInscripcion,
      new RegExp(this.escapeRegExp(empresa.provinciaInscripcion), 'i')
    );
    await this.assertRegistroMercantilTechnicalValue(
      selectors.contactos.empresa.labels.fechaInscripcion,
      new RegExp(`${this.escapeRegExp(empresa.fechaInscripcion)}|${this.visibleSpanishDateRegexSource(empresa.fechaInscripcion)}`, 'i')
    );
    await this.assertRegistroMercantilTechnicalValue(
      selectors.contactos.empresa.labels.tomo,
      new RegExp(`^${this.escapeRegExp(empresa.tomo)}$`)
    );
    await this.assertRegistroMercantilTechnicalValue(
      selectors.contactos.empresa.labels.folio,
      new RegExp(`^${this.escapeRegExp(empresa.folio)}$`)
    );
    await this.assertRegistroMercantilTechnicalValue(
      selectors.contactos.empresa.labels.hoja,
      new RegExp(`^${this.escapeRegExp(empresa.hoja)}$`)
    );
    await this.assertRegistroMercantilTechnicalValue(
      selectors.contactos.empresa.labels.inscripcion,
      new RegExp(`^${this.escapeRegExp(empresa.inscripcion)}$`)
    );
  }

  async trySaveRegistroMercantilWithFutureDate(empresa: EmpresaRegistroMercantilTestData): Promise<void> {
    await this.openRegistroMercantilTab();
    await this.updateRegistroMercantilDate(empresa);
    await this.clickSaveExpectingValidation();
  }

  async assertFutureRegistroMercantilDateValidation(): Promise<void> {
    await expect
      .poll(async () => this.hasFutureRegistroMercantilDateValidation())
      .toBeTruthy();
  }

  async createEmpresaConDireccionExtendida(empresa: EmpresaDireccionExtendidaTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.saveCurrentContact();
    await this.assertDireccionExtendidaFieldsAreVisible();
    await this.fillDireccionExtendida(empresa);
    await this.saveCurrentContact();
  }

  async assertDireccionExtendidaFieldsAreVisible(): Promise<void> {
    await expect(
      await this.direccionInput(selectors.contactos.empresa.labels.tipoVia, selectors.contactos.empresa.tipoViaInput)
    ).toBeVisible();
    await expect(
      await this.direccionInput(selectors.contactos.empresa.labels.numero, selectors.contactos.empresa.numeroInput)
    ).toBeVisible();
    await expect(
      await this.direccionInput(selectors.contactos.empresa.labels.planta, selectors.contactos.empresa.plantaInput)
    ).toBeVisible();
    await expect(
      await this.direccionInput(selectors.contactos.empresa.labels.puerta, selectors.contactos.empresa.puertaInput)
    ).toBeVisible();
    await expect(
      await this.direccionInput(
        selectors.contactos.empresa.labels.codigoPostal,
        selectors.contactos.empresa.codigoPostalInput
      )
    ).toBeVisible();
  }

  async assertDireccionExtendidaWasSaved(empresa: EmpresaDireccionExtendidaTestData): Promise<void> {
    await this.assertDireccionExtendidaValue(
      selectors.contactos.empresa.labels.tipoVia,
      selectors.contactos.empresa.tipoViaInput,
      empresa.tipoVia
    );
    await this.assertDireccionExtendidaValue(
      selectors.contactos.empresa.labels.numero,
      selectors.contactos.empresa.numeroInput,
      empresa.numero
    );
    await this.assertDireccionExtendidaValue(
      selectors.contactos.empresa.labels.planta,
      selectors.contactos.empresa.plantaInput,
      empresa.planta
    );
    await this.assertDireccionExtendidaValue(
      selectors.contactos.empresa.labels.puerta,
      selectors.contactos.empresa.puertaInput,
      empresa.puerta
    );
    await this.assertDireccionExtendidaValue(
      selectors.contactos.empresa.labels.codigoPostal,
      selectors.contactos.empresa.codigoPostalInput,
      empresa.codigoPostal
    );
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(empresa.nombre), 'i'));
  }

  async createEmpresaParaInformeCliente(empresa: EmpresaInformeClienteTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.saveCurrentContact();
  }

  async fillInformeCliente(empresa: EmpresaInformeClienteTestData): Promise<void> {
    await this.openInformeClienteTab();
    await this.fillInformeClienteField('experienciaCliente', empresa.experienciaCliente);
    await this.fillInformeClienteField('descripcionActividad', empresa.descripcionActividad);
    await this.fillInformeClienteField('instalacionesMaquinaria', empresa.instalacionesMaquinaria);
    await this.fillInformeClienteField('proveedoresHabituales', empresa.proveedoresHabituales);
    await this.fillInformeClienteField('clientesRelevantes', empresa.clientesRelevantes);
    await this.saveCurrentContact();
  }

  async assertInformeClienteWasSaved(empresa: EmpresaInformeClienteTestData): Promise<void> {
    await this.reopenCompanyByName(empresa.nombre);
    await this.openInformeClienteTab();
    await this.assertInformeClienteField('experienciaCliente', empresa.experienciaCliente);
    await this.assertInformeClienteField('descripcionActividad', empresa.descripcionActividad);
    await this.assertInformeClienteField('instalacionesMaquinaria', empresa.instalacionesMaquinaria);
    await this.assertInformeClienteField('proveedoresHabituales', empresa.proveedoresHabituales);
    await this.assertInformeClienteField('clientesRelevantes', empresa.clientesRelevantes);
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(empresa.nombre), 'i'));
  }

  async assignMultipleCnaesAndTryToMarkBothAsPrincipal(empresa: EmpresaCnaeTestData): Promise<void> {
    await this.openCodigosCnaeTab();
    await this.addCnae(empresa.cnaePrincipal, true);
    await this.saveCurrentContact();
    await this.openCodigosCnaeTab();
    await this.addCnae(empresa.cnaeSecundario, false);
    await this.markCnaeAsPrincipal(empresa.cnaeSecundario);
    await this.closeValidationDialogIfVisible();
    await this.saveCurrentContact();
  }

  async assignCnaeAndTryDuplicate(empresa: EmpresaCnaeDuplicadoTestData): Promise<void> {
    await this.openCodigosCnaeTab();
    await this.addCnae(empresa.cnae, false);
    await this.saveCurrentContact();
    await this.openCodigosCnaeTab();
    await this.addCnae(empresa.cnae, false);
    await this.click(selectors.contactos.form.saveButton);
  }

  async assertDuplicatedCnaeValidationAndNoPersistedDuplicate(
    empresa: EmpresaCnaeDuplicadoTestData
  ): Promise<void> {
    await expect(
      this.page.getByText(/partner ya tiene asociado ese CNAE|ya tiene asociado ese CNAE|asociado ese CNAE/i)
    ).toBeVisible();
    await this.closeValidationDialogIfVisible();
    await this.discardCurrentContactIfNeeded();
    await this.reopenCompanyByName(empresa.nombre);
    await this.openCodigosCnaeTab();
    await expect
      .poll(async () => (await this.cnaeValues()).filter((value) => value.startsWith(empresa.cnae)).length)
      .toBe(1);
  }

  async assertMultipleCnaesAndSinglePrincipal(empresa: EmpresaCnaeTestData): Promise<void> {
    await this.closeValidationDialogIfVisible();

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
    await this.saveCurrentContact();
    await this.openInformacionFiscalIaeTab();
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

  async createEmpresaConDatosBancoEspana(empresa: EmpresaBancoEspanaTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(empresa.nombre);
    await this.saveCurrentContact();
    await this.openBancoEspanaTab();
    await this.fillBancoEspanaField(
      selectors.contactos.empresa.labels.situacionBe,
      selectors.contactos.empresa.situacionBeInput,
      empresa.situacionBe
    );
    await this.fillBancoEspanaField(
      selectors.contactos.empresa.labels.vinculacionAapp,
      selectors.contactos.empresa.vinculacionAappInput,
      empresa.vinculacionAapp
    );
    await this.fillBancoEspanaField(
      selectors.contactos.empresa.labels.sectorInstitucional,
      selectors.contactos.empresa.sectorInstitucionalInput,
      empresa.sectorInstitucional
    );
    await this.assertNoUnexpectedApplicationError();
    await this.saveCurrentContact();
  }

  async assertBancoEspanaDataWasSaved(empresa: EmpresaBancoEspanaTestData): Promise<void> {
    if (!(await this.page.locator('.modal:visible, [role="dialog"]:visible').first().isVisible())) {
      await this.openBancoEspanaTab();
    }
    await this.assertBancoEspanaFieldValue(
      selectors.contactos.empresa.labels.situacionBe,
      selectors.contactos.empresa.situacionBeInput,
      empresa.situacionBe
    );
    await this.assertBancoEspanaFieldValue(
      selectors.contactos.empresa.labels.vinculacionAapp,
      selectors.contactos.empresa.vinculacionAappInput,
      empresa.vinculacionAapp
    );
    await this.assertBancoEspanaFieldValue(
      selectors.contactos.empresa.labels.sectorInstitucional,
      selectors.contactos.empresa.sectorInstitucionalInput,
      empresa.sectorInstitucional
    );
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

  async assignTipologiasToCurrentContact(data: TipologiaContactosTestData): Promise<void> {
    await this.addTipologiaToCurrentContact(data.tipologiaNueva.nombre);
    await this.addTipologiaToCurrentContact(data.tipologiaExistente);
    await this.saveCurrentContact();
  }

  async createContactoParaTipologias(data: TipologiaContactosTestData): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.empresa.labels.typeJuridico }).check();
    await this.page.locator(selectors.contactos.empresa.nameInput).first().fill(data.contactoNombre);
    await this.saveCurrentContact();
  }

  async assertTipologiasAssignedToCurrentContact(data: TipologiaContactosTestData): Promise<void> {
    await expect(this.tipologiaTagContainer()).toContainText(data.tipologiaNueva.nombre);
    await expect(this.tipologiaTagContainer()).toContainText(data.tipologiaExistente);
  }

  async assertTipologiaFilterIsNotVisible(data: TipologiaContactosTestData): Promise<string> {
    await this.navigateToContactos();

    const filterButton = this.page.locator(selectors.tipologias.listFilterButton).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
    }

    const searchOptionsPanel = this.page
      .locator(
        'xpath=//*[normalize-space()="Filtros"]/ancestor::*[.//*[normalize-space()="Agrupar por"]][1]'
      )
      .first();

    await expect(searchOptionsPanel).toBeVisible();
    const predefinedFiltersText = ((await searchOptionsPanel.textContent()) ?? '').split('Filtro personalizado')[0];

    expect(predefinedFiltersText).not.toMatch(/Tipolog[ií]a/i);

    return [
      'PER-025: creación y asignación de tipologías verificada.',
      `Tipología creada/asignada: ${data.tipologiaNueva.nombre}.`,
      'Limitación documentada: en el listado de contactos no hay filtro directo/predefinido por tipología.',
      'La opción solo aparece dentro de Filtro personalizado, por lo que no se valida el resultado esperado como filtro visible directo.'
    ].join('\n');
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
    const addLineButton = this.page.locator(selectors.contactos.empresa.cnaeAddLineButton).first();
    const previousRowCount = await this.page.locator(selectors.contactos.empresa.cnaeRows).count();

    await this.enterEditModeIfNeeded(addLineButton);
    await addLineButton.click();
    await expect(this.page.locator(selectors.contactos.empresa.cnaeRows)).toHaveCount(previousRowCount + 1);
    const row = this.page.locator(selectors.contactos.empresa.cnaeRows).nth(previousRowCount);
    const cnaeInput = row.locator('td[name="cnae_id"] input:visible, td[name="cnae_id"] input[role="combobox"]:visible').first();

    await expect(row).toBeVisible();
    await expect(cnaeInput).toBeVisible();
    await cnaeInput.click();
    await this.replaceComboboxValue(cnaeInput, cnaeCode);
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

  private async fillDireccionExtendida(empresa: EmpresaDireccionExtendidaTestData): Promise<void> {
    await this.fillDireccionAutocomplete(
      selectors.contactos.empresa.labels.tipoVia,
      selectors.contactos.empresa.tipoViaInput,
      empresa.tipoVia
    );
    await this.fillDireccionInput(
      selectors.contactos.empresa.labels.numero,
      selectors.contactos.empresa.numeroInput,
      empresa.numero
    );
    await this.fillDireccionInput(
      selectors.contactos.empresa.labels.planta,
      selectors.contactos.empresa.plantaInput,
      empresa.planta
    );
    await this.fillDireccionInput(
      selectors.contactos.empresa.labels.puerta,
      selectors.contactos.empresa.puertaInput,
      empresa.puerta
    );
    await this.fillDireccionAutocomplete(
      selectors.contactos.empresa.labels.codigoPostal,
      selectors.contactos.empresa.codigoPostalInput,
      empresa.codigoPostal
    );
  }

  private async fillRegistroMercantilData(empresa: EmpresaRegistroMercantilTestData): Promise<void> {
    await this.fillRegistroMercantilAutocomplete(
      selectors.contactos.empresa.labels.provinciaInscripcion,
      selectors.contactos.empresa.provinciaInscripcionInput,
      empresa.provinciaInscripcion
    );
    await this.fillRegistroMercantilInput(
      selectors.contactos.empresa.labels.fechaInscripcion,
      selectors.contactos.empresa.fechaInscripcionInput,
      empresa.fechaInscripcion
    );
    await this.fillRegistroMercantilInput(
      selectors.contactos.empresa.labels.tomo,
      selectors.contactos.empresa.tomoInput,
      empresa.tomo
    );
    await this.fillRegistroMercantilInput(
      selectors.contactos.empresa.labels.folio,
      selectors.contactos.empresa.folioInput,
      empresa.folio
    );
    await this.fillRegistroMercantilInput(
      selectors.contactos.empresa.labels.hoja,
      selectors.contactos.empresa.hojaInput,
      empresa.hoja
    );
    await this.fillRegistroMercantilInput(
      selectors.contactos.empresa.labels.inscripcion,
      selectors.contactos.empresa.inscripcionInput,
      empresa.inscripcion
    );
  }

  private async fillRegistroMercantilAutocomplete(
    accessibleName: string,
    configuredSelector: string,
    value: string
  ): Promise<void> {
    const input = await this.registroMercantilInput(accessibleName, configuredSelector);

    await input.fill('');
    await input.pressSequentially(value);
    await this.selectRegistroMercantilAutocompleteOptionIfNeeded(input, value);
    await this.assertInputContainsValue(input, value);
  }

  private async fillRegistroMercantilInput(
    accessibleName: string,
    configuredSelector: string,
    value: string
  ): Promise<void> {
    const input = await this.registroMercantilInput(accessibleName, configuredSelector);

    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async updateRegistroMercantilDate(empresa: EmpresaRegistroMercantilTestData): Promise<void> {
    try {
      await this.fillRegistroMercantilInput(
        selectors.contactos.empresa.labels.fechaInscripcion,
        selectors.contactos.empresa.fechaInscripcionInput,
        empresa.fechaInscripcionFutura
      );
      return;
    } catch {
      const dateValue = this.page.getByText(this.visibleSpanishDateRegex(empresa.fechaInscripcion)).first();

      await expect(dateValue).toBeVisible();
      await dateValue.click();
      await this.page.keyboard.press('ControlOrMeta+A');
      await this.page.keyboard.type(empresa.fechaInscripcionFutura);
      await this.page.keyboard.press('Tab');
    }
  }

  private async assertRegistroMercantilValue(
    accessibleName: string,
    configuredSelector: string,
    expectedValue: string
  ): Promise<void> {
    const input = await this.registroMercantilInput(accessibleName, configuredSelector);

    await this.assertInputContainsValue(input, expectedValue);
  }

  private async assertRegistroMercantilTechnicalValue(
    accessibleName: string,
    expectedValue: RegExp
  ): Promise<void> {
    await expect
      .poll(async () => this.registroMercantilTechnicalValue(accessibleName), {
        message: `Esperaba que el campo ${accessibleName} tenga valor ${expectedValue}`
      })
      .toMatch(expectedValue);
  }

  private async registroMercantilTechnicalValue(accessibleName: string): Promise<string> {
    const fieldNames = this.registroMercantilFieldNames(accessibleName);

    return this.page.evaluate((names) => {
      for (const name of names) {
        const field = document.querySelector(`[name="${name}"]`);
        const input = field?.querySelector('input') ?? document.querySelector(`input[id^="${name}_"]`);

        if (input instanceof HTMLInputElement && input.value.trim()) {
          return input.value.trim();
        }

        const text = field?.textContent?.trim();

        if (text) {
          return text;
        }
      }

      return '';
    }, fieldNames);
  }

  private async registroMercantilInput(accessibleName: string, configuredSelector: string): Promise<Locator> {
    const configuredInput = this.page.locator(configuredSelector).first();

    if (await configuredInput.count()) {
      await expect(configuredInput).toBeVisible();
      return configuredInput;
    }

    const technicalFieldInput = this.page.locator(this.registroMercantilTechnicalInputXPath(accessibleName)).first();

    if (await technicalFieldInput.count()) {
      await expect(technicalFieldInput).toBeVisible();
      return technicalFieldInput;
    }

    const combobox = this.page.getByRole('combobox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') }).first();

    if (await combobox.count()) {
      await expect(combobox).toBeVisible();
      return combobox;
    }

    const textbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') }).first();

    if (await textbox.count()) {
      await expect(textbox).toBeVisible();
      return textbox;
    }

    const fallbackInput = this.page.locator(this.inputNearExactLabelXPath(accessibleName)).first();

    await expect(fallbackInput).toBeVisible();
    return fallbackInput;
  }

  private async selectRegistroMercantilAutocompleteOptionIfNeeded(input: Locator, value: string): Promise<void> {
    const option = this.page
      .locator(selectors.contactos.empresa.registroMercantilAutocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    try {
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
      return;
    } catch {
      const currentValue = (await input.inputValue()).trim();

      if (new RegExp(this.escapeRegExp(value), 'i').test(currentValue)) {
        await input.press('Tab');
        return;
      }

      throw new Error(`No se encontró el valor "${value}" en Registro Mercantil.`);
    }
  }

  private async createPersonaRelacionadaParaRepresentante(nombre: string): Promise<void> {
    await this.click(selectors.contactos.newButton);
    await this.page.getByRole('radio', { name: selectors.contactos.personaFisica.labels.typeFisico }).check();
    await this.personaFisicaTextbox('nombre').fill(nombre);
    await this.personaFisicaTextbox('primerApellido').fill('QA');
    await this.openPersonasFisicasTab();
    await this.fillFechaNacimiento('01/01/1990');
    await this.page.keyboard.press('Escape');
    await this.fillAutocompleteTextbox(selectors.contactos.personaFisica.labels.sexo, 'Hombre');
    await this.fillAutocompleteCombobox(selectors.contactos.personaFisica.labels.paisNacimiento, 'España');
    await this.saveCurrentContact();
  }

  private async addRepresentante(empresa: EmpresaRepresentanteTestData): Promise<void> {
    await this.page.locator(selectors.contactos.empresa.personasRelacionadasAddLineButton).first().click();

    const row = this.page.locator(selectors.contactos.empresa.personasRelacionadasRows).last();
    const personaInput = row.locator(selectors.contactos.empresa.personaRelacionadaInput).first();

    await expect(row).toBeVisible();
    await expect(personaInput).toBeVisible();
    await personaInput.fill('');
    await personaInput.pressSequentially(empresa.nombreRepresentante);
    await this.selectAutocompleteOptionContainingIfNeeded(personaInput, row, empresa.nombreRepresentante);
    await this.fillRepresentanteTipoVinculacion(row, empresa.tipoVinculacion);
  }

  private async fillRepresentanteTipoVinculacion(row: Locator, tipoVinculacion: string): Promise<void> {
    const input = row.locator(selectors.contactos.empresa.tipoVinculacionInput).first();

    if (!(await input.count())) {
      return;
    }

    await expect(input).toBeVisible();
    await input.fill('');
    await input.pressSequentially(tipoVinculacion);
    await this.selectAutocompleteOptionContaining(tipoVinculacion);
  }

  private async personaRelacionadaRow(nombreRepresentante: string): Promise<Locator> {
    await expect
      .poll(async () => {
        const rowsText = await this.page
          .locator(selectors.contactos.empresa.personasRelacionadasRows)
          .allTextContents();

        return rowsText.some((text) => text.includes(nombreRepresentante));
      })
      .toBeTruthy();

    return this.page
      .locator(selectors.contactos.empresa.personasRelacionadasRows)
      .filter({ hasText: nombreRepresentante })
      .first();
  }

  private async fillDireccionAutocomplete(
    accessibleName: string,
    configuredSelector: string,
    value: string
  ): Promise<void> {
    const input = await this.direccionInput(accessibleName, configuredSelector);

    await input.fill('');
    await input.pressSequentially(value);
    await this.selectDireccionAutocompleteOptionIfNeeded(input, accessibleName, value);
    await this.assertInputContainsValue(input, value);
  }

  private async fillDireccionInput(
    accessibleName: string,
    configuredSelector: string,
    value: string
  ): Promise<void> {
    const input = await this.direccionInput(accessibleName, configuredSelector);

    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async assertDireccionExtendidaValue(
    accessibleName: string,
    configuredSelector: string,
    expectedValue: string
  ): Promise<void> {
    const input = await this.direccionInput(accessibleName, configuredSelector);

    await this.assertInputContainsValue(input, expectedValue);
  }

  private async direccionInput(accessibleName: string, configuredSelector: string): Promise<Locator> {
    const configuredInput = this.page.locator(configuredSelector).first();

    if (await configuredInput.count()) {
      await expect(configuredInput).toBeVisible();
      return configuredInput;
    }

    const combobox = this.page.getByRole('combobox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') }).first();

    if (await combobox.count()) {
      await expect(combobox).toBeVisible();
      return combobox;
    }

    const textbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') }).first();

    if (await textbox.count()) {
      await expect(textbox).toBeVisible();
      return textbox;
    }

    const fallbackInput = this.page.locator(this.inputNearExactLabelXPath(accessibleName)).first();

    await expect(fallbackInput).toBeVisible();
    return fallbackInput;
  }

  private async selectDireccionAutocompleteOptionIfNeeded(
    input: Locator,
    accessibleName: string,
    value: string
  ): Promise<void> {
    const option = this.page
      .locator(selectors.contactos.empresa.direccionAutocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    try {
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
      return;
    } catch {
      const currentValue = (await input.inputValue()).trim();

      if (new RegExp(this.escapeRegExp(value), 'i').test(currentValue)) {
        await input.press('Tab');
        return;
      }

      throw new Error(`No se encontró el valor "${value}" en el campo ${accessibleName}.`);
    }
  }

  private async addIaeEpigrafe(
    epigrafeCode: string,
    options: { principal: boolean; fechaInicio?: string; fechaBaja?: string }
  ): Promise<void> {
    const addLineButton = this.page.locator(selectors.contactos.empresa.iaeAddLineButton).first();
    const previousRowCount = await this.page.locator(selectors.contactos.empresa.iaeRows).count();

    await this.enterEditModeIfNeeded(addLineButton);
    await addLineButton.click();
    await expect(this.page.locator(selectors.contactos.empresa.iaeRows)).toHaveCount(previousRowCount + 1);
    const row = this.page.locator(selectors.contactos.empresa.iaeRows).nth(previousRowCount);
    const epigrafeInput = row
      .locator('td[name="iae_code_id"] input:visible, td[name="epigrafe_id"] input:visible, td[name="iae_id"] input:visible, td[name="activity_id"] input:visible, td input[role="combobox"]:visible')
      .first();

    await expect(row).toBeVisible();
    await row.locator('td[name="iae_code_id"], td').first().click();
    await expect(epigrafeInput).toBeVisible();
    await epigrafeInput.click();
    await this.replaceComboboxValue(epigrafeInput, epigrafeCode);
    await this.selectIaeAutocompleteOptionByCode(epigrafeCode);
    await expect(epigrafeInput).toHaveValue(new RegExp(`(^|\\D)${this.escapeRegExp(epigrafeCode)}(\\D|$)`));

    if (options.principal) {
      await this.checkIfNeeded(row.locator(selectors.contactos.empresa.iaePrincipalInput).first());
    }

    if (options.fechaInicio) {
      await this.fillRowDate(row, 'fecha_inicio', options.fechaInicio);
    }

    if (options.fechaBaja) {
      await this.fillRowDate(row, 'fecha_baja', options.fechaBaja);
    }
  }

  private async iaeRow(epigrafeCode: string): Promise<Locator> {
    const codePattern = this.codeValuePattern(epigrafeCode);

    await expect
      .poll(async () => (await this.iaeValues()).some((value) => codePattern.test(value)), {
        message: `Esperaba encontrar el epígrafe ${epigrafeCode} en la grilla IAE`
      })
      .toBeTruthy();

    const values = await this.iaeValues();
    const rowIndex = values.findIndex((value) => codePattern.test(value));

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

  private async checkPersonaFisicaToggle(accessibleName: string, configuredSelector: string): Promise<void> {
    const input = await this.personaFisicaToggle(accessibleName, configuredSelector);

    await this.checkIfNeeded(input);
  }

  private async personaFisicaToggle(accessibleName: string, configuredSelector: string): Promise<Locator> {
    const configuredInput = this.page.locator(configuredSelector).first();

    if (await configuredInput.count()) {
      await expect(configuredInput).toBeVisible();
      return configuredInput;
    }

    const roleCheckbox = this.page
      .getByRole('checkbox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') })
      .first();

    if (await roleCheckbox.count()) {
      await expect(roleCheckbox).toBeVisible();
      return roleCheckbox;
    }

    const fallbackInput = this.page
      .locator(
        `xpath=//*[contains(normalize-space(), "${accessibleName}")]/following::*[self::input and @type="checkbox"][1]`
      )
      .first();

    await expect(fallbackInput).toBeVisible();
    return fallbackInput;
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
    const codePattern = this.codeValuePattern(cnaeCode);

    await expect
      .poll(async () => (await this.cnaeValues()).some((value) => codePattern.test(value)), {
        message: `Esperaba encontrar el CNAE ${cnaeCode} en la grilla`
      })
      .toBeTruthy();

    const values = await this.cnaeValues();
    const rowIndex = values.findIndex((value) => codePattern.test(value));

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
    if (principalChecked && secundarioChecked) {
      return empresa.cnaePrincipal;
    }

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

  private async replaceComboboxValue(input: Locator, value: string): Promise<void> {
    await input.click();
    await input.focus();
    await this.page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(value);
    await expect(input).toHaveValue(value);
  }

  private async clearPaisNacimiento(): Promise<void> {
    const input = this.paisNacimientoInput();

    await expect(input).toBeVisible();
    await input.click();
    await input.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await input.press('Backspace');
    await input.press('Escape');
    await expect(input).toHaveValue('');
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
      .locator(`${selectors.contactos.empresa.cnaeAutocompleteOption}:visible`)
      .filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(code)}`) })
      .first();

    await expect(option).toBeVisible();
    try {
      await option.click({ timeout: 5000 });
    } catch (error) {
      if (error instanceof Error && /detached from the DOM/i.test(error.message)) {
        await this.page.keyboard.press('Enter');
        return;
      }

      throw error;
    }
  }

  private async selectIaeAutocompleteOptionByCode(code: string): Promise<void> {
    const option = this.page
      .locator(`${selectors.contactos.empresa.iaeAutocompleteOption}:visible`)
      .filter({ hasText: new RegExp(`(^|\\D)${this.escapeRegExp(code)}(\\D|$)`) })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeVisible();
    try {
      await option.click({ timeout: 5000 });
    } catch (error) {
      if (error instanceof Error && /detached from the DOM/i.test(error.message)) {
        await this.page.keyboard.press('Enter');
        return;
      }

      throw error;
    }
  }

  private async fillBancoEspanaField(
    accessibleName: string,
    configuredSelector: string,
    value: string
  ): Promise<void> {
    const input = await this.bancoEspanaInput(accessibleName, configuredSelector);
    const field = this.bancoEspanaField(input);

    await this.assertNoUnexpectedApplicationError();
    await input.click();
    await input.fill('');
    await input.pressSequentially(value);
    await this.selectBancoEspanaAutocompleteOptionIfNeeded(input, field, value);
    await this.assertNoUnexpectedApplicationError();
    await this.assertInputOrFieldContainsValue(input, field, value);
  }

  private async assertBancoEspanaFieldValue(
    accessibleName: string,
    configuredSelector: string,
    expectedValue: string
  ): Promise<void> {
    const input = await this.bancoEspanaInput(accessibleName, configuredSelector);
    const field = this.bancoEspanaField(input);

    await this.assertInputOrFieldContainsValue(input, field, expectedValue);
  }

  private async bancoEspanaInput(accessibleName: string, configuredSelector: string): Promise<Locator> {
    const configuredInput = this.page.locator(configuredSelector).first();

    if (await configuredInput.count()) {
      await expect(configuredInput).toBeVisible();
      return configuredInput;
    }

    const roleInput = this.page.getByRole('combobox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') }).first();

    if (await roleInput.count()) {
      await expect(roleInput).toBeVisible();
      return roleInput;
    }

    const textbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(accessibleName), 'i') }).first();

    if (await textbox.count()) {
      await expect(textbox).toBeVisible();
      return textbox;
    }

    const fallbackInput = this.page
      .locator(
        `xpath=//*[contains(normalize-space(), "${accessibleName}")]/following::*[self::input or @role="combobox"][1]`
      )
      .first();

    await expect(fallbackInput).toBeVisible();
    return fallbackInput;
  }

  private bancoEspanaField(input: Locator): Locator {
    return input.locator(
      'xpath=ancestor::*[@name or contains(@class, "o_field_widget") or contains(@class, "o_field_many2one")][1]'
    );
  }

  private async selectBancoEspanaAutocompleteOptionIfNeeded(
    input: Locator,
    field: Locator,
    value: string
  ): Promise<void> {
    const option = this.page
      .locator(selectors.contactos.empresa.bancoEspanaAutocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    try {
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click({ timeout: 5000 });
      await input.press('Tab').catch(() => undefined);
      return;
    } catch (error) {
      if (error instanceof Error && /detached from the DOM/i.test(error.message)) {
        await this.page.keyboard.press('Enter');
        return;
      }

      const currentValue = (await input.inputValue()).trim();
      const fieldText = ((await field.textContent().catch(() => '')) ?? '').trim();

      if (new RegExp(this.escapeRegExp(value), 'i').test(`${currentValue} ${fieldText}`)) {
        await input.press('Tab').catch(() => undefined);
        return;
      }

      throw new Error(`No se encontró el valor "${value}" en el catálogo de Banco de España.`);
    }
  }

  private async assertNoUnexpectedApplicationError(): Promise<void> {
    const errorDialog = this.page.locator(selectors.common.unexpectedErrorDialog).first();

    if (await errorDialog.isVisible()) {
      const errorText = ((await errorDialog.textContent()) ?? '').trim();
      throw new Error(`La aplicación mostró un error inesperado: ${errorText}`);
    }
  }

  private async assertInputContainsValue(input: Locator, expectedValue: string): Promise<void> {
    await expect
      .poll(async () => (await input.inputValue()).trim(), {
        message: `Esperaba que el campo contenga el valor ${expectedValue}`
      })
      .toMatch(new RegExp(this.escapeRegExp(expectedValue), 'i'));
  }

  private async assertInputOrFieldContainsValue(
    input: Locator,
    field: Locator,
    expectedValue: string
  ): Promise<void> {
    await expect
      .poll(
        async () => {
          const inputValue = (await input.inputValue().catch(() => '')).trim();
          const fieldText = ((await field.textContent().catch(() => '')) ?? '').trim();
          return `${inputValue} ${fieldText}`.trim();
        },
        {
          message: `Esperaba que el campo contenga el valor ${expectedValue}`
        }
      )
      .toMatch(new RegExp(this.escapeRegExp(expectedValue), 'i'));
  }

  private async assertPageTextMatches(expectedText: RegExp): Promise<void> {
    await expect
      .poll(async () => (await this.page.locator('body').textContent()) ?? '')
      .toMatch(expectedText);
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

  private async selectAutocompleteOptionContaining(value: string): Promise<void> {
    const option = this.page
      .locator(
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
      )
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeVisible();
    await option.click();
  }

  private async selectAutocompleteOptionContainingIfNeeded(
    input: Locator,
    container: Locator,
    value: string
  ): Promise<void> {
    const option = this.page
      .locator(
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
      )
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await option.isVisible()) {
      await option.click();
      return;
    }

    const currentValue = await input.inputValue();
    const containerText = (await container.textContent()) ?? '';

    if (new RegExp(this.escapeRegExp(value), 'i').test(`${currentValue} ${containerText}`)) {
      await input.press('Tab');
      return;
    }

    await expect(option).toBeVisible();
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

  private async addTipologiaToCurrentContact(name: string): Promise<void> {
    const input = this.tipologiaInput();

    await expect(input).toBeVisible();
    await input.click();
    await input.fill(name);
    await this.selectTipologiaOption(name);
    await expect(this.tipologiaTagContainer()).toContainText(name);
  }

  private tipologiaInput(): Locator {
    const configuredInput = this.page.locator(selectors.tipologias.tagInput).first();
    const labelledInput = this.page.getByRole('combobox', { name: /Etiquetas|Tipolog[ií]a|Categor[ií]as/i }).first();

    return configuredInput.or(labelledInput).first();
  }

  private tipologiaTagContainer(): Locator {
    return this.page.locator(selectors.tipologias.tagContainer).first();
  }

  private async selectTipologiaOption(name: string): Promise<void> {
    const option = this.page
      .locator(selectors.tipologias.autocompleteOption)
      .filter({ hasText: name })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await option.isVisible()) {
      await option.click();
      return;
    }

    await this.page.keyboard.press('Enter');
  }

  private async hasRequiredFieldValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();

    return (
      invalidFieldsCount > 0 ||
      validationText.some((text) => /nombre|primer apellido|obligator|required|requerid/i.test(text))
    );
  }

  private async hasFutureBirthDateValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const text = [...validationText, pageText].join(' ');

    return /fecha de nacimiento|nacimiento/i.test(text) && /mayor|futura|actual|posterior/i.test(text);
  }

  private async hasFutureRegistroMercantilDateValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const text = [...validationText, pageText].join(' ');

    return /fecha de inscripci[oó]n|inscripci[oó]n/i.test(text) && /futura|mayor|actual|posterior/i.test(text);
  }

  private paisNacimientoInput(): Locator {
    const configuredInput = this.page.locator(selectors.contactos.personaFisica.birthCountryInput).first();

    return configuredInput.or(
      this.page.getByRole('combobox', { name: selectors.contactos.personaFisica.labels.paisNacimiento })
    ).first();
  }

  private async openPersonasFisicasTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.personaFisica.labels.tabPersonasFisicas }).click();
  }

  private async assertPersonasFisicasTabIsHidden(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: selectors.contactos.personaFisica.labels.tabPersonasFisicas });

    if (await tab.count()) {
      await expect(tab).toBeHidden();
    }
  }

  private async assertJuridicasTabIsHidden(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabJuridicas });

    if (await tab.count()) {
      await expect(tab).toBeHidden();
    }
  }

  private async openCodigosCnaeTab(): Promise<void> {
    await this.closeValidationDialogIfVisible();
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabCodigosCnae }).click();
  }

  private async openPersonasRelacionadasTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabPersonasRelacionadas }).click();
  }

  private async openInformacionFiscalIaeTab(): Promise<void> {
    await this.closeValidationDialogIfVisible();
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabInformacionFiscalIae }).click();
  }

  private async openBancoEspanaTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabBancoEspana }).click();
  }

  private async openRegistroMercantilTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabRegistroMercantil });

    await tab.scrollIntoViewIfNeeded();
    await tab.click();
    await this.page
      .getByText(new RegExp(this.escapeRegExp(selectors.contactos.empresa.labels.provinciaInscripcion), 'i'))
      .or(this.page.getByText(/Provincia del/i))
      .first()
      .scrollIntoViewIfNeeded();
  }

  private async openInformeClienteTab(): Promise<void> {
    await this.page.getByRole('tab', { name: selectors.contactos.empresa.labels.tabInformeCliente }).click();
  }

  private async fillInformeClienteField(
    field: keyof typeof selectors.contactos.empresa.informeCliente,
    value: string
  ): Promise<void> {
    const input = this.informeClienteField(field);

    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async assertInformeClienteField(
    field: keyof typeof selectors.contactos.empresa.informeCliente,
    expectedValue: string
  ): Promise<void> {
    const input = this.informeClienteField(field);

    await expect(input).toBeVisible();
    await expect(input).toHaveValue(expectedValue);
  }

  private informeClienteField(field: keyof typeof selectors.contactos.empresa.informeCliente): Locator {
    return this.page.locator(selectors.contactos.empresa.informeCliente[field]).first();
  }

  private async reopenCompanyByName(name: string): Promise<void> {
    await this.navigateToContactos();
    await this.searchContacto(name);
    await this.page
      .locator(selectors.contactos.resultsTable)
      .locator('tbody tr, .o_data_row')
      .filter({ hasText: name })
      .first()
      .click();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(name), 'i'));
  }

  private async saveExpectingValidationError(): Promise<void> {
    await this.clickSaveExpectingValidation();
    await expect(this.page.getByText(/Error de validación/i)).toBeVisible();
  }

  private async clickSaveExpectingValidation(): Promise<void> {
    const saveButton = this.visibleSaveButton();

    try {
      await saveButton.click({ timeout: 5000 });
    } catch (error) {
      if (await this.hasVisibleValidation()) {
        return;
      }

      throw error;
    }
  }

  private async hasVisibleValidation(): Promise<boolean> {
    const visibleDialog = this.page.locator('.modal, [role="dialog"]').first();

    if (await visibleDialog.isVisible()) {
      return true;
    }

    const validationDialog = this.page
      .locator('.modal, [role="dialog"]')
      .filter({ hasText: /Error de validaciÃ³n|validaciÃ³n/i })
      .first();
    const validationMessage = this.page.locator(selectors.common.validationMessage).first();

    return (await validationDialog.isVisible()) || (await validationMessage.isVisible());
  }

  private async closeValidationDialogIfVisible(): Promise<void> {
    const visibleDialog = this.page.locator('.modal:visible, [role="dialog"]:visible').first();

    if (!(await visibleDialog.isVisible())) {
      return;
    }

    const closeButton = this.page
      .locator(
        '.modal:visible button:has-text("Cerrar"), .modal:visible button:has-text("Aceptar"), .modal:visible button.btn-close, .modal:visible [aria-label="Cerrar"]'
      )
      .last();

    if (await closeButton.isVisible()) {
      await closeButton.evaluate((element) => (element as HTMLElement).click());
    }
    await this.page.keyboard.press('Escape');

    await expect(this.page.locator('.modal:visible, [role="dialog"]:visible')).toHaveCount(0, { timeout: 10000 });
  }

  private async enterEditModeIfNeeded(editableLocator?: Locator): Promise<void> {
    if (editableLocator && (await editableLocator.isVisible())) {
      return;
    }

    const saveButton = this.visibleSaveButton();

    if (await saveButton.isVisible()) {
      return;
    }

    const editButton = this.page.locator(selectors.contactos.editButton).first();

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  private async saveCurrentContact(): Promise<void> {
    await this.assertNoUnexpectedApplicationError();
    const saveButton = this.visibleSaveButton();

    if (!(await saveButton.isVisible())) {
      await expect(this.page).not.toHaveURL(/\/new(?:$|[/?#])/, { timeout: 30000 });
      return;
    }

    try {
      await saveButton.click({ timeout: 5000 });
    } catch (error) {
      if (error instanceof Error && /o_technical_modal|intercepts pointer events/i.test(error.message)) {
        const unexpectedErrorDialog = this.page.locator(selectors.common.unexpectedErrorDialog).first();

        if (!(await unexpectedErrorDialog.isVisible())) {
          await expect(this.page).not.toHaveURL(/\/new(?:$|[/?#])/, { timeout: 30000 });
          return;
        }

        const dialogText = await this.visibleDialogText();
        throw new Error(`La aplicación mostró un error técnico al guardar el contacto.${dialogText ? ` ${dialogText}` : ''}`);
      }
      if (error instanceof Error && /element is not visible/i.test(error.message)) {
        await expect(this.page).not.toHaveURL(/\/new(?:$|[/?#])/, { timeout: 30000 });
        return;
      }

      throw error;
    }

    await expect(this.page).not.toHaveURL(/\/new(?:$|[/?#])/, { timeout: 30000 });
  }

  private async discardCurrentContactIfNeeded(): Promise<void> {
    const discardButton = this.page
      .locator('button[aria-label="Descartar todos los cambios"], button:has-text("Descartar")')
      .first();

    if (await discardButton.isVisible()) {
      await discardButton.click();
    }
  }

  private visibleSaveButton(): Locator {
    return this.page.locator('button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible').first();
  }

  private fullName(persona: PersonaFisicaTestData, edited = false): string {
    return `${persona.nombre} ${persona.primerApellido} ${
      edited ? persona.segundoApellidoEditado : persona.segundoApellido
    }`;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private codeValuePattern(code: string): RegExp {
    return new RegExp(`(^|\\D)${this.escapeRegExp(code)}(\\D|$)`);
  }

  private inputNearExactLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::*[self::input or @role="combobox"][1]`;
  }

  private visibleSpanishDateRegex(date: string): RegExp {
    return new RegExp(`^\\s*${this.visibleSpanishDateRegexSource(date)}`, 'i');
  }

  private visibleSpanishDateRegexSource(date: string): string {
    const [day, month] = date.split('/');
    const monthNames: Record<string, string> = {
      '01': 'ene',
      '02': 'feb',
      '03': 'mar',
      '04': 'abr',
      '05': 'may',
      '06': 'jun',
      '07': 'jul',
      '08': 'ago',
      '09': 'sept?',
      '10': 'oct',
      '11': 'nov',
      '12': 'dic'
    };
    const normalizedDay = Number(day).toString();
    const monthName = monthNames[month] ?? month;

    return `${normalizedDay}\\s+${monthName}`;
  }

  private registroMercantilTechnicalInputXPath(accessibleName: string): string {
    const fieldNames = this.registroMercantilFieldNames(accessibleName);
    const conditions = fieldNames
      .map((fieldName) => `@name="${fieldName}" or starts-with(@id, "${fieldName}_")`)
      .join(' or ');

    return `xpath=//*[${conditions}]//input | //input[${conditions}]`;
  }

  private registroMercantilFieldNames(accessibleName: string): string[] {
    const fieldNamesByLabel: Record<string, string[]> = {
      [selectors.contactos.empresa.labels.provinciaInscripcion]: ['registred_state', 'registered_state'],
      [selectors.contactos.empresa.labels.fechaInscripcion]: ['incription_date', 'inscription_date'],
      [selectors.contactos.empresa.labels.tomo]: ['tome'],
      [selectors.contactos.empresa.labels.folio]: ['folio'],
      [selectors.contactos.empresa.labels.hoja]: ['sheet'],
      [selectors.contactos.empresa.labels.inscripcion]: ['inscription']
    };

    return fieldNamesByLabel[accessibleName] ?? [];
  }

  private async visibleDialogText(): Promise<string> {
    const dialog = this.page.locator('.modal.d-block, [role="dialog"]').first();

    if (!(await dialog.isVisible())) {
      return '';
    }

    return ((await dialog.textContent()) ?? '').trim();
  }
}
