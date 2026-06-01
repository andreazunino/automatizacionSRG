import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type {
  BienAgrupacionTestData,
  BienCargaHistoricoTestData,
  BienCargaHipotecariaTestData,
  BienCargaImportesNegativosTestData,
  BienDocumentosTestData,
  BienSinAgrupacionTestData,
  BienBusquedaFiltrosTestData,
  BienPrincipalTestData,
  BienPropietarioBajaTestData,
  BienPropietarioTestData,
  BienPropietariosExcesoTestData,
  BienPropietariosFechasTestData,
  BienPropietariosTestData,
  BienSeguridadCrudTestData,
  BienTasacionGarantiaTestData,
  BienTasacionJustificacionesTestData,
  BienTasacionManualTestData,
  MotivoSolicitudItemTestData,
  MotivoSolicitudTestData,
  RegistroPropiedadTestData,
  SolicitudTasacionDominiosTestData,
  SolicitudTasacionMailValidationTestData,
  SolicitudTasacionWorkflowTestData,
  TipoBienTestData,
  TipoCargaItemTestData,
  TipoCargaTestData
} from '../fixtures/bienes/tipoBienData';
import { env } from '../support/env';
import { bienesSelectors } from '../utils/selectors/bienesSelectors';
import { BasePage } from './BasePage';

type AppraisalMany2One = [number, string] | false;

interface AppraisalRecord {
  id: number;
  name: string;
  appraisal_origin: string | false;
  appraised_as_warranty: AppraisalMany2One;
  date_value: string | false;
  date_expired: string | false;
  value: number;
  eco_check: boolean;
  not_appraised: boolean;
  not_appraised_text: string | false;
  not_valued: boolean;
  not_valued_text: string | false;
  not_declare_to_be: boolean;
  appraiser_id: AppraisalMany2One;
  method_appraiser_id: AppraisalMany2One;
}

interface AppraisalRequestRecord {
  id: number;
  name: string | false;
  holder_id: AppraisalMany2One;
  asset_id: AppraisalMany2One;
  appraiser_id: AppraisalMany2One;
  reason: AppraisalMany2One;
  state: string;
}

interface EncumbranceRecord {
  id: number;
  description: string;
  mortgage_main_liability: number;
  principal_amount: number;
  ordinary_interest_amount: number;
  delay_interest_amount: number;
  expenses_amount: number;
  total_mortgage_main_liability: number;
}

export class BienesPage extends BasePage {
  private manualAppraisalId?: number;
  private manualAppraisalName?: string;
  private manualAppraiserName?: string;
  private manualAppraisalMethodName?: string;

  constructor(page: Page) {
    super(page);
  }

  async navigateToBienes(): Promise<void> {
    if (env.actionUrls.tiposBienes) {
      await this.goto(env.actionUrls.tiposBienes);
    } else {
      await this.goto('/odoo');
      const configuracionMenu = this.page.getByText('Configuración', { exact: true }).first();

      if (!(await configuracionMenu.isVisible().catch(() => false))) {
        await this.page.getByText('Bienes', { exact: true }).last().click();
        await expect(configuracionMenu).toBeVisible({ timeout: 30000 });
      }

      await configuracionMenu.click();
      await this.page
        .locator('.dropdown-menu:visible a, .dropdown-menu:visible button, .dropdown-menu:visible [role="menuitem"]')
        .filter({ hasText: /^Tipo de Bienes$/i })
        .first()
        .click();
      await this.page.waitForLoadState('domcontentloaded');
    }

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

  async createEditArchiveRegistroPropiedadAndValidateRequiredCode(
    data: RegistroPropiedadTestData
  ): Promise<void> {
    await this.navigateToRegistroPropiedad();
    await this.createRegistroPropiedad(data);
    await this.assertRegistroPropiedadVisibleInActiveList(data.descripcion);
    await this.openRegistroPropiedad(data.descripcion);
    await this.updateRegistroPropiedadDescription(data.descripcionEditada);
    await this.archiveCurrentRegistroPropiedad();
    await this.assertRegistroPropiedadNotVisibleInActiveList(data.descripcionEditada);
    await this.trySaveRegistroPropiedadWithoutCode(data);
    await this.assertRegistroPropiedadCodeRequiredValidation();
  }


  async manageMotivosSolicitudAndValidateConditionalSecondary(data: MotivoSolicitudTestData): Promise<void> {
    await this.navigateToMotivosSolicitud();
    await this.createMotivoSolicitud(data.solicitudManual);
    await this.assertMotivoSolicitudVisibleInActiveList(data.solicitudManual);
    await this.createMotivoSolicitud(data.caducidadDud);
    await this.assertMotivoSolicitudVisibleInActiveList(data.caducidadDud);
    await this.openMotivoSolicitud(data.solicitudManual);
    await this.changeMotivoAndAssertSecondaryIsCleared(data.caducidadDud.motivo, data.solicitudManual.tipoSolicitud);
  }

  async manageTiposCargaAndValidateUniqueCode(data: TipoCargaTestData): Promise<void> {
    await this.navigateToTiposCarga();
    await this.createTipoCarga(data.hipoteca);
    await this.assertTipoCargaVisibleInActiveList(data.hipoteca);
    await this.tryCreateDuplicatedTipoCarga(data.duplicado);
    await this.assertTipoCargaDuplicateCodeValidation();
    await this.discardCurrentTipoBienIfNeeded();
    await this.createTipoCarga(data.sgr);
    await this.assertTipoCargaSgrFlagIsChecked();
    await this.assertTipoCargaVisibleInActiveList(data.hipoteca);
    await this.assertTipoCargaVisibleInActiveList(data.sgr);
    await this.openTipoCarga(data.hipoteca);
    await this.archiveCurrentTipoCarga();
    await this.assertTipoCargaNotVisibleInActiveList(data.hipoteca);
  }

  async createEditAndArchiveBienPrincipal(data: BienPrincipalTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data);
    await this.assertBienPrincipalVisibleInActiveList(data.descripcion);
    await this.openBienPrincipal(data.descripcion);
    await this.updateBienPrincipalDescription(data.descripcionEditada);
    await this.assertBienPrincipalFormContains({ ...data, descripcion: data.descripcionEditada });
    await this.assertBienPrincipalVisibleInActiveList(data.descripcionEditada);
    await this.openBienPrincipal(data.descripcionEditada);
    await this.archiveCurrentBienPrincipal();
    await this.assertBienPrincipalNotVisibleInActiveList(data.descripcionEditada);
  }

  async validateStandardInternalUserFullCrudAccess(data: BienSeguridadCrudTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.assertBienPrincipalVisibleInActiveList(data.bien.descripcion);
    await this.openBienPrincipal(data.bien.descripcion);
    await this.updateBienPrincipalDescription(data.bien.descripcionEditada);
    await this.assertBienPrincipalFormContains({ ...data.bien, descripcion: data.bien.descripcionEditada });

    await this.createEditArchiveTipoBienForSecurity(data.tipoBien);
    await this.createEditRegistroPropiedadForSecurity(data.registroPropiedad);
    await this.createEditTipoCargaForSecurity(data.tipoCarga);

    await this.openBienPrincipal(data.bien.descripcionEditada);
    await this.openCargasTab();
    await this.addMortgageCharge(data.carga);
    await this.saveCurrentTipoBien();
    await this.assertMortgageChargeTotal(data.carga.descripcion, data.carga.totalEsperado);

    await this.openCargasTab();
    await this.updateMortgageChargeDescription(data.carga.descripcion, data.carga.descripcionEditada);
    await this.saveCurrentTipoBien();
    await this.assertMortgageChargeTotal(data.carga.descripcionEditada, data.carga.totalEsperado);

    await this.openBienPrincipal(data.bien.descripcionEditada);
    await this.archiveCurrentBienPrincipal();
    await this.assertBienPrincipalNotVisibleInActiveList(data.bien.descripcionEditada);
  }

  async trySaveBienPrincipalWithoutDescription(): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.click(bienesSelectors.newButton);
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.descriptionInput,
      bienesSelectors.bienes.labels.descripcion,
      ''
    );
    await this.clickSaveExpectingValidation();
  }

  async assertBienPrincipalDescriptionRequiredValidationAndRecordWasNotSaved(): Promise<void> {
    const descriptionInput = await this.inputBySelectorOrLabel(
      bienesSelectors.bienes.descriptionInput,
      bienesSelectors.bienes.labels.descripcion
    );

    await expect(descriptionInput).toBeVisible();
    await expect(descriptionInput).toHaveValue('');
    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasDescriptionRequiredValidation(), {
        message: 'Esperaba validacion de Descripcion obligatoria al crear un Bien.'
      })
      .toBeTruthy();
  }

  async createBienAndOpenDocumentsFolder(data: BienDocumentosTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.click(bienesSelectors.newButton);
    await this.fillMinimalBien(data);
    await this.saveCurrentTipoBien();
    await this.assertBienDocumentsButtonShowsCounter();
    await this.openBienDocuments();
  }

  async renameBienAndOpenDocumentsFolder(data: BienDocumentosTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.click(bienesSelectors.newButton);
    await this.fillMinimalBien(data);
    await this.saveCurrentTipoBien();
    await this.assertBienDocumentsButtonShowsCounter();
    await this.updateBienPrincipalDescription(data.descripcionEditada);
    await this.assertBienDocumentsButtonShowsCounter();
    await this.openBienDocuments();
  }

  async assertDocumentsFolderIsFilteredByBien(data: BienDocumentosTestData): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/04\s*-\s*Bienes/i);
    await expect(this.page.locator('body')).toContainText(new RegExp(this.escapeRegExp(data.descripcion), 'i'));
    await expect(this.page.locator(bienesSelectors.bienes.documentsRows).filter({
      hasText: new RegExp(this.escapeRegExp(data.descripcion), 'i')
    }).first()).toBeVisible();
  }

  async assertDocumentsFolderWasRenamedWithBien(data: BienDocumentosTestData): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/04\s*-\s*Bienes/i);
    await expect(this.page.locator(bienesSelectors.bienes.documentsRows).filter({
      hasText: new RegExp(this.escapeRegExp(data.descripcionEditada), 'i')
    }).first()).toBeVisible();
    await expect(this.page.locator(bienesSelectors.bienes.documentsRows).filter({
      hasText: new RegExp(`^\\s*${this.escapeRegExp(data.descripcion)}\\s*$`, 'i')
    })).toHaveCount(0);
  }

  async validateBienesSearchFiltersAndGrouping(data: BienBusquedaFiltrosTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.pisoOcupado);
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.naveLibre);
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.localOcupado);

    await this.navigateToBienesRegistro();
    await this.clearCurrentSearch();
    await this.searchInCurrentList(data.busquedaDescripcion);
    await expect(this.bienPrincipalRow(data.pisoOcupado.descripcion).first()).toBeVisible();

    await this.clearCurrentSearch();
    await this.searchInCurrentList(data.busquedaReferenciaCatastral);
    await expect(this.bienPrincipalRow(data.pisoOcupado.descripcion).first()).toBeVisible();

    await this.clearCurrentSearch();
    await this.searchInCurrentList(this.commonSearchToken(data));
    await this.applyPredefinedFilter(/Ocupado/i);
    await expect(this.bienPrincipalRow(data.pisoOcupado.descripcion).first()).toBeVisible();
    await expect(this.bienPrincipalRow(data.localOcupado.descripcion).first()).toBeVisible();
    await expect(this.bienPrincipalRow(data.naveLibre.descripcion)).toHaveCount(0);

    await this.clearCurrentSearch();
    await this.searchInCurrentList(this.commonSearchToken(data));
    await this.applyPredefinedFilter(/Con propietario/i);
    await this.assertActiveSearchFacet(/Con propietario/i);

    await this.clearCurrentSearch();
    await this.searchInCurrentList(this.commonSearchToken(data));
    await this.applyPredefinedFilter(/Sin fecha de baja/i);
    await expect(this.bienPrincipalRow(data.pisoOcupado.descripcion).first()).toBeVisible();

    await this.clearCurrentSearch();
    await this.searchInCurrentList(this.commonSearchToken(data));
    await this.applyGroupBy(/Tipo/i);
    await expect(this.page.locator(bienesSelectors.bienes.groupHeader).filter({ hasText: /Inmueble/i }).first()).toBeVisible();
  }

  async manageBienOwnersAndValidateActiveTotal(data: BienPropietariosTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openPropietariosTab();
    await this.addBienOwner(data.propietarioPrincipal);
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage('60');

    await this.openPropietariosTab();
    await this.addBienOwner(data.propietarioSecundario);
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage('100');

    await this.openPropietariosTab();
    await this.deleteBienOwner(data.propietarioSecundario.nombre);
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage('60');
  }

  async createBienWithOwnerForContactIntegration(data: BienPropietariosTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openPropietariosTab();
    await this.addBienOwner(data.propietarioPrincipal);
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage(data.propietarioPrincipal.porcentaje);
  }

  async trySaveBienOwnersAboveOneHundredPercent(data: BienPropietariosExcesoTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openPropietariosTab();
    await this.addBienOwner(data.propietarioInicial);
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage('60');

    await this.openPropietariosTab();
    await this.addBienOwner(data.propietarioExceso);
    await this.clickSaveExpectingValidation();
  }

  async assertActiveOwnerPercentageAboveOneHundredValidation(): Promise<void> {
    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasActiveOwnerPercentageAboveOneHundredValidation(), {
        message: 'Esperaba validacion por Total % propietarios activos superior a 100.'
      })
      .toBeTruthy();
  }

  async trySaveBienOwnersWithInvalidDates(data: BienPropietariosFechasTestData): Promise<void> {
    await this.trySaveBienOwnerDateValidationCase(
      data.fechaAdquisicionFutura.bien,
      data.fechaAdquisicionFutura.propietario,
      undefined,
      /adquisici[oó]n.*futura|fecha.*futura|posterior.*actual|mayor.*actual/i
    );

    await this.trySaveBienOwnerDateValidationCase(
      data.bajaSinAdquisicion.bien,
      data.bajaSinAdquisicion.propietario,
      data.bajaSinAdquisicion.fechaBaja,
      /baja.*adquisici[oó]n|adquisici[oó]n.*obligatoria|requiere.*adquisici[oó]n/i
    );

    await this.trySaveBienOwnerDateValidationCase(
      data.adquisicionPosteriorABaja.bien,
      data.adquisicionPosteriorABaja.propietario,
      data.adquisicionPosteriorABaja.fechaBaja,
      /adquisici[oó]n.*posterior|adquisici[oó]n.*baja|inicio.*posterior|fecha.*desde.*hasta/i
    );
  }

  async deactivateBienOwnerAndValidateActiveTotal(data: BienPropietarioBajaTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openPropietariosTab();
    await this.addBienOwner(data.propietarioActivo);
    await this.addBienOwner(data.propietarioBaja);
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage('100');

    await this.openPropietariosTab();
    await this.updateBienOwnerDates(
      data.propietarioBaja.nombre,
      data.fechaAdquisicionBaja,
      data.fechaBaja
    );
    await this.saveCurrentTipoBien();
    await this.assertTotalActiveOwnerPercentage('60');
  }

  async groupAndUngroupBienChild(data: BienAgrupacionTestData): Promise<void> {
    await this.createGroupedBienes(data);
    await this.assertBienPrincipalNotVisibleInActiveList(data.hija.descripcion);

    await this.openArchivedBienPrincipal(data.hija.descripcion);
    await this.assertFincaAgrupadoraPointsTo(data.agrupadora.descripcion);

    await this.openBienPrincipal(data.agrupadora.descripcion);
    await this.openAgrupacionTab();
    await this.removeGroupedChildBien(data.hija.descripcion);
    await this.saveCurrentTipoBien();
    await this.assertBienPrincipalVisibleInActiveList(data.hija.descripcion);
    await this.openBienPrincipal(data.hija.descripcion);
    await this.assertFincaAgrupadoraIsEmpty();
  }

  async openBienWithoutGroupingParent(data: BienSinAgrupacionTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openBienPrincipal(data.bien.descripcion);
  }

  async assertUngroupIsNotAvailableForBienWithoutParent(): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabAgrupacion);
    await this.assertFincaAgrupadoraIsEmpty();
    await expect(this.page.locator(bienesSelectors.bienes.agrupacion.ungroupButton)).toHaveCount(0);
    await expect(this.page.locator(bienesSelectors.bienes.agrupacion.rows)).toHaveCount(0);
  }

  async validateGroupingFilters(data: BienAgrupacionTestData): Promise<void> {
    await this.createGroupedBienes(data);

    await this.navigateToBienesRegistro();
    await this.clearCurrentSearch();
    await this.searchInCurrentList(this.groupingSearchToken(data));
    await this.applyPredefinedFilter(/Bienes Agrupadores|Agrupadores/i);
    await expect(this.bienPrincipalRow(data.agrupadora.descripcion).first()).toBeVisible();
    await expect(this.bienPrincipalRow(data.hija.descripcion)).toHaveCount(0);

    await this.navigateToBienesRegistro();
    await this.enableArchivedFilter();
    await this.searchInCurrentList(this.groupingSearchToken(data));
    await this.applyPredefinedFilter(/Bienes Agrupados|Agrupados/i);
    await expect(this.bienPrincipalRow(data.hija.descripcion).first()).toBeVisible();
    await expect(this.bienPrincipalRow(data.agrupadora.descripcion)).toHaveCount(0);
  }

  async addMortgageChargeAndValidateTotal(data: BienCargaHipotecariaTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openCargasTab();
    await this.addMortgageCharge(data);
    await this.saveCurrentTipoBien();
    await this.assertMortgageChargeTotal(data.descripcion, data.totalEsperado);

    await this.openCargasTab();
    await this.updateMortgageChargeDescription(data.descripcion, data.descripcionEditada);
    await this.saveCurrentTipoBien();
    await this.assertMortgageChargeTotal(data.descripcionEditada, data.totalEsperado);
  }

  async deactivateMortgageChargeAndValidateHistory(data: BienCargaHistoricoTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.openCargasTab();
    await this.addCurrentMortgageCharge(data);
    await this.saveCurrentTipoBien();
    await this.assertCurrentChargeVisible(data.descripcion);

    await this.openCargasTab();
    await this.updateMortgageChargeEndDate(data.descripcion, data.fechaBaja);
    await this.saveCurrentTipoBien();
    await this.assertCurrentChargeNotVisible(data.descripcion);
    await this.openChargeHistory();
    await this.assertHistoricalChargeVisible(data.descripcion, data.fechaBaja);
  }

  async validateMortgageChargeAmountsRejectNegativeValues(
    data: BienCargaImportesNegativosTestData
  ): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    const assetId = this.currentRecordIdFromUrl();

    await this.expectNegativeEncumbranceAmountValidation(assetId, data, {
      mortgage_main_liability: Number(data.responsabilidadHipotecariaNegativa)
    });
    await this.expectNegativeEncumbranceAmountValidation(assetId, data, {
      principal_amount: Number(data.importePrincipalNegativo)
    });

    const encumbrance = await this.createPositiveEncumbrance(assetId, data);

    expect(encumbrance.total_mortgage_main_liability.toString()).toBe(Number(data.totalEsperado).toString());
    await this.openCurrentBienRecord(assetId, data.bien.descripcion);
    await this.assertMortgageChargeTotal(data.descripcion, data.totalEsperado);
  }

  async createManualAppraisalAndValidateSequence(data: BienTasacionManualTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    const assetId = this.currentRecordIdFromUrl();

    await this.createManualAppraisalViaRpc(assetId, data);
    await this.openCurrentBienRecord(assetId, data.bien.descripcion);
    await this.assertManualAppraisalWasCreated(data);
  }

  async copyAppraisalFromWarrantyAndValidate(data: BienTasacionGarantiaTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.tasacionOrigen.bien);
    const assetId = this.currentRecordIdFromUrl();

    await this.createManualAppraisalViaRpc(assetId, data.tasacionOrigen);
    const sourceAppraisal = await this.currentManualAppraisalRecord();
    const copiedAppraisal = await this.createImportedAppraisalFromWarranty(sourceAppraisal, data.valorModificado);

    await this.openCurrentBienRecord(assetId, data.tasacionOrigen.bien.descripcion);
    await this.assertCopiedWarrantyAppraisal(sourceAppraisal, copiedAppraisal, data.valorModificado);
    await this.assertAppraisalCannotReferenceItself(copiedAppraisal.id);
  }

  async validateAppraisalNotAppraisedAndNotValuedFields(
    data: BienTasacionJustificacionesTestData
  ): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.tasacion.bien);
    const assetId = this.currentRecordIdFromUrl();

    await this.createManualAppraisalViaRpc(assetId, data.tasacion);
    const appraisal = await this.currentManualAppraisalRecord();

    await this.writeAppraisal(appraisal.id, {
      not_appraised: true,
      not_appraised_text: false
    });
    await this.assertNotAppraisedCanBeSavedWithoutRequiredText(appraisal.id);

    await this.writeAppraisal(appraisal.id, {
      not_appraised_text: data.justificacionNoTasable
    });
    await this.assertNotAppraisedTextPersisted(appraisal.id, data.justificacionNoTasable);

    await this.writeAppraisal(appraisal.id, {
      not_appraised: false,
      not_valued: true,
      not_valued_text: data.justificacionNoValorar,
      not_declare_to_be: true
    });

    await this.openCurrentBienRecord(assetId, data.tasacion.bien.descripcion);
    await this.assertNotValuedAndNotDeclareToBePersisted(appraisal.id, data.justificacionNoValorar);
  }

  async validateAppraisalRequestFullWorkflow(data: SolicitudTasacionWorkflowTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    const assetId = this.currentRecordIdFromUrl();
    const request = await this.createAppraisalRequest(assetId, data);

    await this.assertAppraisalRequestState(request.id, data.estadoInicial);
    await this.transitionAppraisalRequest(request.id, data.estadoEnviada);
    await this.assertAppraisalRequestState(request.id, data.estadoEnviada);
    await this.openAppraisalRequestRecord(request.id);
    await this.assertSendMailButtonIsNotVisible();

    await this.transitionAppraisalRequest(request.id, data.estadoDocRecibido);
    await this.assertAppraisalRequestState(request.id, data.estadoDocRecibido);

    await this.transitionAppraisalRequest(request.id, data.estadoConfirmado);
    await this.assertAppraisalRequestState(request.id, data.estadoConfirmado);
    await this.assertSendMailButtonIsNotVisible();
  }

  async validateAppraisalRequestMailSendingRules(
    data: SolicitudTasacionMailValidationTestData
  ): Promise<void> {
    const asset = await this.firstOdooRecord<{ id: number; display_name: string }>('atlas.assets', []);

    if (!asset) {
      throw new Error('No se encontro un Bien existente para crear la Solicitud de Tasacion.');
    }

    const appraiserId = await this.createValuerWithoutEmail(data.tasadoraSinEmail);
    const request = await this.createAppraisalRequest(asset.id, data, appraiserId);

    await this.assertAppraisalRequestState(request.id, data.estadoSolicitada);
    await this.expectAppraisalRequestMailError(request.id, /email|correo|tasadora|configurado/i);
    await this.assertAppraisalRequestState(request.id, data.estadoSolicitada);

    await this.writePartner(appraiserId, { email: data.emailTasadora });
    await this.sendAppraisalRequestMail(request.id);
    await this.assertAppraisalRequestState(request.id, data.estadoEnviada);
    await this.openAppraisalRequestRecord(request.id);
    await this.assertSendMailButtonIsNotVisible();
  }

  async validateTasacionTitularAndTasadoraDomains(data: SolicitudTasacionDominiosTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.bien);
    await this.navigateToSolicitudesTasacion();
    await this.click(bienesSelectors.newButton);
    await this.assertTasacionState(data.estadoEsperado);
    await this.assertAutocompleteHasNoRecords(
      bienesSelectors.solicitudesTasacion.titularInput,
      bienesSelectors.solicitudesTasacion.labels.titular,
      data.titularTasador
    );
    await this.selectAutocompleteField(
      bienesSelectors.solicitudesTasacion.bienInput,
      bienesSelectors.solicitudesTasacion.labels.bien,
      data.bien.descripcion
    );
    await this.assertAutocompleteHasNoRecords(
      bienesSelectors.solicitudesTasacion.tasadoraInput,
      bienesSelectors.solicitudesTasacion.labels.tasadora,
      data.tasadoraNoTasadora
    );
    await this.clickSaveExpectingValidation();
  }

  async assertTasacionDefaultStateAndRequiredFieldsValidation(
    data: SolicitudTasacionDominiosTestData
  ): Promise<void> {
    await this.assertTasacionState(data.estadoEsperado);
    await expect
      .poll(async () => this.hasRequiredFieldsValidation(), {
        message: 'Esperaba validacion por campos obligatorios pendientes en Solicitud de Tasacion.'
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

  private async createEditArchiveTipoBienForSecurity(data: TipoBienTestData): Promise<void> {
    await this.navigateToBienes();
    await this.createTipoBien(data);
    await this.assertTipoBienIsVisibleInActiveList(data.descripcion);
    await this.openTipoBien(data.descripcion);
    await this.updateTipoBienDescription(data.descripcionEditada);
    await this.archiveCurrentTipoBien();
    await this.assertTipoBienIsNotVisibleInActiveList(data.descripcionEditada);
  }

  private async createEditRegistroPropiedadForSecurity(data: RegistroPropiedadTestData): Promise<void> {
    await this.navigateToRegistroPropiedad();
    await this.createRegistroPropiedad(data);
    await this.assertRegistroPropiedadVisibleInActiveList(data.descripcion);
    await this.openRegistroPropiedad(data.descripcion);
    await this.updateRegistroPropiedadDescription(data.descripcionEditada);
    await this.assertRegistroPropiedadVisibleInActiveList(data.descripcionEditada);
  }

  private async navigateToMotivosSolicitud(): Promise<void> {
    await this.goto(env.actionUrls.motivosSolicitud);
    await expect(this.page).toHaveTitle(bienesSelectors.motivosSolicitud.pageTitleText);
    await expect(this.page.locator(bienesSelectors.newButton).first()).toBeVisible();
  }

  private async navigateToTiposCarga(): Promise<void> {
    await this.goto(env.actionUrls.tiposCarga);
    await expect(this.page).toHaveTitle(bienesSelectors.tiposCarga.pageTitleText);
    await expect(this.page.locator(bienesSelectors.newButton).first()).toBeVisible();
  }

  private async navigateToBienesRegistro(): Promise<void> {
    await this.goto(env.actionUrls.bienesRegistro);
    await expect(this.page).toHaveTitle(bienesSelectors.bienes.pageTitleText);
    await expect(this.page.locator(bienesSelectors.newButton).first()).toBeVisible();
  }

  private async navigateToSolicitudesTasacion(): Promise<void> {
    await this.goto(env.actionUrls.solicitudesTasacion);
    await expect(this.page).toHaveTitle(bienesSelectors.solicitudesTasacion.pageTitleText);
    await expect(this.page.locator(bienesSelectors.newButton).first()).toBeVisible();
  }

  private async openAppraisalRequestRecord(requestId: number): Promise<void> {
    await this.goto(`${env.actionUrls.solicitudesTasacion}/${requestId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  private async createBienPrincipal(data: BienPrincipalTestData): Promise<void> {
    await this.click(bienesSelectors.newButton);
    await this.fillBienPrincipal(data);
    await this.saveCurrentTipoBien();
    await this.assertBienPrincipalFormContains(data);
  }

  private async createGroupedBienes(data: BienAgrupacionTestData): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.agrupadora);
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(data.hija);

    await this.openBienPrincipal(data.agrupadora.descripcion);
    await this.openAgrupacionTab();
    await this.addGroupedChildBien(data.hija.descripcion);
    await this.saveCurrentTipoBien();
  }

  private async fillMinimalBien(data: BienDocumentosTestData): Promise<void> {
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.descriptionInput,
      bienesSelectors.bienes.labels.descripcion,
      data.descripcion
    );
    await this.selectAutocompleteField(
      bienesSelectors.bienes.typeInput,
      bienesSelectors.bienes.labels.tipo,
      data.tipo
    );
  }

  private async fillBienPrincipal(data: BienPrincipalTestData): Promise<void> {
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.descriptionInput,
      bienesSelectors.bienes.labels.descripcion,
      data.descripcion
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.codeInput,
      bienesSelectors.bienes.labels.codigo,
      data.codigo
    );
    await this.selectAutocompleteField(
      bienesSelectors.bienes.typeInput,
      bienesSelectors.bienes.labels.tipo,
      data.tipo
    );
    await this.selectFirstAutocompleteOptionIfVisible(
      bienesSelectors.bienes.guaranteeTypeInput,
      bienesSelectors.bienes.labels.tipoGarantia,
      ['Garantia 1', 'Hipotecaria', 'Hipoteca', 'Real']
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.fechaNoSimpleInput,
      bienesSelectors.bienes.labels.fechaNoSimple,
      data.fechaNoSimple
    );
    await this.selectAutocompleteField(
      bienesSelectors.bienes.registroPropiedadInput,
      bienesSelectors.bienes.labels.registroPropiedad,
      data.registroPropiedad
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.libroInput,
      bienesSelectors.bienes.labels.libro,
      data.libro
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.hojaInput,
      bienesSelectors.bienes.labels.hoja,
      data.hoja
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.folioInput,
      bienesSelectors.bienes.labels.folio,
      data.folio
    );
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabOtrosDatos);
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.numeroFincaInput,
      bienesSelectors.bienes.labels.numeroFinca,
      data.numeroFinca
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.referenciaCatastralInput,
      bienesSelectors.bienes.labels.referenciaCatastral,
      data.referenciaCatastral
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.superficieEdificadaInput,
      bienesSelectors.bienes.labels.superficieEdificada,
      data.superficieEdificada
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.superficieUtilInput,
      bienesSelectors.bienes.labels.superficieUtil,
      data.superficieUtil
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.valorMercadoInput,
      bienesSelectors.bienes.labels.valorMercado,
      data.valorMercado
    );
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabInformacionJuridica);
    await this.setBienCheckbox(
      bienesSelectors.bienes.llavesInput,
      bienesSelectors.bienes.labels.llaves,
      data.llaves
    );
    await this.setBienCheckbox(
      bienesSelectors.bienes.ocupadoInput,
      bienesSelectors.bienes.labels.ocupado,
      data.ocupado
    );
  }

  private async updateBienPrincipalDescription(description: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.bienes.descriptionInput,
      bienesSelectors.bienes.labels.descripcion,
      description
    );
    await this.saveCurrentTipoBien();
  }

  private async assertBienPrincipalFormContains(data: BienPrincipalTestData): Promise<void> {
    await expect(this.page.locator('body')).toContainText(data.descripcion);
    await this.assertFieldValueIfVisible(
      bienesSelectors.bienes.codeInput,
      bienesSelectors.bienes.labels.codigo,
      data.codigo
    );
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabOtrosDatos);
    await this.assertFieldValueIfVisible(
      bienesSelectors.bienes.referenciaCatastralInput,
      bienesSelectors.bienes.labels.referenciaCatastral,
      data.referenciaCatastral
    );
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabInformacionJuridica);
    await this.assertBienCheckboxIsChecked(bienesSelectors.bienes.llavesInput, bienesSelectors.bienes.labels.llaves);
    await this.assertBienCheckboxIsChecked(bienesSelectors.bienes.ocupadoInput, bienesSelectors.bienes.labels.ocupado);
  }

  private async assertBienPrincipalVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.searchInCurrentList(description);
    await expect(this.bienPrincipalRow(description).first()).toBeVisible();
  }

  private async assertBienPrincipalNotVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.searchInCurrentList(description);
    await expect(this.bienPrincipalRow(description)).toHaveCount(0);
  }

  private async openBienPrincipal(description: string): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.searchInCurrentList(description);

    const row = this.bienPrincipalRow(description).first();

    await expect(row).toBeVisible();
    await this.page.keyboard.press('Escape');
    await row.click({ force: true });
  }

  private async openArchivedBienPrincipal(description: string): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.enableArchivedFilter();
    await this.searchInCurrentList(description);

    const row = this.bienPrincipalRow(description).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async archiveCurrentBienPrincipal(): Promise<void> {
    await this.openActionMenu();
    await this.page.locator(bienesSelectors.archiveMenuItem).first().click();

    const confirmButton = this.page.locator(bienesSelectors.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(this.page.locator(bienesSelectors.unarchiveButton).first()).toBeVisible({ timeout: 30000 });
  }

  private async openAgrupacionTab(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabAgrupacion);
    await expect(this.page.locator(bienesSelectors.bienes.agrupacion.addLineButton).first()).toBeVisible();
  }

  private async addGroupedChildBien(childDescription: string): Promise<void> {
    await this.page.locator(bienesSelectors.bienes.agrupacion.addLineButton).first().click();

    const row = await this.currentAgrupacionRow();

    await this.selectRowAutocomplete(row, bienesSelectors.bienes.agrupacion.bienInput, childDescription);
  }

  private async removeGroupedChildBien(childDescription: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabAgrupacion);

    const row = this.page
      .locator(bienesSelectors.bienes.agrupacion.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(childDescription), 'i') })
      .first();

    await expect(row).toBeVisible();
    await row.hover();

    const removeButton = row.locator(bienesSelectors.bienes.agrupacion.removeLineButton).first();

    if (await removeButton.isVisible().catch(() => false)) {
      await removeButton.click();
      await this.confirmDialogIfVisible();
      return;
    }

    await row.click();
    await this.page.keyboard.press('Delete');
    await this.confirmDialogIfVisible();
  }

  private async assertFincaAgrupadoraPointsTo(parentDescription: string): Promise<void> {
    const fieldValue = await this.fincaAgrupadoraValue();

    expect(fieldValue).toMatch(new RegExp(this.escapeRegExp(parentDescription), 'i'));
  }

  private async assertFincaAgrupadoraIsEmpty(): Promise<void> {
    const fieldValue = await this.fincaAgrupadoraValue();

    expect(fieldValue).toBe('');
  }

  private async openCargasTab(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabCargas);
    await expect(this.page.locator(bienesSelectors.bienes.cargas.addLineButton).first()).toBeVisible();
  }

  private async addMortgageCharge(data: BienCargaHipotecariaTestData): Promise<void> {
    await this.page.locator(bienesSelectors.bienes.cargas.addLineButton).first().click();

    const row = await this.currentCargaRow();

    await this.fillRowInput(row, bienesSelectors.bienes.cargas.descriptionInput, data.descripcion);
    await this.selectRowAutocomplete(row, bienesSelectors.bienes.cargas.tipoCargaInput, data.tipoCarga);
    await this.selectRowAutocomplete(row, bienesSelectors.bienes.cargas.beneficiarioInput, data.beneficiario);
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.fechaBajaInput, data.fechaBaja);
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.importePrincipalInput, data.importePrincipal);
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.interesesOrdinariosInput, data.interesesOrdinarios);
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.interesesDemoraInput, data.interesesDemora);
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.gastosInput, data.gastos);
  }

  private async expectNegativeEncumbranceAmountValidation(
    assetId: number,
    data: BienCargaImportesNegativosTestData,
    negativeValues: Partial<Record<keyof EncumbranceRecord, number>>
  ): Promise<void> {
    await expect
      .poll(async () => {
        try {
          await this.createEncumbrance(assetId, data, negativeValues);
          return '';
        } catch (error) {
          return error instanceof Error ? error.message : String(error);
        }
      }, {
        message: 'Esperaba ValidationError por importes negativos en la carga.'
      })
      .toMatch(/negativ|no pueden ser negativos|ValidationError|importe/i);
  }

  private async createPositiveEncumbrance(
    assetId: number,
    data: BienCargaImportesNegativosTestData
  ): Promise<EncumbranceRecord> {
    const encumbranceId = await this.createEncumbrance(assetId, data, {
      mortgage_main_liability: Number(data.responsabilidadHipotecaria),
      principal_amount: Number(data.importePrincipal),
      ordinary_interest_amount: Number(data.interesesOrdinarios),
      delay_interest_amount: Number(data.interesesDemora),
      expenses_amount: Number(data.gastos)
    });
    const [record] = await this.readEncumbrances([encumbranceId]);

    return record;
  }

  private async createEncumbrance(
    assetId: number,
    data: BienCargaImportesNegativosTestData,
    values: Record<string, number>
  ): Promise<number> {
    const encumbranceType = await this.firstOdooRecord<{ id: number; display_name: string }>(
      'atlas.assets.encumbrance.type',
      [['display_name', 'ilike', data.tipoCarga]]
    );

    if (!encumbranceType) {
      throw new Error(`No se encontro Tipo de Carga para ${data.tipoCarga}.`);
    }

    return this.odooCallKw<number>('atlas.assets.encumbrance', 'create', [
      {
        asset_id: assetId,
        encumbrance_order: data.orden,
        description: data.descripcion,
        encumbrance_type_id: encumbranceType.id,
        ...values
      }
    ]);
  }

  private async readEncumbrances(ids: number[]): Promise<EncumbranceRecord[]> {
    return this.odooCallKw<EncumbranceRecord[]>('atlas.assets.encumbrance', 'read', [ids], {
      fields: [
        'description',
        'mortgage_main_liability',
        'principal_amount',
        'ordinary_interest_amount',
        'delay_interest_amount',
        'expenses_amount',
        'total_mortgage_main_liability'
      ]
    });
  }

  private async addCurrentMortgageCharge(data: BienCargaHistoricoTestData): Promise<void> {
    await this.page.locator(bienesSelectors.bienes.cargas.addLineButton).first().click();

    const row = await this.currentCargaRow();

    await this.fillRowInput(row, bienesSelectors.bienes.cargas.descriptionInput, data.descripcion);
    await this.selectRowAutocomplete(row, bienesSelectors.bienes.cargas.tipoCargaInput, data.tipoCarga);
    await this.selectRowAutocomplete(row, bienesSelectors.bienes.cargas.beneficiarioInput, data.beneficiario);
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.importePrincipalInput, data.importePrincipal);
  }

  private async updateMortgageChargeEndDate(description: string, fechaBaja: string): Promise<void> {
    const row = this.cargaRow(description).first();

    await expect(row).toBeVisible();
    await row.click();
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.fechaBajaInput, fechaBaja);
  }

  private async updateMortgageChargeDescription(currentDescription: string, newDescription: string): Promise<void> {
    const row = this.cargaRow(currentDescription).first();

    await expect(row).toBeVisible();
    await row.click();
    await this.fillRowInput(row, bienesSelectors.bienes.cargas.descriptionInput, newDescription);
  }

  private async assertMortgageChargeTotal(description: string, expectedTotal: string): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabCargas);

    const row = this.cargaRow(description).first();

    await expect(row).toBeVisible();
    await expect
      .poll(async () => this.mortgageChargeTotal(row), {
        message: `Esperaba Total Resp. Hipotecaria Principal = ${expectedTotal}.`
      })
      .toBe(this.normalizeMoney(expectedTotal));
  }

  private async assertCurrentChargeVisible(description: string): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabCargas);
    await expect(this.cargaRow(description).first()).toBeVisible();
  }

  private async assertCurrentChargeNotVisible(description: string): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabCargas);
    await expect(this.cargaRow(description)).toHaveCount(0);
  }

  private async openChargeHistory(): Promise<void> {
    const historyButton = this.page.locator(bienesSelectors.bienes.cargas.historicoButton).first();

    await expect(historyButton).toBeVisible();
    await historyButton.click();
  }

  private async assertHistoricalChargeVisible(description: string, fechaBaja: string): Promise<void> {
    const row = this.cargaRow(description).first();

    await expect(row).toBeVisible();
    await expect(row).toContainText(new RegExp(this.escapeRegExp(fechaBaja), 'i'));
  }

  private async openTasacionesTab(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabTasaciones);
    await expect(this.page.locator(bienesSelectors.bienes.tasaciones.addLineButton).first()).toBeVisible();
  }

  private async openCurrentBienRecord(assetId: number, description: string): Promise<void> {
    await this.goto(`${env.actionUrls.bienesRegistro}/${assetId}`);
    await expect(this.page.locator('body')).toContainText(new RegExp(this.escapeRegExp(description), 'i'));
  }

  private async createManualAppraisalViaRpc(assetId: number, data: BienTasacionManualTestData): Promise<void> {
    const appraiser = await this.firstOdooRecord<{ id: number; display_name: string }>('res.partner', [
      ['atlas_is_valuer', '=', true]
    ]);
    const method = await this.firstOdooRecord<{ id: number; display_name: string }>(
      'atlas.assets.method.valoration',
      [['display_name', 'ilike', data.metodoTasacion]]
    );

    if (!appraiser) {
      throw new Error('No se encontro una tasadora con atlas_is_valuer=True para crear la tasacion.');
    }

    if (!method) {
      throw new Error(`No se encontro un metodo de tasacion que contenga "${data.metodoTasacion}".`);
    }

    const appraisalId = await this.odooCallKw<number>('atlas.assets.appraisal', 'create', [
      {
        asset_id: assetId,
        date_value: this.toOdooDate(data.fechaValor),
        date_expired: this.toOdooDate(data.fechaCaducidad),
        value: Number(data.valor),
        eco_check: data.cumpleEco,
        appraiser_id: appraiser.id,
        method_appraiser_id: method.id
      }
    ]);
    const [appraisal] = await this.odooCallKw<Array<{ name: string }>>('atlas.assets.appraisal', 'read', [[appraisalId]], {
      fields: ['name']
    });

    this.manualAppraisalId = appraisalId;
    this.manualAppraisalName = appraisal.name;
    this.manualAppraiserName = appraiser.display_name;
    this.manualAppraisalMethodName = method.display_name;
  }

  private async createAppraisalRequest(
    assetId: number,
    data: SolicitudTasacionWorkflowTestData | SolicitudTasacionMailValidationTestData,
    appraiserOverrideId?: number
  ): Promise<AppraisalRequestRecord> {
    const holder = await this.firstOdooRecord<{ id: number; display_name: string }>('res.partner', [
      ['display_name', 'ilike', data.titular],
      ['atlas_is_valuer', '!=', true]
    ]);
    const appraiser = appraiserOverrideId
      ? { id: appraiserOverrideId, display_name: 'Tasadora temporal' }
      : await this.firstOdooRecord<{ id: number; display_name: string }>('res.partner', [
          ['display_name', 'ilike', 'tasadora' in data ? data.tasadora : data.tasadoraSinEmail],
          ['atlas_is_valuer', '=', true],
          ['email', '!=', false]
        ]);
    const reason = await this.firstOdooRecord<{ id: number; display_name: string }>(
      'atlas.assets.appraisal.reason.type',
      []
    );

    if (!holder) {
      throw new Error(`No se encontro titular no tasador para Solicitud de Tasacion: ${data.titular}.`);
    }

    if (!appraiser) {
      const appraiserName = 'tasadora' in data ? data.tasadora : data.tasadoraSinEmail;
      throw new Error(`No se encontro tasadora con email configurado para Solicitud de Tasacion: ${appraiserName}.`);
    }

    if (!reason) {
      throw new Error('No se encontro Motivo para Solicitud de Tasacion.');
    }

    const requestId = await this.odooCallKw<number>('atlas.assets.appraisal.request', 'create', [
      {
        holder_id: holder.id,
        asset_id: assetId,
        appraiser_id: appraiser.id,
        reason: reason.id
      }
    ]);
    const [request] = await this.readAppraisalRequests([requestId]);

    return request;
  }

  private async createValuerWithoutEmail(name: string): Promise<number> {
    return this.odooCallKw<number>('res.partner', 'create', [
      {
        name,
        atlas_is_valuer: true,
        email: false
      }
    ]);
  }

  private async writePartner(partnerId: number, values: Record<string, unknown>): Promise<void> {
    const updated = await this.odooCallKw<boolean>('res.partner', 'write', [[partnerId], values]);

    expect(updated).toBe(true);
  }

  private async sendAppraisalRequestMail(requestId: number): Promise<void> {
    await this.odooCallKw<unknown>('atlas.assets.appraisal.request', 'action_send_appraisal_request_mail', [
      [requestId]
    ]);
  }

  private async expectAppraisalRequestMailError(requestId: number, expectedMessage: RegExp): Promise<void> {
    await expect
      .poll(async () => {
        try {
          await this.sendAppraisalRequestMail(requestId);
          return '';
        } catch (error) {
          return error instanceof Error ? error.message : String(error);
        }
      }, {
        message: 'Esperaba error al enviar mail de Solicitud de Tasacion.'
      })
      .toMatch(expectedMessage);
  }

  private async transitionAppraisalRequest(requestId: number, state: string): Promise<void> {
    const updated = await this.odooCallKw<boolean>('atlas.assets.appraisal.request', 'write', [
      [requestId],
      { state }
    ]);

    expect(updated).toBe(true);
  }

  private async assertAppraisalRequestState(requestId: number, expectedState: string): Promise<void> {
    const [request] = await this.readAppraisalRequests([requestId]);

    expect(request.state).toBe(expectedState);
  }

  private async assertSendMailButtonIsNotVisible(): Promise<void> {
    const sendMailButton = this.page
      .locator('.o_form_view button, .o_form_view a[role="button"]')
      .filter({ hasText: /Enviar mail|Enviar email|Enviar correo/i });

    await expect(sendMailButton).toHaveCount(0);
  }

  private async currentManualAppraisalRecord(): Promise<AppraisalRecord> {
    if (!this.manualAppraisalId) {
      throw new Error('No existe tasacion origen para copiar.');
    }

    const [record] = await this.readAppraisals([this.manualAppraisalId]);

    return record;
  }

  private async createImportedAppraisalFromWarranty(
    sourceAppraisal: AppraisalRecord,
    modifiedValue: string
  ): Promise<AppraisalRecord> {
    const importedId = await this.odooCallKw<number>('atlas.assets.appraisal', 'create', [
      {
        asset_id: this.currentRecordIdFromUrl(),
        appraisal_origin: 'imported',
        appraised_as_warranty: sourceAppraisal.id,
        date_value: sourceAppraisal.date_value,
        date_expired: sourceAppraisal.date_expired,
        value: Number(modifiedValue),
        eco_check: sourceAppraisal.eco_check,
        appraiser_id: this.many2OneId(sourceAppraisal.appraiser_id),
        method_appraiser_id: this.many2OneId(sourceAppraisal.method_appraiser_id)
      }
    ]);
    const [record] = await this.readAppraisals([importedId]);

    return record;
  }

  private async assertCopiedWarrantyAppraisal(
    sourceAppraisal: AppraisalRecord,
    copiedAppraisal: AppraisalRecord,
    modifiedValue: string
  ): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabTasaciones);

    const row = this.page
      .locator(bienesSelectors.bienes.tasaciones.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(copiedAppraisal.name), 'i') })
      .first();

    await expect(row).toBeVisible();
    await expect(row).toContainText(new RegExp(this.escapeRegExp(copiedAppraisal.name), 'i'));

    expect(copiedAppraisal.appraisal_origin).toBe('imported');
    expect(copiedAppraisal.appraised_as_warranty && copiedAppraisal.appraised_as_warranty[0]).toBe(sourceAppraisal.id);
    expect(copiedAppraisal.appraised_as_warranty && copiedAppraisal.appraised_as_warranty[1]).toBe(sourceAppraisal.name);
    expect(copiedAppraisal.date_value).toBe(sourceAppraisal.date_value);
    expect(copiedAppraisal.date_expired).toBe(sourceAppraisal.date_expired);
    expect(copiedAppraisal.value.toString()).toBe(Number(modifiedValue).toString());
    expect(copiedAppraisal.eco_check).toBe(sourceAppraisal.eco_check);
    expect(this.many2OneId(copiedAppraisal.appraiser_id)).toBe(this.many2OneId(sourceAppraisal.appraiser_id));
    expect(this.many2OneId(copiedAppraisal.method_appraiser_id)).toBe(
      this.many2OneId(sourceAppraisal.method_appraiser_id)
    );
  }

  private async assertAppraisalCannotReferenceItself(appraisalId: number): Promise<void> {
    const [record] = await this.readAppraisals([appraisalId]);

    expect(record.appraised_as_warranty && record.appraised_as_warranty[0]).not.toBe(appraisalId);
  }

  private async assertNotAppraisedCanBeSavedWithoutRequiredText(appraisalId: number): Promise<void> {
    const [record] = await this.readAppraisals([appraisalId]);

    expect(record.not_appraised).toBe(true);
    expect(record.not_appraised_text).toBe(false);
  }

  private async assertNotAppraisedTextPersisted(appraisalId: number, expectedText: string): Promise<void> {
    const [record] = await this.readAppraisals([appraisalId]);

    expect(record.not_appraised).toBe(true);
    expect(record.not_appraised_text).toBe(expectedText);
  }

  private async assertNotValuedAndNotDeclareToBePersisted(
    appraisalId: number,
    expectedText: string
  ): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabTasaciones);

    const [record] = await this.readAppraisals([appraisalId]);
    const row = this.page
      .locator(bienesSelectors.bienes.tasaciones.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(record.name), 'i') })
      .first();

    await expect(row).toBeVisible();
    expect(record.not_appraised).toBe(false);
    expect(record.not_valued).toBe(true);
    expect(record.not_valued_text).toBe(expectedText);
    expect(record.not_declare_to_be).toBe(true);
  }

  private async writeAppraisal(appraisalId: number, values: Record<string, unknown>): Promise<void> {
    const updated = await this.odooCallKw<boolean>('atlas.assets.appraisal', 'write', [[appraisalId], values]);

    expect(updated).toBe(true);
  }

  private async readAppraisals(ids: number[]): Promise<AppraisalRecord[]> {
    return this.odooCallKw<AppraisalRecord[]>('atlas.assets.appraisal', 'read', [ids], {
      fields: [
        'name',
        'appraisal_origin',
        'appraised_as_warranty',
        'date_value',
        'date_expired',
        'value',
        'eco_check',
        'not_appraised',
        'not_appraised_text',
        'not_valued',
        'not_valued_text',
        'not_declare_to_be',
        'appraiser_id',
        'method_appraiser_id'
      ]
    });
  }

  private async readAppraisalRequests(ids: number[]): Promise<AppraisalRequestRecord[]> {
    return this.odooCallKw<AppraisalRequestRecord[]>('atlas.assets.appraisal.request', 'read', [ids], {
      fields: ['name', 'holder_id', 'asset_id', 'appraiser_id', 'reason', 'state']
    });
  }

  private many2OneId(value: AppraisalMany2One): number | false {
    return value ? value[0] : false;
  }

  private async firstOdooRecord<T extends { id: number }>(
    model: string,
    domain: unknown[][]
  ): Promise<T | undefined> {
    const records = await this.odooCallKw<T[]>(model, 'search_read', [domain], {
      fields: ['display_name'],
      limit: 1
    });

    return records[0];
  }

  private async odooCallKw<T>(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
  ): Promise<T> {
    return this.page.evaluate(
      async ({ modelName, methodName, callArgs, callKwargs }) => {
        const response = await fetch(`/web/dataset/call_kw/${modelName}/${methodName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              model: modelName,
              method: methodName,
              args: callArgs,
              kwargs: callKwargs
            },
            id: Date.now()
          })
        });
        const payload = await response.json();

        if (payload.error) {
          throw new Error(payload.error.data?.message || payload.error.message || 'Error RPC de Odoo.');
        }

        return payload.result as T;
      },
      { modelName: model, methodName: method, callArgs: args, callKwargs: kwargs }
    );
  }

  private currentRecordIdFromUrl(): number {
    const matches = [...this.page.url().matchAll(/\/(\d+)(?=\/|[?#]|$)/g)];
    const recordId = matches.length > 0 ? Number(matches[matches.length - 1][1]) : NaN;

    if (!Number.isInteger(recordId) || recordId <= 0) {
      throw new Error(`No se pudo obtener el ID del Bien desde la URL actual: ${this.page.url()}`);
    }

    return recordId;
  }

  private toOdooDate(value: string): string {
    const [day, month, year] = value.split('/');

    if (!day || !month || !year) {
      throw new Error(`Fecha invalida para Odoo: ${value}`);
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private async addManualAppraisal(data: BienTasacionManualTestData): Promise<void> {
    const addLine = this.page.locator(bienesSelectors.bienes.tasaciones.addLineButton).first();

    await expect(addLine).toBeVisible();
    await addLine.click();

    const row = await this.currentTasacionRow();

    await this.fillRowInput(row, bienesSelectors.bienes.tasaciones.fechaValorInput, data.fechaValor);
    await this.fillRowInput(row, bienesSelectors.bienes.tasaciones.fechaCaducidadInput, data.fechaCaducidad);
    await this.fillRowInput(row, bienesSelectors.bienes.tasaciones.valorInput, data.valor);
    await this.setRowCheckbox(row, bienesSelectors.bienes.tasaciones.cumpleEcoInput, data.cumpleEco);
    await this.selectRowAutocomplete(row, bienesSelectors.bienes.tasaciones.tasadoraInput, data.tasadora);
    await this.selectRowAutocomplete(row, bienesSelectors.bienes.tasaciones.metodoTasacionInput, data.metodoTasacion);
  }

  private async assertManualAppraisalWasCreated(data: BienTasacionManualTestData): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabTasaciones);

    const row = this.tasacionRow(data).first();

    await expect(row).toBeVisible();
    await expect(row).toContainText(new RegExp(this.escapeRegExp(data.fechaValor), 'i'));
    await expect
      .poll(async () => this.appraisalSequence(row), {
        message: 'Esperaba que el campo Tasacion tenga una secuencia asignada.'
      })
      .toMatch(/TAS\/\d{4}\/\d+|TAS/i);
    await this.assertManualAppraisalRpcData(data);
    await this.assertLastAppraisalFields(data);
  }

  private async assertManualAppraisalRpcData(data: BienTasacionManualTestData): Promise<void> {
    if (!this.manualAppraisalId) {
      throw new Error('No existe ID de tasacion manual para validar datos RPC.');
    }

    const records = await this.odooCallKw<
      Array<{
        appraiser_id: [number, string] | false;
        method_appraiser_id: [number, string] | false;
        appraisal_origin: string | false;
        date_value: string;
        date_expired: string;
        value: number;
        eco_check: boolean;
      }>
    >('atlas.assets.appraisal', 'read', [[this.manualAppraisalId]], {
      fields: [
        'appraiser_id',
        'method_appraiser_id',
        'appraisal_origin',
        'date_value',
        'date_expired',
        'value',
        'eco_check'
      ]
    });
    const record = records[0];

    expect(record.date_value).toBe(this.toOdooDate(data.fechaValor));
    expect(record.date_expired).toBe(this.toOdooDate(data.fechaCaducidad));
    expect(record.value.toString()).toBe(Number(data.valor).toString());
    expect(record.eco_check).toBe(data.cumpleEco);

    if (this.manualAppraiserName) {
      expect(record.appraiser_id && record.appraiser_id[1]).toContain(this.manualAppraiserName);
    }

    if (this.manualAppraisalMethodName) {
      expect(record.method_appraiser_id && record.method_appraiser_id[1]).toContain(this.manualAppraisalMethodName);
    }
  }

  private async assertLastAppraisalFields(data: BienTasacionManualTestData): Promise<void> {
    const lastAppraisal = await this.optionalInputBySelectorOrLabel(
      bienesSelectors.bienes.tasaciones.ultimaTasacionInput,
      bienesSelectors.bienes.labels.ultimaTasacion
    );

    if (lastAppraisal) {
      await expect(lastAppraisal).toHaveValue(/TAS|.+/);
    }

    const lastAppraisalDate = await this.optionalInputBySelectorOrLabel(
      bienesSelectors.bienes.tasaciones.fechaUltimaTasacionInput,
      bienesSelectors.bienes.labels.fechaUltimaTasacion
    );

    if (lastAppraisalDate) {
      await expect(lastAppraisalDate).toHaveValue(new RegExp(this.escapeRegExp(data.fechaValor)));
    }
  }

  private async openPropietariosTab(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabPropietarios);
    await expect(this.page.locator(bienesSelectors.bienes.propietarios.addLineButton).first()).toBeVisible();
  }

  private async addBienOwner(owner: BienPropietarioTestData, fechaBaja?: string): Promise<void> {
    await this.page.locator(bienesSelectors.bienes.propietarios.addLineButton).first().click();

    const row = await this.currentOwnerRow();

    await this.selectRowAutocomplete(
      row,
      bienesSelectors.bienes.propietarios.propietarioInput,
      owner.nombre
    );
    await this.fillRowInput(row, bienesSelectors.bienes.propietarios.porcentajeInput, owner.porcentaje);

    if (owner.fechaAdquisicion) {
      await this.fillRowInput(
        row,
        bienesSelectors.bienes.propietarios.fechaAdquisicionInput,
        owner.fechaAdquisicion
      );
    }

    if (fechaBaja) {
      await this.fillRowInput(row, bienesSelectors.bienes.propietarios.fechaBajaInput, fechaBaja);
    }

    await this.setRowCheckbox(
      row,
      bienesSelectors.bienes.propietarios.registrarPropiedadInput,
      owner.registrarPropiedad
    );
  }

  private async deleteBienOwner(ownerName: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabPropietarios);

    const row = this.page
      .locator(bienesSelectors.bienes.propietarios.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(ownerName), 'i') })
      .first();

    await expect(row).toBeVisible();
    await row.hover();

    const removeButton = row.locator(bienesSelectors.bienes.propietarios.removeLineButton).first();

    if (await removeButton.isVisible().catch(() => false)) {
      await removeButton.click();
      return;
    }

    await row.click();
    await this.page.keyboard.press('Delete');
  }

  private async updateBienOwnerDates(ownerName: string, fechaAdquisicion: string, fechaBaja: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabPropietarios);

    const row = this.page
      .locator(bienesSelectors.bienes.propietarios.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(ownerName), 'i') })
      .first();

    await expect(row).toBeVisible();
    await row.click();
    await this.fillRowInput(row, bienesSelectors.bienes.propietarios.fechaAdquisicionInput, fechaAdquisicion);
    await this.fillRowInput(row, bienesSelectors.bienes.propietarios.fechaBajaInput, fechaBaja);
  }

  private async assertTotalActiveOwnerPercentage(expected: string): Promise<void> {
    await this.openBienTabIfVisible(bienesSelectors.bienes.labels.tabPropietarios);
    await expect
      .poll(async () => this.totalActiveOwnerPercentage(), {
        message: `Esperaba Total % propietarios activos = ${expected}.`
      })
      .toMatch(new RegExp(`^${this.escapeRegExp(expected)}(?:[,.]0+)?$`));
  }

  private async assertOwnerDateValidation(expectedValidation: RegExp): Promise<void> {
    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasOwnerDateValidation(expectedValidation), {
        message: `Esperaba validacion de fechas de propietario: ${expectedValidation}.`
      })
      .toBeTruthy();
  }

  private async trySaveBienOwnerDateValidationCase(
    bien: BienPrincipalTestData,
    owner: BienPropietarioTestData,
    fechaBaja: string | undefined,
    expectedValidation: RegExp
  ): Promise<void> {
    await this.navigateToBienesRegistro();
    await this.createBienPrincipal(bien);
    await this.openPropietariosTab();
    await this.addBienOwner(owner, fechaBaja);
    await this.clickSaveExpectingValidation();
    await this.assertOwnerDateValidation(expectedValidation);
    await this.discardCurrentTipoBienIfNeeded();
  }

  private async assertBienDocumentsButtonShowsCounter(): Promise<void> {
    const documentsButton = this.bienDocumentsButton();

    await expect(documentsButton).toBeVisible();

    const counter = documentsButton.locator(bienesSelectors.bienes.documentsCounter).first();

    if (await counter.isVisible().catch(() => false)) {
      await expect(counter).toContainText(/\d+/);
      return;
    }

    await expect(documentsButton).toContainText(/\d+/);
  }

  private async openBienDocuments(): Promise<void> {
    const documentsButton = this.bienDocumentsButton();

    await expect(documentsButton).toBeVisible();
    await documentsButton.click();
    await expect(this.page).toHaveTitle(/Documentos|Documents|Bienes/i);
  }

  private async createTipoCarga(data: TipoCargaItemTestData): Promise<void> {
    await this.click(bienesSelectors.newButton);
    await this.fillTipoCarga(data);
    await this.saveCurrentTipoBien();
    await this.assertTipoCargaFormContains(data);
  }

  private async createEditTipoCargaForSecurity(data: TipoCargaItemTestData): Promise<void> {
    await this.navigateToTiposCarga();
    await this.createTipoCarga(data);
    await this.assertTipoCargaVisibleInActiveList(data);
    await this.openTipoCarga(data);

    const editedData = {
      ...data,
      descripcion: `${data.descripcion} - Mod`
    };

    await this.updateTipoCargaDescription(editedData.descripcion);
    await this.assertTipoCargaVisibleInActiveList(editedData);
  }

  private async tryCreateDuplicatedTipoCarga(data: TipoCargaItemTestData): Promise<void> {
    await this.navigateToTiposCarga();
    await this.click(bienesSelectors.newButton);
    await this.fillTipoCarga(data);
    await this.clickSaveExpectingValidation();
  }

  private async fillTipoCarga(data: TipoCargaItemTestData): Promise<void> {
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.tiposCarga.codeInput,
      bienesSelectors.tiposCarga.labels.codigo,
      data.codigo
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.tiposCarga.descriptionInput,
      bienesSelectors.tiposCarga.labels.descripcion,
      data.descripcion
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.tiposCarga.sequenceInput,
      bienesSelectors.tiposCarga.labels.secuencia,
      data.secuencia
    );
    await this.setTipoCargaFavorSgr(data.cargaFavorSgr);
  }

  private async setTipoCargaFavorSgr(checked: boolean): Promise<void> {
    const checkbox = await this.inputBySelectorOrLabel(
      bienesSelectors.tiposCarga.cargaFavorSgrInput,
      bienesSelectors.tiposCarga.labels.cargaFavorSgr
    );

    await expect(checkbox).toBeVisible();

    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.check({ force: true });
    }
  }

  private async assertTipoCargaFormContains(data: TipoCargaItemTestData): Promise<void> {
    await expect(this.page.locator('body')).toContainText(data.codigo);
    await expect(this.page.locator('body')).toContainText(data.descripcion);
  }

  private async updateTipoCargaDescription(description: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.tiposCarga.descriptionInput,
      bienesSelectors.tiposCarga.labels.descripcion,
      description
    );
    await this.saveCurrentTipoBien();
    await expect(this.page.locator('body')).toContainText(description);
  }

  private async assertTipoCargaSgrFlagIsChecked(): Promise<void> {
    const checkbox = await this.inputBySelectorOrLabel(
      bienesSelectors.tiposCarga.cargaFavorSgrInput,
      bienesSelectors.tiposCarga.labels.cargaFavorSgr
    );

    await expect(checkbox).toBeChecked();
  }

  private async assertTipoCargaDuplicateCodeValidation(): Promise<void> {
    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasTipoCargaDuplicateCodeValidation(), {
        message: 'Esperaba error de unicidad por codigo duplicado en Tipo de Carga.'
      })
      .toBeTruthy();
  }

  private async assertTipoCargaVisibleInActiveList(data: TipoCargaItemTestData): Promise<void> {
    await this.navigateToTiposCarga();
    await this.searchInCurrentList(data.codigo);
    const row = this.tipoCargaRow(data).first();

    await expect(row).toBeVisible();
    await expect(row).toContainText(data.descripcion);
  }

  private async assertTipoCargaNotVisibleInActiveList(data: TipoCargaItemTestData): Promise<void> {
    await this.navigateToTiposCarga();
    await this.searchInCurrentList(data.codigo);
    await expect(this.tipoCargaRow(data)).toHaveCount(0);
  }

  private async openTipoCarga(data: TipoCargaItemTestData): Promise<void> {
    await this.navigateToTiposCarga();
    await this.searchInCurrentList(data.codigo);

    const row = this.tipoCargaRow(data).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async archiveCurrentTipoCarga(): Promise<void> {
    await this.openActionMenu();
    await this.page.locator(bienesSelectors.archiveMenuItem).first().click();

    const confirmButton = this.page.locator(bienesSelectors.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(this.page.locator(bienesSelectors.unarchiveButton).first()).toBeVisible({ timeout: 30000 });
  }

  private async createMotivoSolicitud(data: MotivoSolicitudItemTestData): Promise<void> {
    await this.click(bienesSelectors.newButton);
    await this.selectMotivoSolicitudField(
      bienesSelectors.motivosSolicitud.motivoInput,
      bienesSelectors.motivosSolicitud.labels.motivo,
      data.motivo
    );
    await this.assertSecondaryTypeFieldIsUsable(data.tipoSolicitud);
    await this.selectMotivoSolicitudField(
      bienesSelectors.motivosSolicitud.tipoSolicitudInput,
      bienesSelectors.motivosSolicitud.labels.tipoSolicitud,
      data.tipoSolicitud
    );
    await this.saveCurrentTipoBien();
    await this.assertMotivoSolicitudComputedName(data);
  }

  private async openMotivoSolicitud(data: MotivoSolicitudItemTestData): Promise<void> {
    await this.navigateToMotivosSolicitud();
    await this.searchInCurrentList(data.nombreCompletoEsperado);
    const row = this.motivoSolicitudRow(data.nombreCompletoEsperado).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async assertMotivoSolicitudVisibleInActiveList(data: MotivoSolicitudItemTestData): Promise<void> {
    await this.navigateToMotivosSolicitud();
    await this.searchInCurrentList(data.nombreCompletoEsperado);
    await expect(this.motivoSolicitudRow(data.nombreCompletoEsperado).first()).toBeVisible();
  }

  private async changeMotivoAndAssertSecondaryIsCleared(newMotivo: string, previousSecondaryValue: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.selectMotivoSolicitudField(
      bienesSelectors.motivosSolicitud.motivoInput,
      bienesSelectors.motivosSolicitud.labels.motivo,
      newMotivo
    );

    const secondaryValue = await this.motivoSolicitudSecondaryValue();

    expect(secondaryValue).not.toMatch(new RegExp(this.escapeRegExp(previousSecondaryValue), 'i'));
  }

  private async assertSecondaryTypeFieldIsUsable(expectedOption: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(
      bienesSelectors.motivosSolicitud.tipoSolicitudInput,
      bienesSelectors.motivosSolicitud.labels.tipoSolicitud
    );

    await expect(input).toBeVisible();
    await input.click();
    await input.fill(expectedOption);

    const option = this.autocompleteOptions()
      .filter({ hasText: new RegExp(this.escapeRegExp(expectedOption), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await this.isVisibleWithin(option, 5000)) {
      await expect(option).toBeVisible();
      return;
    }

    await input.press('Escape');
  }

  private async selectMotivoSolicitudField(selector: string, label: string, value: string): Promise<void> {
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

  private async assertMotivoSolicitudComputedName(data: MotivoSolicitudItemTestData): Promise<void> {
    await expect(this.page.locator('body')).toContainText(new RegExp(this.escapeRegExp(data.motivo), 'i'));
    await expect(this.page.locator('body')).toContainText(new RegExp(this.escapeRegExp(data.tipoSolicitud), 'i'));
  }

  private async motivoSolicitudSecondaryValue(): Promise<string> {
    const input = await this.inputBySelectorOrLabel(
      bienesSelectors.motivosSolicitud.tipoSolicitudInput,
      bienesSelectors.motivosSolicitud.labels.tipoSolicitud
    );

    return (await input.inputValue().catch(() => '')).trim();
  }
  private async navigateToRegistroPropiedad(): Promise<void> {
    await this.goto(env.actionUrls.registroPropiedad);
    await expect(this.page).toHaveTitle(bienesSelectors.registroPropiedad.pageTitleText);
    await expect(this.page.locator(bienesSelectors.newButton).first()).toBeVisible();
  }

  private async createRegistroPropiedad(data: RegistroPropiedadTestData): Promise<void> {
    await this.click(bienesSelectors.newButton);
    await this.fillRegistroPropiedad(data);
    await this.saveCurrentTipoBien();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(data.descripcion), 'i'));
    await this.assertRegistroPropiedadFormContains(data);
  }

  private async fillRegistroPropiedad(data: RegistroPropiedadTestData): Promise<void> {
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.codeInput,
      bienesSelectors.registroPropiedad.labels.codigo,
      data.codigo
    );
    await this.fillRegistroPropiedadDescription(data.descripcion);
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.addressInput,
      bienesSelectors.registroPropiedad.labels.direccion,
      data.direccion
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.postalCodeInput,
      bienesSelectors.registroPropiedad.labels.codigoPostal,
      data.codigoPostal
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.cityInput,
      bienesSelectors.registroPropiedad.labels.poblacion,
      data.poblacion
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.phoneInput,
      bienesSelectors.registroPropiedad.labels.telefono,
      data.telefono
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.emailInput,
      bienesSelectors.registroPropiedad.labels.email,
      data.email
    );
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.webInput,
      bienesSelectors.registroPropiedad.labels.web,
      data.web
    );
  }

  private async fillRegistroPropiedadDescription(value: string): Promise<void> {
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.descriptionInput,
      bienesSelectors.registroPropiedad.labels.descripcion,
      value
    );
  }

  private async assertRegistroPropiedadFormContains(data: RegistroPropiedadTestData): Promise<void> {
    await expect(this.page.locator('body')).toContainText(data.codigo);
    await expect(this.page.locator('body')).toContainText(data.descripcion);
    await expect(this.page.locator('body')).toContainText(data.codigoPostal);
    await expect(this.page.locator('body')).toContainText(data.email);
  }

  private async openRegistroPropiedad(description: string): Promise<void> {
    await this.navigateToRegistroPropiedad();
    await this.searchInCurrentList(description);

    const row = this.registroPropiedadRow(description).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async updateRegistroPropiedadDescription(description: string): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.fillRegistroPropiedadDescription(description);
    await this.saveCurrentTipoBien();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(description), 'i'));
  }

  private async archiveCurrentRegistroPropiedad(): Promise<void> {
    await this.openActionMenu();
    await this.page.locator(bienesSelectors.archiveMenuItem).first().click();

    const confirmButton = this.page.locator(bienesSelectors.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(this.page.locator(bienesSelectors.unarchiveButton).first()).toBeVisible({ timeout: 30000 });
  }

  private async assertRegistroPropiedadVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToRegistroPropiedad();
    await this.searchInCurrentList(description);
    await expect(this.registroPropiedadRow(description).first()).toBeVisible();
  }

  private async assertRegistroPropiedadNotVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToRegistroPropiedad();
    await this.searchInCurrentList(description);
    await expect(this.registroPropiedadRow(description)).toHaveCount(0);
  }

  private async trySaveRegistroPropiedadWithoutCode(data: RegistroPropiedadTestData): Promise<void> {
    await this.navigateToRegistroPropiedad();
    await this.click(bienesSelectors.newButton);
    await this.fillInputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.codeInput,
      bienesSelectors.registroPropiedad.labels.codigo,
      ''
    );
    await this.fillRegistroPropiedadDescription(`${data.descripcion} Sin Codigo`);
    await this.clickSaveExpectingValidation();
  }

  private async assertRegistroPropiedadCodeRequiredValidation(): Promise<void> {
    const codeInput = await this.inputBySelectorOrLabel(
      bienesSelectors.registroPropiedad.codeInput,
      bienesSelectors.registroPropiedad.labels.codigo
    );

    await expect(codeInput).toBeVisible();
    await expect(codeInput).toHaveValue('');
    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasRegistroPropiedadCodeRequiredValidation(), {
        message: 'Esperaba validacion de Cod. Registro obligatorio.'
      })
      .toBeTruthy();
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
    await expect
      .poll(
        async () => {
          if (!(await saveButton.isVisible().catch(() => false))) {
            return true;
          }

          return saveButton.isDisabled().catch(() => false);
        },
        { message: 'Esperaba que el formulario quedara guardado sin cambios pendientes.' }
      )
      .toBeTruthy();
  }

  private async clickSaveExpectingValidation(): Promise<void> {
    const saveButton = this.page.locator(bienesSelectors.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeVisible();
  }

  private async discardCurrentTipoBienIfNeeded(): Promise<void> {
    const discardButton = this.page.locator(bienesSelectors.discardButton).first();

    if (!(await discardButton.isVisible().catch(() => false))) {
      return;
    }

    await discardButton.click();

    const confirmButton = this.page.locator(bienesSelectors.confirmDiscardButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(this.page.locator(bienesSelectors.saveButton).first()).toBeHidden({ timeout: 30000 });
  }

  private async confirmDialogIfVisible(): Promise<void> {
    const confirmButton = this.page.locator(bienesSelectors.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
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

    await this.page.keyboard.press('Escape');
  }

  private async clearCurrentSearch(): Promise<void> {
    const removeButtons = this.page.locator(bienesSelectors.bienes.searchRemoveButtons);

    while ((await removeButtons.count()) > 0 && (await removeButtons.first().isVisible().catch(() => false))) {
      await removeButtons.first().click();
    }

    const searchInput = this.page.locator(bienesSelectors.searchInput).first();

    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('');
      await this.page.keyboard.press('Enter');
    }
  }

  private async applyPredefinedFilter(filterName: RegExp): Promise<void> {
    const filterButton = this.page.locator(bienesSelectors.filterButton).first();

    await expect(filterButton).toBeVisible();
    await filterButton.click();

    const filterOption = this.page.locator(bienesSelectors.bienes.filterOption).filter({ hasText: filterName }).first();

    await expect(filterOption).toBeVisible();
    await filterOption.click();
    await this.assertActiveSearchFacet(filterName);
  }

  private async applyGroupBy(groupName: RegExp): Promise<void> {
    const filterButton = this.page.locator(bienesSelectors.filterButton).first();

    await expect(filterButton).toBeVisible();
    await filterButton.click();

    const groupByButton = this.page.locator(bienesSelectors.bienes.groupByButton).filter({ hasText: /Agrupar|Group/i }).first();

    if (await groupByButton.isVisible().catch(() => false)) {
      await groupByButton.click();
    }

    const groupOption = this.page.locator(bienesSelectors.bienes.filterOption).filter({ hasText: groupName }).first();

    await expect(groupOption).toBeVisible();
    await groupOption.click();
    await this.assertActiveSearchFacet(groupName);
  }

  private async assertActiveSearchFacet(text: RegExp): Promise<void> {
    await expect(this.page.locator(bienesSelectors.bienes.activeSearchItems).filter({ hasText: text }).first()).toBeVisible();
  }

  private commonSearchToken(data: BienBusquedaFiltrosTestData): string {
    const parts = data.pisoOcupado.descripcion.split(' ');
    return parts[parts.length - 1] || data.pisoOcupado.descripcion;
  }

  private groupingSearchToken(data: BienAgrupacionTestData): string {
    const parentParts = data.agrupadora.descripcion.split(' ');
    return parentParts[parentParts.length - 1] || data.agrupadora.descripcion;
  }

  private async enterEditModeIfNeeded(): Promise<void> {
    const saveButton = this.page.locator(bienesSelectors.saveButton).first();

    if (await saveButton.isVisible().catch(() => false)) {
      return;
    }

    const editableTitle = this.page.locator('h1 input:enabled, div[name="name"] input:enabled').first();

    if (await editableTitle.isVisible().catch(() => false)) {
      return;
    }

    const editButton = this.page.locator(bienesSelectors.editButton).first();

    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
    }
  }

  private async openActionMenu(): Promise<void> {
    const actionButton = this.page.locator(bienesSelectors.actionButton).first();

    await expect(actionButton).toBeVisible();
    await actionButton.click();
  }

  private tipoBienRow(description: string): Locator {
    return this.page.locator(bienesSelectors.rows).filter({ hasText: new RegExp(this.escapeRegExp(description), 'i') });
  }

  private registroPropiedadRow(description: string): Locator {
    return this.page.locator(bienesSelectors.rows).filter({ hasText: new RegExp(this.escapeRegExp(description), 'i') });
  }

  private motivoSolicitudRow(nombreCompleto: string): Locator {
    return this.page.locator(bienesSelectors.rows).filter({ hasText: new RegExp(this.escapeRegExp(nombreCompleto), 'i') });
  }

  private tipoCargaRow(data: TipoCargaItemTestData): Locator {
    return this.page
      .locator(bienesSelectors.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(data.codigo), 'i') })
      .filter({ hasText: new RegExp(this.escapeRegExp(data.descripcion), 'i') });
  }

  private bienPrincipalRow(description: string): Locator {
    return this.page.locator(bienesSelectors.rows).filter({ hasText: new RegExp(this.escapeRegExp(description), 'i') });
  }

  private bienDocumentsButton(): Locator {
    return this.page.locator(bienesSelectors.bienes.documentsButton).first();
  }

  private async fillInputBySelectorOrLabel(selector: string, label: string, value: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(input).toHaveValue(value);
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

  private async selectFirstAutocompleteOptionIfVisible(
    selector: string,
    label: string,
    candidates: string[] = []
  ): Promise<void> {
    const input = await this.optionalInputBySelectorOrLabel(selector, label);

    if (!input) {
      return;
    }

    for (const candidate of candidates) {
      await input.click();
      await input.fill(candidate);

      const candidateOption = this.autocompleteOptions()
        .filter({ hasText: new RegExp(this.escapeRegExp(candidate), 'i') })
        .filter({ hasNotText: /Crear|Buscar/i })
        .first();

      if (await this.isVisibleWithin(candidateOption, 5000)) {
        await candidateOption.click();
        return;
      }
    }

    await input.click();
    await input.fill('a');

    const option = this.autocompleteOptions()
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await this.isVisibleWithin(option, 5000)) {
      await option.click();
      return;
    }

    await input.press('Tab');
  }

  private async assertAutocompleteHasNoRecords(selector: string, label: string, value: string): Promise<void> {
    const input = await this.inputBySelectorOrLabel(selector, label);

    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(this.page.locator(bienesSelectors.solicitudesTasacion.noRecordsOption).first()).toBeVisible();
    await input.press('Escape');
    await input.fill('');
  }

  private autocompleteOptions(): Locator {
    return this.page.locator(
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"]'
    );
  }

  private async assertTasacionState(expectedState: string): Promise<void> {
    const input = this.page.locator(bienesSelectors.solicitudesTasacion.estadoInput).first();

    if (await input.isVisible().catch(() => false)) {
      await expect(input).toHaveValue(new RegExp(this.escapeRegExp(expectedState), 'i'));
      return;
    }

    const value = this.page.locator(bienesSelectors.solicitudesTasacion.estadoValue).first();

    if (await value.isVisible().catch(() => false)) {
      await expect(value).toContainText(new RegExp(this.escapeRegExp(expectedState), 'i'));
      return;
    }

    await expect(this.page.locator('body')).toContainText(new RegExp(this.escapeRegExp(expectedState), 'i'));
  }

  private async setBienCheckbox(selector: string, label: string, checked: boolean): Promise<void> {
    const checkbox = await this.checkboxBySelectorOrLabel(selector, label);

    await expect(checkbox).toBeVisible();

    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.check({ force: true });
    }
  }

  private async currentOwnerRow(): Promise<Locator> {
    const selectedRow = this.page.locator(bienesSelectors.bienes.propietarios.selectedRow).first();

    if (await selectedRow.isVisible().catch(() => false)) {
      return selectedRow;
    }

    const rows = this.page.locator(bienesSelectors.bienes.propietarios.rows);
    const rowCount = await rows.count();

    if (rowCount > 0) {
      return rows.nth(rowCount - 1);
    }

    throw new Error('No se encontro la linea de propietario recien creada.');
  }

  private async currentAgrupacionRow(): Promise<Locator> {
    const selectedRow = this.page.locator(bienesSelectors.bienes.agrupacion.selectedRow).first();

    if (await selectedRow.isVisible().catch(() => false)) {
      return selectedRow;
    }

    const rows = this.page.locator(bienesSelectors.bienes.agrupacion.rows);
    const rowCount = await rows.count();

    if (rowCount > 0) {
      return rows.nth(rowCount - 1);
    }

    throw new Error('No se encontro la linea de agrupacion recien creada.');
  }

  private async currentCargaRow(): Promise<Locator> {
    const selectedRow = this.page.locator(bienesSelectors.bienes.cargas.selectedRow).first();

    if (await selectedRow.isVisible().catch(() => false)) {
      return selectedRow;
    }

    const rows = this.page.locator(bienesSelectors.bienes.cargas.rows);
    const rowCount = await rows.count();

    if (rowCount > 0) {
      return rows.nth(rowCount - 1);
    }

    throw new Error('No se encontro la linea de carga recien creada.');
  }

  private async currentTasacionRow(): Promise<Locator> {
    const selectedRow = this.page.locator(bienesSelectors.bienes.tasaciones.selectedRow).first();

    if (await selectedRow.isVisible().catch(() => false)) {
      return selectedRow;
    }

    const rows = this.page.locator(bienesSelectors.bienes.tasaciones.rows);
    const rowCount = await rows.count();

    if (rowCount > 0) {
      return rows.nth(rowCount - 1);
    }

    throw new Error('No se encontro la linea de tasacion recien creada.');
  }

  private async fillRowInput(row: Locator, selector: string, value: string): Promise<void> {
    const input = row.locator(selector).first();

    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async selectRowAutocomplete(row: Locator, selector: string, value: string): Promise<void> {
    const input = row.locator(selector).first();

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

  private async setRowCheckbox(row: Locator, selector: string, checked: boolean): Promise<void> {
    const checkbox = row.locator(selector).first();

    if (!(await checkbox.isVisible().catch(() => false))) {
      return;
    }

    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.check({ force: true });
    }
  }

  private async totalActiveOwnerPercentage(): Promise<string> {
    const input = this.page.locator(bienesSelectors.bienes.propietarios.totalPorcentajeInput).first();

    if (await input.isVisible().catch(() => false)) {
      return this.normalizePercentage(await input.inputValue());
    }

    const byLabel = this.page.locator(
      this.inputNearLabelXPath(bienesSelectors.bienes.labels.totalPorcentajePropietariosActivos)
    ).first();

    if (await byLabel.isVisible().catch(() => false)) {
      const inputValue = await byLabel.inputValue().catch(() => '');
      const textValue = inputValue || (await byLabel.textContent()) || '';
      return this.normalizePercentage(textValue);
    }

    const valueContainer = this.page.locator(bienesSelectors.bienes.propietarios.totalPorcentajeValue).first();
    const text = (await valueContainer.textContent().catch(() => '')) || '';

    return this.normalizePercentage(text);
  }

  private async fincaAgrupadoraValue(): Promise<string> {
    const input = this.page.locator(bienesSelectors.bienes.agrupacion.fincaAgrupadoraInput).first();

    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue()).trim();
    }

    const byLabel = this.page.locator(
      this.inputNearLabelXPath(bienesSelectors.bienes.labels.fincaAgrupadora)
    ).first();

    if (await byLabel.isVisible().catch(() => false)) {
      const inputValue = await byLabel.inputValue().catch(() => '');
      return (inputValue || (await byLabel.textContent()) || '').trim();
    }

    return '';
  }

  private cargaRow(description: string): Locator {
    return this.page
      .locator(bienesSelectors.bienes.cargas.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(description), 'i') });
  }

  private async mortgageChargeTotal(row: Locator): Promise<string> {
    const input = row.locator(bienesSelectors.bienes.cargas.totalResponsabilidadInput).first();

    if (await input.isVisible().catch(() => false)) {
      return this.normalizeMoney(await input.inputValue());
    }

    const cell = row.locator(bienesSelectors.bienes.cargas.totalResponsabilidadCell).first();
    const text = (await cell.textContent().catch(() => '')) || '';

    return this.normalizeMoney(text);
  }

  private tasacionRow(data: BienTasacionManualTestData): Locator {
    const row = this.page.locator(bienesSelectors.bienes.tasaciones.rows);

    if (this.manualAppraisalName) {
      return row.filter({ hasText: new RegExp(this.escapeRegExp(this.manualAppraisalName), 'i') });
    }

    return row.filter({ hasText: new RegExp(this.escapeRegExp(data.fechaValor), 'i') });
  }

  private async appraisalSequence(row: Locator): Promise<string> {
    const cell = row.locator(bienesSelectors.bienes.tasaciones.sequenceCell).first();
    return ((await cell.textContent().catch(() => '')) || '').trim();
  }

  private async manualAppraisalValue(row: Locator): Promise<string> {
    const input = row.locator(bienesSelectors.bienes.tasaciones.valorInput).first();

    if (await input.isVisible().catch(() => false)) {
      return this.normalizeMoney(await input.inputValue());
    }

    return this.normalizeMoney((await row.textContent().catch(() => '')) || '');
  }

  private normalizePercentage(value: string): string {
    const match = value.replace(/\s/g, '').match(/\d+(?:[,.]\d+)?/);
    return match ? match[0].replace(',', '.') : '';
  }

  private normalizeMoney(value: string): string {
    const numeric = value.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    const match = numeric.match(/\d+(?:\.\d+)?/);

    return match ? Number(match[0]).toString() : '';
  }

  private async assertBienCheckboxIsChecked(selector: string, label: string): Promise<void> {
    const checkbox = await this.checkboxBySelectorOrLabel(selector, label);

    await expect(checkbox).toBeChecked();
  }

  private async openBienTabIfVisible(tabName: string): Promise<void> {
    const tab = this.page.getByRole('tab', { name: new RegExp(this.escapeRegExp(tabName), 'i') }).first();

    if (await tab.isVisible().catch(() => false)) {
      await tab.click();
    }
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

  private async optionalInputBySelectorOrLabel(selector: string, label: string): Promise<Locator | undefined> {
    const bySelector = this.page.locator(selector).first();

    if (await bySelector.isVisible().catch(() => false)) {
      return bySelector;
    }

    const byTextbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byTextbox.isVisible().catch(() => false)) {
      return byTextbox;
    }

    const byLabel = this.page.locator(this.inputNearLabelXPath(label)).first();

    if (await byLabel.isVisible().catch(() => false)) {
      return byLabel;
    }

    return undefined;
  }

  private async assertFieldValueIfVisible(selector: string, label: string, expectedValue: string): Promise<void> {
    const input = await this.optionalInputBySelectorOrLabel(selector, label);

    if (!input) {
      await expect(this.page.locator('body')).toContainText(expectedValue);
      return;
    }

    await expect(input).toHaveValue(new RegExp(this.escapeRegExp(expectedValue)));
  }

  private async isVisibleWithin(locator: Locator, timeout: number): Promise<boolean> {
    return locator.waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);
  }

  private inputNearLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::*[(self::input and not(@type="checkbox") and not(@type="radio") and not(@type="hidden")) or self::textarea or @role="combobox"][1]`;
  }

  private async checkboxBySelectorOrLabel(selector: string, label: string): Promise<Locator> {
    const bySelector = this.page.locator(selector).first();

    if (await bySelector.isVisible().catch(() => false)) {
      return bySelector;
    }

    return this.page.locator(this.checkboxNearLabelXPath(label)).first();
  }

  private checkboxNearLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::input[@type="checkbox"][1]`;
  }

  private async hasDescriptionRequiredValidation(): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(bienesSelectors.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return invalidFieldsCount > 0 || /descripci[oó]n.*obligator|required|requerid/i.test(text);
  }

  private async hasRegistroPropiedadCodeRequiredValidation(): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(bienesSelectors.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return invalidFieldsCount > 0 || /cod\.?\s*registro|c[oó]digo|obligator|required|requerid/i.test(text);
  }

  private async hasTipoCargaDuplicateCodeValidation(): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const text = [...validationText, pageText].join(' ');

    return /duplic|existe|unique|unicidad|[uú]nico|ya existe|c[oó]digo/i.test(text);
  }

  private async hasActiveOwnerPercentageAboveOneHundredValidation(): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(bienesSelectors.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return (
      invalidFieldsCount > 0 ||
      /propietarios?.*(100|cien)|porcentaje.*(100|cien)|supera|superior|excede|mayor/i.test(text)
    );
  }

  private async hasOwnerDateValidation(expectedValidation: RegExp): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(bienesSelectors.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return expectedValidation.test(text) || invalidFieldsCount > 0;
  }

  private async hasRequiredFieldsValidation(): Promise<boolean> {
    const validationText = await this.page.locator(bienesSelectors.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(bienesSelectors.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return invalidFieldsCount > 0 || /obligator|required|requerid|faltan|completar campos/i.test(text);
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}


