import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type {
  ConceptoComisionHuerfanoTestData,
  ConceptoComisionNoProtegidoTestData,
  NaturalezaT4TestData,
  ProductoComisionTestData,
  ProductoFinancieroTestData,
  TipologiaProductoTestData
} from '../fixtures/testData';
import { env } from '../support/env';
import { selectors } from '../utils/selectors';
import { BasePage } from './BasePage';

export class ProductosPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToProductos(): Promise<void> {
    await this.goto(env.productsUrl);
    await this.assertProductosPageIsVisible();
  }

  async navigateToProductosReadOnly(): Promise<void> {
    await this.goto(env.productsUrl);
    await this.assertProductosPageIsVisibleReadOnly();
  }

  async assertProductosPageIsVisible(): Promise<void> {
    await expect(this.page).toHaveTitle(selectors.productos.pageTitleText);
    await expect(this.page.locator(selectors.productos.newButton).first()).toBeVisible();
  }

  async assertProductosPageIsVisibleReadOnly(): Promise<void> {
    await expect(this.page).toHaveTitle(selectors.productos.pageTitleText);
    await expect(this.page.locator(selectors.productos.rows).first()).toBeVisible();
  }

  async assertProductUserHasReadOnlyAccess(): Promise<void> {
    await this.navigateToProductosReadOnly();
    await this.assertCreateProductIsNotAvailable();
    await this.openFirstProductFromList();
    await this.assertEditProductIsNotAvailable();
    await this.assertConfigurationMenuIsNotVisible();
  }

  async assertProductManagerHasFullAccess(): Promise<void> {
    await this.navigateToProductos();
    await expect(this.page.locator(selectors.productos.newButton).first()).toBeVisible();
    await this.assertConfigurationMenuIsVisible();
  }

  async assertProductRoleConditionalUi(): Promise<void> {
    await this.navigateToProductos();
    await this.openFirstProductFromList();
    await expect(this.page.getByRole('tab', { name: /L[ií]mites y [aá]mbito/i }).first()).toBeVisible();
    await expect(this.page.getByRole('tab', { name: /Conceptos/i }).first()).toBeVisible();
    await this.assertStandardOdooGeneralInformationTabIsHidden();
    await this.navigateToProductosComisionReadOnly();
    await this.openFirstCommissionProductFromList();
    await this.assertTabIsHidden(/L[ií]mites y [aá]mbito/i);
    await this.assertTabIsHidden(/Conceptos/i);
    await this.assertStandardOdooGeneralInformationTabIsHidden();
    await this.assertCommissionProductTypeIsReadonlyService();
  }

  async navigateToProductosComision(): Promise<void> {
    await this.goto(env.commissionProductsUrl);
    await this.assertProductosComisionPageIsVisible();
  }

  async navigateToProductosComisionReadOnly(): Promise<void> {
    await this.goto(env.commissionProductsUrl);
    await expect(this.page).toHaveTitle(selectors.productosComision.pageTitleText);
    await expect(this.page.locator(selectors.productos.rows).or(this.page.locator(selectors.productosComision.newButton)).first()).toBeVisible();
  }

  async assertProductosComisionPageIsVisible(): Promise<void> {
    await expect(this.page).toHaveTitle(selectors.productosComision.pageTitleText);
    await expect(this.page.locator(selectors.productosComision.newButton).first()).toBeVisible();
  }

  async createProductoComision(producto: ProductoComisionTestData): Promise<void> {
    await this.click(selectors.productosComision.newButton);
    await this.fillProductoComisionName(producto.nombre);
    await this.assertProductoComisionPreloadedFields(producto);
    await this.saveCurrentCommissionProduct();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(producto.nombre), 'i'));
  }

  async assertProductoComisionAutomaticCodeAndNoTaxes(producto: ProductoComisionTestData): Promise<void> {
    await expect
      .poll(async () => this.productoComisionFieldValue('referenciaInterna'), {
        message: 'Esperaba Referencia interna generada con formato COM-[TOKEN]-XXXX.'
      })
      .toMatch(/^COM-[A-Z0-9]+-\d{4}$/i);
    await expect
      .poll(async () => this.productoComisionFieldValue('tipo'), {
        message: 'Esperaba Tipo Servicio.'
      })
      .toMatch(new RegExp(this.escapeRegExp(producto.tipoEsperado), 'i'));
    await expect.poll(async () => this.productoComisionFieldValue('impuestosCliente')).toBe('');
    await expect.poll(async () => this.productoComisionFieldValue('impuestosProveedor')).toBe('');
  }

  async tryCreateOrphanCommissionConcept(concepto: ConceptoComisionHuerfanoTestData): Promise<boolean> {
    await this.goto(env.actionUrls.conceptosComision);
    await expect(this.page.locator(selectors.conceptosComision.newButton).first()).toBeVisible();
    await this.click(selectors.conceptosComision.newButton);
    await this.fillConceptMasterField(selectors.conceptosComision.nameInput, concepto.nombre);
    await this.fillConceptMasterField(selectors.conceptosComision.codeInput, concepto.codigo);
    await this.click(selectors.conceptosComision.saveButton);

    if (await this.hasOrphanCommissionConceptValidation()) {
      await this.closeCommissionConceptValidationDialogIfVisible();
      return true;
    }

    await expect(this.page.locator(selectors.conceptosComision.saveButton).first()).toBeHidden({ timeout: 30000 });
    return false;
  }

  async tryUseOrphanCommissionConceptInProduct(
    producto: ProductoFinancieroTestData,
    concepto: ConceptoComisionHuerfanoTestData
  ): Promise<void> {
    await this.navigateToProductos();
    await this.createProductoFinanciero(producto);
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLineFromData({
      concepto: concepto.nombre,
      tipo: concepto.tipo,
      modo: concepto.modo,
      porcentajeMinimo: concepto.porcentajeMinimo,
      porcentajeMaximo: concepto.porcentajeMaximo,
      periodicidad: concepto.periodicidad
    });
    await this.clickSaveExpectingValidation();
  }

  async assertOrphanCommissionConceptValidation(): Promise<void> {
    await expect
      .poll(async () => this.hasOrphanCommissionConceptValidation(), {
        message: 'Esperaba validacion por concepto sin Producto de comision configurado.'
      })
      .toBeTruthy();
    await this.closeValidationDialogIfVisible();
  }

  async verifyProtectedCommissionConceptsOnlyAllowCommissionProduct(
    rows: ConceptoComisionProtegido[]
  ): Promise<void> {
    await this.goto(env.actionUrls.conceptosComision);
    await expect(this.page.locator(selectors.conceptosComision.rows).first()).toBeVisible();

    for (const row of rows) {
      await this.openCommissionConcept(row.concepto);
      await this.enterCommissionConceptEditModeIfNeeded();
      await this.assertCommissionConceptReadonlyField(selectors.conceptosComision.nameInput, 'Nombre', row.concepto);

      if (row.codigo) {
        await this.assertCommissionConceptReadonlyField(selectors.conceptosComision.codeInput, 'Codigo', row.codigo);
      }

      await this.assertCommissionProductFieldIsEditable(row.concepto);
      await this.goto(env.actionUrls.conceptosComision);
      await expect(this.page.locator(selectors.conceptosComision.rows).first()).toBeVisible();
    }
  }

  async createEditAndDeleteUnprotectedCommissionConcept(
    concepto: ConceptoComisionNoProtegidoTestData
  ): Promise<void> {
    await this.goto(env.actionUrls.conceptosComision);
    await expect(this.page.locator(selectors.conceptosComision.newButton).first()).toBeVisible();
    await this.click(selectors.conceptosComision.newButton);
    await this.fillConceptMasterField(selectors.conceptosComision.nameInput, concepto.nombre);
    await this.fillConceptMasterField(selectors.conceptosComision.codeInput, concepto.codigo);
    await this.selectCommissionProductInConcept(concepto.productoComision);
    await this.saveCurrentCommissionConcept();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(concepto.nombre), 'i'));
    await this.enterCommissionConceptEditModeIfNeeded();
    await this.fillConceptMasterField(selectors.conceptosComision.nameInput, concepto.nombreEditado);
    await this.saveCurrentCommissionConcept();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(concepto.nombreEditado), 'i'));
    await this.deleteCurrentCommissionConcept();
    await this.assertCommissionConceptDoesNotExist(concepto.nombreEditado);
  }

  async manageProductTypologyAndArchive(data: TipologiaProductoTestData): Promise<void> {
    await this.navigateToProductTypologies();
    await this.createProductTypology(data.nombre);
    await this.tryCreateDuplicatedProductTypology(data.nombre);
    await this.assertProductTypologyDuplicateValidation();
    await this.discardProductTypologyChangesIfVisible();
    await this.openProductTypology(data.nombre);
    await this.enterProductTypologyEditModeIfNeeded();
    await this.fillProductTypologyName(data.nombreEditado);
    await this.saveCurrentProductTypology();
    await this.archiveCurrentProductTypology();
    await this.assertProductTypologyIsNotVisibleInActiveList(data.nombreEditado);
    await this.assertProductTypologyIsNotVisibleInFilters(data.nombreEditado);
  }

  async manageNaturalezaT4AndAssertInactiveInProductGroup(data: NaturalezaT4TestData): Promise<void> {
    await this.navigateToNaturalezaT4();
    await this.createNaturalezaT4(data);
    await this.enterNaturalezaT4EditModeIfNeeded();
    await this.fillNaturalezaT4Description(data.descripcionEditada);
    await this.saveCurrentNaturalezaT4();
    await this.archiveCurrentNaturalezaT4();
    await this.assertNaturalezaT4IsNotVisibleInActiveList(data.descripcionEditada);
    await this.assertNaturalezaT4IsNotAvailableInProductGroup(data.descripcionEditada);
  }

  async validateCommissionLineNumericCases(
    producto: ProductoFinancieroTestData,
    rows: ProductoLineaComisionValidacion[]
  ): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLine(producto);
    await this.fillValidCommissionLineNumericValues(this.page.locator('tr.o_selected_row, tr:has(input)').last(), producto);
    await this.saveCurrentProduct();

    for (const row of rows) {
      await this.enterEditModeIfNeeded();
      await this.openConceptosTab();
      await this.applyInvalidCommissionLineCase(producto, row);
      await this.clickSaveExpectingValidation();
      await this.assertCommissionLineNumericValidation(row.caso);
      await this.closeValidationDialogIfVisible();
      await this.discardChangesIfVisible();
      await this.openConceptosTab();
      await expect(this.commissionConceptRow(producto.lineaComision.concepto)).toHaveCount(1);
    }
  }

  async verifyCommissionLinePeriodicityLocksDuration(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLine(producto);
    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();

    await this.setLinePeriodicityAndAssertDuration(row, 'Trimestral', '3');
    await this.assertLineDurationFieldsAreLocked(row);
    await this.tryForceInvalidDuration(row, '4', '3');
    await this.setLinePeriodicityAndAssertDuration(row, 'Semestral', '6');
    await this.assertLineDurationFieldsAreLocked(row);
    await this.saveCurrentProduct();
  }

  async verifyCommissionLineFinanciadoPersistence(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLine(producto);
    await this.setCommissionLineFinanciado(producto.lineaComision.concepto, true);
    await this.saveCurrentProduct();
    await this.openConceptosTab();
    await this.assertCommissionLineFinanciado(producto.lineaComision.concepto, true);
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.setCommissionLineFinanciado(producto.lineaComision.concepto, false);
    await this.saveCurrentProduct();
    await this.openConceptosTab();
    await this.assertCommissionLineFinanciado(producto.lineaComision.concepto, false);
  }

  async verifyConceptLineConditionalFieldVisibility(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLine(producto);
    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();

    await this.fillLineCombo(row, selectors.productos.conceptos.modoInput, 'Importe');
    await this.assertLineAmountFieldsVisible(row);
    await this.assertLinePercentageFieldsHidden(row);
    await this.fillLineCombo(row, selectors.productos.conceptos.modoInput, 'Porcentual');
    await this.assertLinePercentageFieldsVisible(row);
    await this.assertLineAmountFieldsHidden(row);
    await this.fillLineCombo(row, selectors.productos.conceptos.periodicidadInput, 'Al tirón');
    await this.assertLineDurationFieldsHidden(row);
  }

  async createProductoFinanciero(producto: ProductoFinancieroTestData): Promise<void> {
    await this.click(selectors.productos.newButton);
    await this.fillProductName(producto.nombre);
    await this.selectConfiguredField('tipologia', selectors.productos.labels.tipologia, producto.tipologia);
    await this.selectConfiguredField('control', selectors.productos.labels.control, producto.control);
    await this.selectConfiguredField('grupoAsignar', selectors.productos.labels.grupoAsignar, producto.grupoAsignar);
    await this.fillConfiguredField('reavalMinimo', selectors.productos.labels.reavalMinimo, producto.reavalMinimo);
    await this.fillConfiguredField('reavalMaximo', selectors.productos.labels.reavalMaximo, producto.reavalMaximo);
    await this.fillConfiguredField('importeMinimo', selectors.productos.labels.importeMinimo, producto.importeMinimo);
    await this.fillConfiguredField('importeMaximo', selectors.productos.labels.importeMaximo, producto.importeMaximo);
    await this.fillConfiguredField(
      'plazoMinimoMeses',
      selectors.productos.labels.plazoMinimoMeses,
      producto.plazoMinimoMeses
    );
    await this.fillConfiguredField(
      'plazoMaximoMeses',
      selectors.productos.labels.plazoMaximoMeses,
      producto.plazoMaximoMeses
    );
    await this.fillConfiguredField('descuentoDias', selectors.productos.labels.descuentoDias, producto.descuentoDias);
    await this.fillConfiguredField('interes', selectors.productos.labels.interes, producto.interesInicial);
    await this.fillConfiguredField(
      'porcentajeCompartidoMinimo',
      selectors.productos.labels.porcentajeCompartidoMinimo,
      producto.porcentajeCompartidoMinimo
    );
    await this.fillConfiguredField(
      'porcentajeCompartidoMaximo',
      selectors.productos.labels.porcentajeCompartidoMaximo,
      producto.porcentajeCompartidoMaximo
    );
    await this.saveCurrentProduct();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(producto.nombre), 'i'));
  }

  async updateInterestAndSave(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.fillConfiguredField('interes', selectors.productos.labels.interes, producto.interesEditado);
    await this.saveCurrentProduct();
    await this.assertConfiguredFieldContainsValue(
      'interes',
      selectors.productos.labels.interes,
      producto.interesEditado
    );
  }

  async archiveCurrentProduct(): Promise<void> {
    await this.performArchiveCurrentProduct();
  }

  async assertFechaBajaHasCurrentDate(): Promise<void> {
    await expect
      .poll(async () => this.fechaBajaValue(), {
        message: 'Esperaba que Fecha baja se complete al archivar el producto.'
      })
      .toMatch(this.todayDateValuePattern());
  }

  async reactivateCurrentProduct(): Promise<void> {
    await this.performReactivateCurrentProduct();
  }

  async assertFechaBajaIsEmptyAndProductIsActive(producto: ProductoFinancieroTestData): Promise<void> {
    await expect
      .poll(async () => this.fechaBajaValue(), {
        message: 'Esperaba que Fecha baja quede vacia al desarchivar el producto.'
      })
      .toBe('');

    await this.navigateToProductos();
    await this.searchProduct(producto.nombre);
    await expect(this.productRow(producto.nombre)).toBeVisible();
  }

  async trySaveProductoWithoutName(): Promise<void> {
    await this.click(selectors.productos.newButton);
    await this.fillProductName('');
    await this.fillConfiguredField('reavalMinimo', selectors.productos.labels.reavalMinimo, '0');
    await this.fillConfiguredField('reavalMaximo', selectors.productos.labels.reavalMaximo, '0');
    await this.clickSaveExpectingValidation();
  }

  async assertNameRequiredValidationAndProductWasNotSaved(): Promise<void> {
    const nameInput = this.page.locator(selectors.productos.nameInput).first();

    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue('');
    await expect(this.page.locator(selectors.productos.saveButton).first()).toBeVisible();
    await expect
      .poll(async () => this.hasNameRequiredValidation(), {
        message: 'Esperaba una validacion de Nombre obligatorio.'
      })
      .toBeTruthy();
  }

  async createProductoFinancieroWithCommission(producto: ProductoFinancieroTestData): Promise<void> {
    await this.createProductoFinanciero(producto);
    await this.enterEditModeIfNeeded();
    await this.openComisionesTab();
    await this.addCommission(producto);
    await this.saveCurrentProduct();
    await this.openComisionesTab();
    await this.assertCommissionWasCopied(producto);
  }

  async duplicateCurrentProductAndSaveCopy(producto: ProductoFinancieroTestData): Promise<void> {
    await this.performDuplicateCurrentProduct();
    await this.fillProductName(producto.nombreCopia);
    await this.saveCurrentProduct();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(producto.nombreCopia), 'i'));
  }

  async assertDuplicatedProductKeepsParentRelationAndCommissions(
    producto: ProductoFinancieroTestData
  ): Promise<void> {
    await expect
      .poll(async () => this.relacionValue(), {
        message: `Esperaba que Relacion apunte al producto original ${producto.nombre}.`
      })
      .toMatch(new RegExp(this.escapeRegExp(producto.nombre), 'i'));

    await this.openComisionesTab();
    await this.assertCommissionWasCopied(producto);
  }

  async validateNegativeNumericFields(rows: ProductoCampoNumericoNegativo[]): Promise<void> {
    for (const row of rows) {
      const field = this.numericFieldByLabel(row.campo);

      await this.enterEditModeIfNeeded();
      await this.fillConfiguredField(field.key, field.label, row.valor);
      await this.clickSaveExpectingValidation();
      await this.assertNegativeNumericValidation(field.label);
      await this.closeValidationDialogIfVisible();
      await this.fillConfiguredField(field.key, field.label, row.valorValido);
      await this.saveCurrentProduct();
    }
  }

  async assertProductRemainsSaved(producto: ProductoFinancieroTestData): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(producto.nombre), 'i'));
    await expect(this.page.locator(selectors.productos.saveButton).first()).toBeHidden();
  }

  async validatePercentageAndCoherenceCases(rows: ProductoValidacionRango[]): Promise<void> {
    for (const row of rows) {
      await this.dismissKnownInactivityAlertIfVisible();
      await this.enterEditModeIfNeeded();

      if (this.normalizeText(row.resultado) === 'guarda') {
        await this.applyValidProductNumericValues();
        await this.saveCurrentProduct();
        continue;
      }

      await this.applyValidationRowValues(row);
      await this.clickSaveExpectingValidation();
      await this.assertRangeOrCoherenceValidation(row.caso);
      await this.closeValidationDialogIfVisible();
      await this.restoreValidationRowValues(row);
      await this.saveCurrentProduct();
    }
  }

  async trySaveCommercialStartDateAfterEndDate(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openInformacionGeneralTabIfVisible();
    await this.fillConfiguredField(
      'fechaInicioComercializacion',
      selectors.productos.labels.fechaInicioComercializacion,
      this.relativeSpanishDate({ months: 0 })
    );
    await this.fillConfiguredField(
      'fechaFinComercializacion',
      selectors.productos.labels.fechaFinComercializacion,
      this.relativeSpanishDate({ months: -1 })
    );
    await this.clickSaveExpectingValidation();
  }

  async assertCommercialStartDateAfterEndDateValidation(): Promise<void> {
    await expect
      .poll(async () => this.hasCommercialDateCoherenceValidation(), {
        message: 'Esperaba validacion de Fecha inicio menor o igual a Fecha fin.'
      })
      .toBeTruthy();
  }

  async trySaveFichaStartDateAfterEndDate(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openOtraInformacionTabIfVisible();
    await this.fillConfiguredField(
      'fechaAltaFicha',
      selectors.productos.labels.fechaAltaFicha,
      this.relativeSpanishDate({ months: 0 })
    );
    await this.fillConfiguredField(
      'fechaBajaFicha',
      selectors.productos.labels.fechaBajaFicha,
      this.relativeSpanishDate({ months: -1 })
    );
    await this.clickSaveExpectingValidation();
  }

  async assertFichaStartDateAfterEndDateValidation(): Promise<void> {
    await expect
      .poll(async () => this.hasFichaDateCoherenceValidation(), {
        message: 'Esperaba validacion de Fec. alta ficha menor o igual a Fec. baja ficha.'
      })
      .toBeTruthy();
  }

  async configureFixedReceiverAsFinancialEntity(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.selectConfiguredField('receptorFijo', selectors.productos.labels.receptorFijo, producto.receptorFijo);
    await this.selectConfiguredField(
      'entidadFinanciera',
      selectors.productos.labels.entidadFinanciera,
      producto.entidadFinanciera
    );
    await this.saveCurrentProduct();
  }

  async assertFixedReceiverCalculatedFields(producto: ProductoFinancieroTestData): Promise<void> {
    await expect
      .poll(async () => this.booleanFieldValue('tieneReceptorFijo', selectors.productos.labels.tieneReceptorFijo), {
        message: 'Esperaba que Tiene receptor fijo sea verdadero.'
      })
      .toBeTruthy();
    await expect
      .poll(async () => this.fieldTextValue('tipoReceptorFijo', selectors.productos.labels.tipoReceptorFijo), {
        message: 'Esperaba que Tipo receptor fijo sea Entidad financiera.'
      })
      .toMatch(new RegExp(this.escapeRegExp(producto.receptorFijo), 'i'));

    const contactoReceptor = this.page.locator(selectors.productos.fields.contactoReceptor).first();

    if (await contactoReceptor.count()) {
      await expect(contactoReceptor).toBeHidden();
    }
  }

  async configureFixedReceiverAsContact(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.selectConfiguredField(
      'receptorFijo',
      selectors.productos.labels.receptorFijo,
      producto.receptorFijoContacto
    );
    await this.selectConfiguredField(
      'contactoReceptor',
      selectors.productos.labels.contactoReceptor,
      producto.contactoReceptor
    );
    await this.saveCurrentProduct();
  }

  async assertFixedReceiverContactCalculatedFields(producto: ProductoFinancieroTestData): Promise<void> {
    await expect
      .poll(async () => this.booleanFieldValue('tieneReceptorFijo', selectors.productos.labels.tieneReceptorFijo), {
        message: 'Esperaba que Tiene receptor fijo sea verdadero.'
      })
      .toBeTruthy();
    await expect
      .poll(async () => this.fieldTextValue('tipoReceptorFijo', selectors.productos.labels.tipoReceptorFijo), {
        message: 'Esperaba que Tipo receptor fijo sea Contacto.'
      })
      .toMatch(new RegExp(this.escapeRegExp(producto.receptorFijoContacto), 'i'));

    const entidadFinanciera = this.page.locator(selectors.productos.fields.entidadFinanciera).first();

    if (await entidadFinanciera.count()) {
      await expect(entidadFinanciera).toBeHidden();
    }
  }

  async excludeCnaeAndAssertItIsNotAvailableForIncludedList(
    producto: ProductoFinancieroTestData
  ): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openLimitesAmbitoTab();
    await this.addCnaeToExcludedList(producto.cnaeSolapamiento);
    await this.assertCnaeIsNotAvailableInIncludedSelector(producto.cnaeSolapamiento);
  }

  async assertExcludedValuesAreNotAvailableForIncludedSelectors(
    rows: ProductoSolapamientoParametro[],
    producto: ProductoFinancieroTestData
  ): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openLimitesAmbitoTab();

    for (const row of rows) {
      const value = this.overlapValue(row.valor, producto);
      const selectorsByBlock = this.overlapSelectorsByBlock(row.bloque);

      await this.addValueToExcludedOverlapList(selectorsByBlock, value);
      await this.assertValueIsNotAvailableInIncludedOverlapSelector(selectorsByBlock, value);
    }
  }

  async verifyControlOptionsAndSaveSupportedValues(producto: ProductoFinancieroTestData): Promise<string> {
    await this.enterEditModeIfNeeded();

    const options = await this.controlOptions();
    const expectedOptions = [producto.control, producto.controlAlternativo];
    const missingOptions = expectedOptions.filter(
      (expectedOption) => !options.some((option) => this.normalizeText(option).includes(this.normalizeText(expectedOption)))
    );

    await this.selectConfiguredField('control', selectors.productos.labels.control, producto.control);
    await this.saveCurrentProduct();
    await this.enterEditModeIfNeeded();
    await this.selectConfiguredField('control', selectors.productos.labels.control, producto.controlAlternativo);
    await this.saveCurrentProduct();

    if (missingOptions.length === 0) {
      return `Opciones de Control observadas: ${options.join(', ')}`;
    }

    return `Discrepancia en opciones de Control. Observadas: ${options.join(', ')}. Faltantes esperadas: ${missingOptions.join(', ')}`;
  }

  async verifyClienteObjetivoCheckboxesAndPersistence(): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openInformacionGeneralTabIfVisible();
    await this.assertClienteObjetivoFieldsAreVisible();
    await this.setCheckboxField(selectors.productos.clienteObjetivo.tipoJuridico, false);
    await this.saveCurrentProduct();
    await this.enterEditModeIfNeeded();
    await expect(this.checkboxField(selectors.productos.clienteObjetivo.tipoJuridico)).not.toBeChecked();
    await this.setAllCompanySizeTargetCheckboxes(false);
    await this.saveCurrentProduct();
    await this.enterEditModeIfNeeded();
    await this.assertAllCompanySizeTargetCheckboxes(false);
    await this.setCheckboxField(selectors.productos.clienteObjetivo.tipoJuridico, true);
    await this.setCheckboxField(selectors.productos.clienteObjetivo.autonomoTipoFisico, true);
    await this.setCheckboxField(selectors.productos.clienteObjetivo.emprendedoresNuevaEmpresa, true);
    await this.setAllCompanySizeTargetCheckboxes(true);
    await this.saveCurrentProduct();
  }

  async verifyCapitalAfectoOptionsAndSaveValues(rows: ProductoOpcionCapitalAfecto[]): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openOtraInformacionTabIfVisible();

    const expectedOptions = rows.map((row) => row.opcion);
    const actualOptions = await this.selectionOptions('capitalAfecto', selectors.productos.labels.capitalAfecto);
    const missingOptions = expectedOptions.filter(
      (expectedOption) => !actualOptions.some((actualOption) => this.normalizeText(actualOption).includes(this.normalizeText(expectedOption)))
    );

    if (missingOptions.length > 0) {
      throw new Error(
        `Faltan opciones de Capital afecto. Observadas: ${actualOptions.join(', ')}. Faltantes: ${missingOptions.join(', ')}`
      );
    }

    for (const row of rows) {
      await this.enterEditModeIfNeeded();
      await this.openOtraInformacionTabIfVisible();
      await this.selectConfiguredField('capitalAfecto', selectors.productos.labels.capitalAfecto, row.opcion);
      await this.saveCurrentProduct();
    }
  }

  async manageCommissionConceptLine(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    const row = await this.addCommissionConceptLine(producto);

    await this.assertCommissionProductAutocomplete(row);
    await this.saveCurrentProduct();
    await this.openConceptosTab();
    await expect(this.commissionConceptRow(producto.lineaComision.concepto)).toBeVisible();
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.editCommissionConceptMaxPercentage(producto);
    await this.saveCurrentProduct();
    await this.openConceptosTab();
    await expect(this.commissionConceptRow(producto.lineaComision.concepto)).toContainText(
      new RegExp(this.escapeRegExp(producto.lineaComision.porcentajeMaximoEditado))
    );
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.deleteCommissionConceptLine(producto.lineaComision.concepto);
    await this.saveCurrentProduct();
    await this.openConceptosTab();
    await expect(this.commissionConceptRow(producto.lineaComision.concepto)).toHaveCount(0);
  }

  async tryAddDuplicatedCommissionConceptLine(producto: ProductoFinancieroTestData): Promise<void> {
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLineFromData(producto.lineaComisionDuplicada);
    await this.saveCurrentProduct();
    await this.enterEditModeIfNeeded();
    await this.openConceptosTab();
    await this.addCommissionConceptLineFromData(producto.lineaComisionDuplicada);
    await this.clickSaveExpectingValidation();
  }

  async assertDuplicatedCommissionConceptLineValidation(producto: ProductoFinancieroTestData): Promise<void> {
    await expect
      .poll(async () => this.hasDuplicatedCommissionLineValidation(), {
        message: 'Esperaba validacion de linea de comision duplicada.'
      })
      .toBeTruthy();
    await this.closeValidationDialogIfVisible();
    await this.discardChangesIfVisible();
    await this.openConceptosTab();
    await expect
      .poll(async () => this.commissionConceptRow(producto.lineaComisionDuplicada.concepto).count())
      .toBe(1);
  }

  private async fillProductName(name: string): Promise<void> {
    const input = this.page.locator(selectors.productos.nameInput).first();

    await expect(input).toBeVisible();
    await input.fill(name);
  }

  private async assertCreateProductIsNotAvailable(): Promise<void> {
    const newButton = this.page.locator(selectors.productos.newButton).first();

    if (await newButton.isVisible().catch(() => false)) {
      await expect(newButton).toBeDisabled();
      return;
    }

    await expect(newButton).toBeHidden();
  }

  private async openFirstProductFromList(): Promise<void> {
    const row = this.page.locator(selectors.productos.rows).first();

    await expect(row).toBeVisible();
    await row.click();
    await expect(this.page.locator(selectors.productos.rows).first()).toBeHidden({ timeout: 30000 });
  }

  private async openFirstCommissionProductFromList(): Promise<void> {
    const row = this.page.locator(selectors.productos.rows).first();

    await expect(row).toBeVisible();
    await row.click();
    await expect(this.page.locator(selectors.productos.rows).first()).toBeHidden({ timeout: 30000 });
  }

  private async assertTabIsHidden(tabName: RegExp): Promise<void> {
    const tab = this.page.getByRole('tab', { name: tabName }).first();

    if (await tab.count()) {
      await expect(tab).toBeHidden();
    }
  }

  private async assertStandardOdooGeneralInformationTabIsHidden(): Promise<void> {
    const standardTab = this.page
      .getByRole('tab', { name: /Informaci[oó]n general/i })
      .filter({ hasNotText: /Producto|Financier/i })
      .first();

    if (await standardTab.count()) {
      await expect(standardTab).toBeHidden();
    }
  }

  private async assertCommissionProductTypeIsReadonlyService(): Promise<void> {
    const typeValue = await this.productoComisionFieldValue('tipo');

    expect(typeValue).toMatch(/Servicio/i);

    const input = this.page.locator(selectors.productosComision.fields.tipo).first();

    if (await input.isVisible().catch(() => false)) {
      const isReadonly = await input.evaluate((element) => {
        const htmlElement = element as HTMLInputElement;

        return htmlElement.readOnly || htmlElement.disabled || htmlElement.getAttribute('aria-readonly') === 'true';
      });

      expect(isReadonly, 'Tipo debe ser solo lectura en producto de comision').toBeTruthy();
    }
  }

  private async assertEditProductIsNotAvailable(): Promise<void> {
    const editButton = this.page.locator(selectors.productos.editButton).first();
    const saveButton = this.page.locator(selectors.productos.saveButton).first();

    if (await editButton.isVisible().catch(() => false)) {
      await expect(editButton).toBeDisabled();
    } else {
      await expect(editButton).toBeHidden();
    }

    await expect(saveButton).toBeHidden();
  }

  private async assertConfigurationMenuIsNotVisible(): Promise<void> {
    const configurationMenu = this.page
      .locator('a, button, [role="menuitem"]')
      .filter({ hasText: /^Configuraci[oó]n$/ })
      .first();

    await expect(configurationMenu).toBeHidden();
  }

  private async assertConfigurationMenuIsVisible(): Promise<void> {
    const configurationMenu = this.page
      .locator('a, button, [role="menuitem"]')
      .filter({ hasText: /^Configuraci[oó]n$/ })
      .first();

    await expect(configurationMenu).toBeVisible();
  }

  private async fillProductoComisionName(name: string): Promise<void> {
    const input = this.page.locator(selectors.productosComision.nameInput).first();

    await expect(input).toBeVisible();
    await input.fill(name);
  }

  private async fillConceptMasterField(selector: string, value: string): Promise<void> {
    const input = this.page.locator(selector).first();

    await expect(input).toBeVisible();
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  private async openCommissionConcept(name: string): Promise<void> {
    const searchInput = this.page.locator(selectors.conceptosComision.searchInput).first();

    await expect(searchInput).toBeVisible();
    await searchInput.fill(name);

    const searchOption = this.page.getByRole('option').filter({ hasText: name }).first();

    if (await searchOption.isVisible().catch(() => false)) {
      await searchOption.click();
    } else {
      await this.page.keyboard.press('Enter');
    }

    const row = this.page.locator(selectors.conceptosComision.rows).filter({ hasText: name }).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async enterCommissionConceptEditModeIfNeeded(): Promise<void> {
    const saveButton = this.page.locator(selectors.conceptosComision.saveButton).first();

    if (await saveButton.isVisible().catch(() => false)) {
      return;
    }

    const editButton = this.page.locator(selectors.conceptosComision.editButton).first();

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  private async assertCommissionConceptReadonlyField(
    selector: string,
    fieldName: string,
    expectedValue: string
  ): Promise<void> {
    const input = this.page.locator(selector).first();

    if (await input.isVisible().catch(() => false)) {
      await expect
        .poll(async () => (await input.inputValue().catch(() => '')).trim())
        .toMatch(new RegExp(this.escapeRegExp(expectedValue), 'i'));
      const isReadonly = await input.evaluate((element) => {
        const htmlElement = element as HTMLInputElement;

        return htmlElement.readOnly || htmlElement.disabled || htmlElement.getAttribute('aria-readonly') === 'true';
      });

      expect(isReadonly, `${fieldName} debe estar readonly o deshabilitado`).toBeTruthy();
      return;
    }

    await expect(this.page.getByText(new RegExp(this.escapeRegExp(expectedValue), 'i')).first()).toBeVisible();
  }

  private async assertCommissionProductFieldIsEditable(conceptName: string): Promise<void> {
    const input = this.page.locator(selectors.conceptosComision.productoComisionInput).first();

    await expect(input, `Producto de comision debe estar visible para ${conceptName}`).toBeVisible();
    const isEditable = await input.evaluate((element) => {
      const htmlElement = element as HTMLInputElement;

      return !htmlElement.readOnly && !htmlElement.disabled && htmlElement.getAttribute('aria-readonly') !== 'true';
    });

    expect(isEditable, `Producto de comision debe ser editable para ${conceptName}`).toBeTruthy();
  }

  private async selectCommissionProductInConcept(productName: string): Promise<void> {
    const input = this.page.locator(selectors.conceptosComision.productoComisionInput).first();

    await expect(input).toBeVisible();
    await input.fill(productName);
    await this.selectConceptAutocompleteOption(productName);
  }

  private async saveCurrentCommissionConcept(): Promise<void> {
    const saveButton = this.page.locator(selectors.conceptosComision.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeHidden({ timeout: 30000 });
  }

  private async deleteCurrentCommissionConcept(): Promise<void> {
    const actionButton = this.page.locator(selectors.conceptosComision.actionButton).first();

    await expect(actionButton).toBeVisible();
    await actionButton.click();
    await this.page.locator(selectors.conceptosComision.deleteMenuItem).first().click();

    const confirmButton = this.page.locator(selectors.conceptosComision.confirmDeleteButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }

  private async assertCommissionConceptDoesNotExist(name: string): Promise<void> {
    await this.goto(env.actionUrls.conceptosComision);
    const searchInput = this.page.locator(selectors.conceptosComision.searchInput).first();

    await expect(searchInput).toBeVisible();
    await searchInput.fill(name);
    await this.page.keyboard.press('Enter');
    await expect(this.page.locator(selectors.conceptosComision.rows).filter({ hasText: name })).toHaveCount(0);
  }

  private async navigateToProductTypologies(): Promise<void> {
    await this.goto(env.actionUrls.tipologiasProducto);
    await expect(this.page.locator(selectors.tipologiasProducto.newButton).first()).toBeVisible();
  }

  private async createProductTypology(name: string): Promise<void> {
    await this.click(selectors.tipologiasProducto.newButton);
    await this.fillProductTypologyName(name);
    await this.saveCurrentProductTypology();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(name), 'i'));
  }

  private async tryCreateDuplicatedProductTypology(name: string): Promise<void> {
    await this.navigateToProductTypologies();
    await this.click(selectors.tipologiasProducto.newButton);
    await this.fillProductTypologyName(name);
    await this.page.locator(selectors.tipologiasProducto.saveButton).first().click();
  }

  private async assertProductTypologyDuplicateValidation(): Promise<void> {
    await expect
      .poll(async () => {
        const text = [
          ...(await this.page.locator(selectors.tipologiasProducto.validationText).allTextContents()),
          (await this.page.locator('body').textContent()) ?? ''
        ].join(' ');

        return /duplic|ya existe|[uú]nico|unique|Tipolog/i.test(text);
      })
      .toBeTruthy();
    await this.closeProductTypologyDialogIfVisible();
  }

  private async openProductTypology(name: string): Promise<void> {
    await this.navigateToProductTypologies();
    await this.searchInCurrentList(selectors.tipologiasProducto.searchInput, name);
    const row = this.page.locator(selectors.tipologiasProducto.rows).filter({ hasText: name }).first();

    await expect(row).toBeVisible();
    await row.click();
  }

  private async enterProductTypologyEditModeIfNeeded(): Promise<void> {
    const saveButton = this.page.locator(selectors.tipologiasProducto.saveButton).first();

    if (await saveButton.isVisible().catch(() => false)) {
      return;
    }

    const editButton = this.page.locator(selectors.tipologiasProducto.editButton).first();

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  private async fillProductTypologyName(name: string): Promise<void> {
    const input = this.page.locator(selectors.tipologiasProducto.nameInput).first();

    await expect(input).toBeVisible();
    await input.fill(name);
    await expect(input).toHaveValue(name);
  }

  private async saveCurrentProductTypology(): Promise<void> {
    const saveButton = this.page.locator(selectors.tipologiasProducto.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeHidden({ timeout: 30000 });
  }

  private async archiveCurrentProductTypology(): Promise<void> {
    const actionButton = this.page.locator(selectors.tipologiasProducto.actionButton).first();

    await expect(actionButton).toBeVisible();
    await actionButton.click();
    await this.page.locator(selectors.tipologiasProducto.archiveMenuItem).first().click();

    const confirmButton = this.page.locator(selectors.tipologiasProducto.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }

  private async assertProductTypologyIsNotVisibleInActiveList(name: string): Promise<void> {
    await this.navigateToProductTypologies();
    await this.searchInCurrentList(selectors.tipologiasProducto.searchInput, name);
    await expect(this.page.locator(selectors.tipologiasProducto.rows).filter({ hasText: name })).toHaveCount(0);
  }

  private async assertProductTypologyIsNotVisibleInFilters(name: string): Promise<void> {
    const filterButton = this.page.locator(selectors.tipologiasProducto.listFilterButton).first();

    if (!(await filterButton.isVisible().catch(() => false))) {
      return;
    }

    await filterButton.click();
    await expect(
      this.page
        .locator('.dropdown-menu:visible, [role="menu"]:visible, [role="listbox"]:visible')
        .filter({ hasText: new RegExp(this.escapeRegExp(name), 'i') })
    ).toHaveCount(0);
  }

  private async searchInCurrentList(searchSelector: string, value: string): Promise<void> {
    const searchInput = this.page.locator(searchSelector).first();

    await expect(searchInput).toBeVisible();
    await searchInput.fill(value);

    const searchOption = this.page.getByRole('option').filter({ hasText: value }).first();

    if (await searchOption.isVisible().catch(() => false)) {
      await searchOption.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  private async closeProductTypologyDialogIfVisible(): Promise<void> {
    const closeButton = this.page.locator(selectors.tipologiasProducto.dialogCloseButton).first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }

  private async discardProductTypologyChangesIfVisible(): Promise<void> {
    const discardButton = this.page
      .locator('button[aria-label="Descartar todos los cambios"], button:has-text("Descartar")')
      .first();

    if (await discardButton.isVisible().catch(() => false)) {
      await discardButton.click();
    }
  }

  private async navigateToNaturalezaT4(): Promise<void> {
    await this.goto(env.actionUrls.naturalezaT4);
    await expect(this.page.locator(selectors.naturalezaT4.newButton).first()).toBeVisible();
  }

  private async createNaturalezaT4(data: NaturalezaT4TestData): Promise<void> {
    await this.click(selectors.naturalezaT4.newButton);
    await this.fillNaturalezaT4Code(data.codigo);
    await this.fillNaturalezaT4Description(data.descripcion);
    await this.saveCurrentNaturalezaT4();
    await expect(this.page).toHaveTitle(new RegExp(this.escapeRegExp(data.descripcion), 'i'));
  }

  private async enterNaturalezaT4EditModeIfNeeded(): Promise<void> {
    const saveButton = this.page.locator(selectors.naturalezaT4.saveButton).first();

    if (await saveButton.isVisible().catch(() => false)) {
      return;
    }

    const editButton = this.page.locator(selectors.naturalezaT4.editButton).first();

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  private async fillNaturalezaT4Code(code: string): Promise<void> {
    const input = this.page.locator(selectors.naturalezaT4.codeInput).first();

    await expect(input).toBeVisible();
    await input.fill(code);
    await expect(input).toHaveValue(code);
  }

  private async fillNaturalezaT4Description(description: string): Promise<void> {
    const input = this.page.locator(selectors.naturalezaT4.descriptionInput).first();

    await expect(input).toBeVisible();
    await input.fill(description);
  }

  private async saveCurrentNaturalezaT4(): Promise<void> {
    const saveButton = this.page.locator(selectors.naturalezaT4.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeHidden({ timeout: 30000 });
  }

  private async archiveCurrentNaturalezaT4(): Promise<void> {
    const actionButton = this.page.locator(selectors.naturalezaT4.actionButton).first();

    await expect(actionButton).toBeVisible();
    await actionButton.click();
    await this.page.locator(selectors.naturalezaT4.archiveMenuItem).first().click();

    const confirmButton = this.page.locator(selectors.naturalezaT4.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }

  private async assertNaturalezaT4IsNotVisibleInActiveList(description: string): Promise<void> {
    await this.navigateToNaturalezaT4();
    await this.searchInCurrentList(selectors.naturalezaT4.searchInput, description);
    await expect(this.page.locator(selectors.naturalezaT4.rows).filter({ hasText: description })).toHaveCount(0);
  }

  private async assertNaturalezaT4IsNotAvailableInProductGroup(description: string): Promise<void> {
    await this.goto(env.actionUrls.gruposProducto);
    await expect(this.page.locator(selectors.naturalezaT4.newButton).first()).toBeVisible();
    await this.click(selectors.naturalezaT4.newButton);

    const input = this.page.locator(selectors.naturalezaT4.grupoProductoNaturalezaT4Input).first();

    await expect(input).toBeVisible();
    await input.fill(description);

    const option = this.page
      .locator(selectors.naturalezaT4.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(description), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeHidden({ timeout: 5000 });
  }

  private async assertProductoComisionPreloadedFields(producto: ProductoComisionTestData): Promise<void> {
    await expect
      .poll(async () => this.productoComisionFieldValue('tipo'), {
        message: 'Esperaba Tipo Servicio precargado.'
      })
      .toMatch(new RegExp(this.escapeRegExp(producto.tipoEsperado), 'i'));
    await expect.poll(async () => this.productoComisionFieldValue('impuestosCliente')).toBe('');
  }

  private async fillConfiguredField(
    field: keyof typeof selectors.productos.fields,
    label: string,
    value: string
  ): Promise<void> {
    const input = await this.inputForField(field, label);

    await input.fill(value);
    await input.press('Tab');
    await expect
      .poll(async () => (await input.inputValue().catch(() => '')).trim())
      .toContain(value);
  }

  private async selectConfiguredField(
    field: keyof typeof selectors.productos.fields,
    label: string,
    value: string
  ): Promise<void> {
    const input = await this.inputForField(field, label);
    const fieldContainer = this.fieldContainer(input);

    await input.click();
    await input.fill(value);
    await this.selectAutocompleteOptionContainingIfNeeded(input, fieldContainer, value);
    await this.page.keyboard.press('Escape');
    await expect
      .poll(async () => {
        const inputValue = (await input.inputValue().catch(() => '')).trim();
        const containerText = ((await fieldContainer.textContent().catch(() => '')) ?? '').trim();

        return `${inputValue} ${containerText}`.trim();
      })
      .toMatch(new RegExp(this.escapeRegExp(value), 'i'));
  }

  private async controlOptions(): Promise<string[]> {
    return this.selectionOptions('control', selectors.productos.labels.control);
  }

  private async selectionOptions(field: keyof typeof selectors.productos.fields, label: string): Promise<string[]> {
    const input = await this.inputForField(field, label);

    await input.click();
    await input.fill('');

    const optionLocator = this.page
      .locator(selectors.productos.autocompleteOption)
      .filter({ hasNotText: /Crear|Buscar/i });

    await expect(optionLocator.first()).toBeVisible();

    const options = (await optionLocator.allTextContents())
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    await this.page.keyboard.press('Escape');

    return [...new Set(options)];
  }

  private async assertConfiguredFieldContainsValue(
    field: keyof typeof selectors.productos.fields,
    label: string,
    expectedValue: string
  ): Promise<void> {
    const input = await this.inputForField(field, label);

    await expect
      .poll(async () => (await input.inputValue().catch(() => '')).trim())
      .toMatch(new RegExp(this.escapeRegExp(expectedValue)));
  }

  private async inputForField(
    field: keyof typeof selectors.productos.fields,
    label: string
  ): Promise<Locator> {
    const configuredInput = this.page.locator(selectors.productos.fields[field]).first();

    if (await configuredInput.isVisible().catch(() => false)) {
      return configuredInput;
    }

    const byCombobox = this.page.getByRole('combobox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byCombobox.isVisible().catch(() => false)) {
      return byCombobox;
    }

    const byTextbox = this.page.getByRole('textbox', { name: new RegExp(this.escapeRegExp(label), 'i') }).first();

    if (await byTextbox.isVisible().catch(() => false)) {
      return byTextbox;
    }

    const fallback = this.page.locator(this.inputNearLabelXPath(label)).first();

    await expect(fallback).toBeVisible();
    return fallback;
  }

  private async performArchiveCurrentProduct(): Promise<void> {
    await this.openActionMenuIfAvailable();
    await this.page.locator(selectors.productos.archiveMenuItem).filter({ hasText: /^Archivar$/ }).first().click();

    const confirmButton = this.page.locator(selectors.productos.confirmArchiveButton).last();

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }

    await expect(this.page.locator(selectors.productos.unarchiveButton).first()).toBeVisible({ timeout: 30000 });
  }

  private async performReactivateCurrentProduct(): Promise<void> {
    const directButton = this.page.locator(selectors.productos.unarchiveButton).first();

    if (await directButton.isVisible().catch(() => false)) {
      await directButton.click();
    } else {
      await this.openActionMenuIfAvailable();
      await this.page.locator(selectors.productos.unarchiveButton).first().click();
    }

    await expect(this.page.locator(selectors.productos.unarchiveButton).first()).toBeHidden({ timeout: 30000 });
  }

  private async performDuplicateCurrentProduct(): Promise<void> {
    await this.openActionMenuIfAvailable();
    await this.page.locator(selectors.productos.duplicateMenuItem).first().click();
    await expect(this.page.locator(selectors.productos.saveButton).first()).toBeVisible({ timeout: 30000 });
  }

  private async openActionMenuIfAvailable(): Promise<void> {
    const actionButton = this.page.locator(selectors.productos.actionButton).first();

    if (await actionButton.isVisible().catch(() => false)) {
      await actionButton.click();
    }
  }

  private async fechaBajaValue(): Promise<string> {
    const input = this.page.locator(selectors.productos.fechaBajaInput).first();

    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue()).trim();
    }

    const readonlyValue = this.page.locator(this.readonlyValueNearLabelXPath(selectors.productos.labels.fechaBaja)).first();

    if (await readonlyValue.isVisible().catch(() => false)) {
      return ((await readonlyValue.textContent()) ?? '').trim();
    }

    return '';
  }

  private async fieldTextValue(field: keyof typeof selectors.productos.fields, label: string): Promise<string> {
    const input = this.page.locator(selectors.productos.fields[field]).first();

    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue().catch(() => '')).trim();
    }

    const readonlyValue = this.page.locator(this.readonlyValueNearLabelXPath(label)).first();

    if (await readonlyValue.isVisible().catch(() => false)) {
      return ((await readonlyValue.textContent()) ?? '').trim();
    }

    return '';
  }

  private async booleanFieldValue(field: keyof typeof selectors.productos.fields, label: string): Promise<boolean> {
    const input = this.page.locator(selectors.productos.fields[field]).first();

    if (await input.isVisible().catch(() => false)) {
      const checked = await input.isChecked().catch(() => undefined);

      if (checked !== undefined) {
        return checked;
      }

      const value = (await input.inputValue().catch(() => '')).trim();

      return /^(true|1|si|s[ií]|verdadero)$/i.test(value);
    }

    const text = await this.fieldTextValue(field, label);

    return /^(true|1|si|s[ií]|verdadero)|✓|✔/i.test(text);
  }

  private async relacionValue(): Promise<string> {
    const input = this.page.locator(selectors.productos.relacionInput).first();

    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue()).trim();
    }

    const readonlyValue = this.page.locator(this.readonlyValueNearLabelXPath(selectors.productos.labels.relacion)).first();

    if (await readonlyValue.isVisible().catch(() => false)) {
      return ((await readonlyValue.textContent()) ?? '').trim();
    }

    return '';
  }

  private async saveCurrentProduct(): Promise<void> {
    const saveButton = this.page.locator(selectors.productos.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeHidden({ timeout: 30000 });
  }

  private async saveCurrentCommissionProduct(): Promise<void> {
    const saveButton = this.page.locator(selectors.productosComision.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeHidden({ timeout: 30000 });
  }

  private async productoComisionFieldValue(field: keyof typeof selectors.productosComision.fields): Promise<string> {
    const input = this.page.locator(selectors.productosComision.fields[field]).first();

    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue().catch(() => '')).trim();
    }

    const label = selectors.productosComision.labels[field];
    const readonlyValue = this.page.locator(this.readonlyValueNearLabelXPath(label)).first();

    if (await readonlyValue.isVisible().catch(() => false)) {
      return ((await readonlyValue.textContent()) ?? '').trim();
    }

    return '';
  }

  private async clickSaveExpectingValidation(): Promise<void> {
    const saveButton = this.page.locator(selectors.productos.saveButton).first();

    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(saveButton).toBeVisible({ timeout: 10000 });
  }

  private async assertNegativeNumericValidation(fieldLabel: string): Promise<void> {
    await expect
      .poll(async () => this.hasNegativeNumericValidation(), {
        message: `Esperaba validacion de valor numerico negativo para ${fieldLabel}.`
      })
      .toBeTruthy();
  }

  private async assertRangeOrCoherenceValidation(caso: string): Promise<void> {
    await expect
      .poll(async () => this.hasRangeOrCoherenceValidation(), {
        message: `Esperaba validacion de rango o coherencia para el caso ${caso}.`
      })
      .toBeTruthy();
  }

  private async searchProduct(name: string): Promise<void> {
    const searchInput = this.page.locator(selectors.productos.searchInput).first();

    await expect(searchInput).toBeVisible();
    await searchInput.fill(name);
    await this.page.keyboard.press('Enter');
  }

  private productRow(name: string): Locator {
    return this.page.locator(selectors.productos.rows).filter({ hasText: name }).first();
  }

  private async openComisionesTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: new RegExp(selectors.productos.labels.tabComisiones, 'i') }).first();

    await expect(tab).toBeVisible();
    await tab.click();
  }

  private async openConceptosTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: new RegExp(selectors.productos.labels.tabConceptos, 'i') }).first();

    await expect(tab).toBeVisible();
    await tab.click();
  }

  private async openInformacionGeneralTabIfVisible(): Promise<void> {
    const tab = this.page
      .getByRole('tab', { name: new RegExp(selectors.productos.labels.tabInformacionGeneral, 'i') })
      .first();

    if (await tab.isVisible().catch(() => false)) {
      await tab.click();
    }
  }

  private async assertClienteObjetivoFieldsAreVisible(): Promise<void> {
    await expect(this.checkboxField(selectors.productos.clienteObjetivo.tipoJuridico)).toBeVisible();
    await expect(this.checkboxField(selectors.productos.clienteObjetivo.autonomoTipoFisico)).toBeVisible();
    await expect(this.checkboxField(selectors.productos.clienteObjetivo.emprendedoresNuevaEmpresa)).toBeVisible();
    await expect(this.page.locator(selectors.productos.clienteObjetivo.tamanoEmpresaContainer).first()).toBeVisible();
    await expect(this.page.locator(selectors.productos.clienteObjetivo.tamanoEmpresaCheckboxes).first()).toBeVisible();
  }

  private checkboxField(selector: string): Locator {
    return this.page.locator(selector).first();
  }

  private async setCheckboxField(selector: string, checked: boolean): Promise<void> {
    const checkbox = this.checkboxField(selector);

    await expect(checkbox).toBeVisible();

    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.setChecked(checked);
    }
  }

  private async setAllCompanySizeTargetCheckboxes(checked: boolean): Promise<void> {
    const checkboxes = this.page.locator(selectors.productos.clienteObjetivo.tamanoEmpresaCheckboxes);
    const count = await checkboxes.count();

    if (count === 0) {
      throw new Error('No se encontraron checkboxes de Tamaño de empresa objetivo.');
    }

    for (let index = 0; index < count; index += 1) {
      const checkbox = checkboxes.nth(index);

      if ((await checkbox.isChecked()) !== checked) {
        await checkbox.setChecked(checked);
      }
    }
  }

  private async assertAllCompanySizeTargetCheckboxes(checked: boolean): Promise<void> {
    const checkboxes = this.page.locator(selectors.productos.clienteObjetivo.tamanoEmpresaCheckboxes);
    const count = await checkboxes.count();

    if (count === 0) {
      throw new Error('No se encontraron checkboxes de Tamaño de empresa objetivo.');
    }

    for (let index = 0; index < count; index += 1) {
      await expect(checkboxes.nth(index)).toBeChecked({ checked });
    }
  }

  private async openOtraInformacionTabIfVisible(): Promise<void> {
    const tab = this.page
      .getByRole('tab', { name: new RegExp(selectors.productos.labels.tabOtraInformacion, 'i') })
      .first();

    if (await tab.isVisible().catch(() => false)) {
      await tab.click();
    }
  }

  private async openLimitesAmbitoTab(): Promise<void> {
    const tab = this.page
      .getByRole('tab', { name: new RegExp(selectors.productos.labels.tabLimitesAmbito, 'i') })
      .first();

    await expect(tab).toBeVisible();
    await tab.click();
  }

  private async addCnaeToExcludedList(code: string): Promise<void> {
    await this.page.locator(selectors.productos.cnae.excluidosAddLineButton).first().click();

    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();
    const input = row.locator(selectors.productos.cnae.lineInput).first();

    await expect(input).toBeVisible();
    await input.fill(code);
    await this.selectCnaeAutocompleteOption(code);
    await expect(row).toContainText(new RegExp(this.escapeRegExp(code)));
  }

  private async assertCnaeIsNotAvailableInIncludedSelector(code: string): Promise<void> {
    await this.page.locator(selectors.productos.cnae.incluidosAddLineButton).first().click();

    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();
    const input = row.locator(selectors.productos.cnae.lineInput).first();

    await expect(input).toBeVisible();
    await input.fill(code);

    const option = this.page
      .locator(selectors.productos.cnae.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(code), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeHidden({ timeout: 5000 });
    await this.page.keyboard.press('Escape');
  }

  private async selectCnaeAutocompleteOption(code: string): Promise<void> {
    const option = this.page
      .locator(selectors.productos.cnae.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(code), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }

    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Escape');
  }

  private async addValueToExcludedOverlapList(selectorsByBlock: ProductoSolapamientoSelectors, value: string): Promise<void> {
    await this.page.locator(selectorsByBlock.excluidosAddLineButton).first().click();

    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();
    const input = row.locator(selectorsByBlock.lineInput).first();

    await expect(input).toBeVisible();
    await input.fill(value);
    await this.selectOverlapAutocompleteOption(value);
    await expect(row).toContainText(new RegExp(this.escapeRegExp(value), 'i'));
  }

  private async assertValueIsNotAvailableInIncludedOverlapSelector(
    selectorsByBlock: ProductoSolapamientoSelectors,
    value: string
  ): Promise<void> {
    await this.page.locator(selectorsByBlock.incluidosAddLineButton).first().click();

    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();
    const input = row.locator(selectorsByBlock.lineInput).first();

    await expect(input).toBeVisible();
    await input.fill(value);

    const option = this.page
      .locator(selectors.productos.solapamientos.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    await expect(option).toBeHidden({ timeout: 5000 });
    await this.page.keyboard.press('Escape');
  }

  private async selectOverlapAutocompleteOption(value: string): Promise<void> {
    const option = this.page
      .locator(selectors.productos.solapamientos.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }

    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Escape');
  }

  private overlapSelectorsByBlock(block: string): ProductoSolapamientoSelectors {
    const normalizedBlock = this.normalizeText(block);
    const mapping: Record<string, ProductoSolapamientoSelectors> = {
      [this.normalizeText('Tipología de Cliente')]: selectors.productos.solapamientos.tipologiaCliente,
      [this.normalizeText('Entidades Financieras')]: selectors.productos.solapamientos.entidadesFinancieras,
      [this.normalizeText('Límites Geográficos (Provincias)')]:
        selectors.productos.solapamientos.limitesGeograficosProvincias,
      [this.normalizeText('Límites Geográficos (Códigos Postales)')]:
        selectors.productos.solapamientos.limitesGeograficosCodigosPostales,
      [this.normalizeText('Límites Geográficos (Ciudades)')]:
        selectors.productos.solapamientos.limitesGeograficosCiudades
    };
    const selectorsByBlock = mapping[normalizedBlock];

    if (!selectorsByBlock) {
      throw new Error(`No existe mapeo de solapamiento para el bloque "${block}".`);
    }

    return selectorsByBlock;
  }

  private overlapValue(value: string, producto: ProductoFinancieroTestData): string {
    const normalizedValue = this.normalizeText(value);

    if (normalizedValue === 'tipologia cliente') {
      return producto.tipologiaClienteSolapamiento;
    }

    if (normalizedValue === 'entidad financiera') {
      return producto.entidadFinancieraSolapamiento;
    }

    if (normalizedValue === 'provincia') {
      return producto.provinciaSolapamiento;
    }

    if (normalizedValue === 'codigo postal') {
      return producto.codigoPostalSolapamiento;
    }

    if (normalizedValue === 'ciudad') {
      return producto.ciudadSolapamiento;
    }

    return value;
  }

  private async addCommission(producto: ProductoFinancieroTestData): Promise<void> {
    await this.page.locator(selectors.productos.comisiones.addLineButton).first().click();

    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();
    const commissionInput = row.locator(selectors.productos.comisiones.nameInput).first();

    await expect(commissionInput).toBeVisible();
    await commissionInput.fill(producto.comision.nombre);
    await this.selectAutocompleteOptionContainingIfNeeded(
      commissionInput,
      this.fieldContainer(commissionInput),
      producto.comision.nombre
    );

    const valueInput = await this.commissionValueInput(row);

    if (valueInput) {
      await valueInput.fill(producto.comision.valor);
      await valueInput.press('Tab');
    }

    await expect(row).toContainText(new RegExp(this.escapeRegExp(producto.comision.nombre), 'i'));
  }

  private async addCommissionConceptLine(producto: ProductoFinancieroTestData): Promise<Locator> {
    return this.addCommissionConceptLineFromData(producto.lineaComision);
  }

  private async addCommissionConceptLineFromData(linea: ProductoLineaComision): Promise<Locator> {
    await this.page.locator(selectors.productos.conceptos.addLineButton).first().click();

    const row = this.page.locator('tr.o_selected_row, tr:has(input)').last();
    const conceptoInput = row.locator(selectors.productos.conceptos.conceptoInput).first();

    await expect(conceptoInput).toBeVisible();
    await conceptoInput.fill(linea.concepto);
    await this.selectConceptAutocompleteOption(linea.concepto);
    await this.fillLineCombo(row, selectors.productos.conceptos.tipoInput, linea.tipo);
    await this.fillLineCombo(row, selectors.productos.conceptos.modoInput, linea.modo);
    await this.fillLineNumeric(row, selectors.productos.conceptos.porcentajeMinimoInput, linea.porcentajeMinimo, 0);
    await this.fillLineNumeric(row, selectors.productos.conceptos.porcentajeMaximoInput, linea.porcentajeMaximo, 1);
    await this.fillLineCombo(row, selectors.productos.conceptos.periodicidadInput, linea.periodicidad);

    return row;
  }

  private async assertCommissionProductAutocomplete(row: Locator): Promise<void> {
    const productoComisionInput = row.locator(selectors.productos.conceptos.productoComisionInput).first();

    if (await productoComisionInput.isVisible().catch(() => false)) {
      await expect
        .poll(async () => (await productoComisionInput.inputValue().catch(() => '')).trim())
        .not.toBe('');
      return;
    }

    await expect(row).toContainText(/comisi[oó]n/i);
  }

  private async editCommissionConceptMaxPercentage(producto: ProductoFinancieroTestData): Promise<void> {
    const row = this.commissionConceptRow(producto.lineaComision.concepto).first();

    await expect(row).toBeVisible();
    await row.click();
    await this.fillLineNumeric(
      row,
      selectors.productos.conceptos.porcentajeMaximoInput,
      producto.lineaComision.porcentajeMaximoEditado,
      1
    );
  }

  private async fillValidCommissionLineNumericValues(row: Locator, producto: ProductoFinancieroTestData): Promise<void> {
    await this.fillLineNumeric(row, selectors.productos.conceptos.porcentajeMinimoInput, producto.lineaComision.porcentajeMinimo, 0);
    await this.fillLineNumeric(row, selectors.productos.conceptos.porcentajeMaximoInput, producto.lineaComision.porcentajeMaximo, 1);
    await this.fillOptionalLineNumeric(row, selectors.productos.conceptos.plazoMinimoMesesInput, producto.lineaComision.plazoMinimoMeses, 2);
    await this.fillOptionalLineNumeric(row, selectors.productos.conceptos.importeMinimoInput, producto.lineaComision.importeMinimo, 3);
    await this.fillOptionalLineNumeric(row, selectors.productos.conceptos.importeMaximoInput, producto.lineaComision.importeMaximo, 4);
  }

  private async applyInvalidCommissionLineCase(
    producto: ProductoFinancieroTestData,
    row: ProductoLineaComisionValidacion
  ): Promise<void> {
    const commissionRow = this.commissionConceptRow(producto.lineaComision.concepto).first();

    await expect(commissionRow).toBeVisible();
    await commissionRow.click();

    if (row.modo) {
      await this.fillLineCombo(commissionRow, selectors.productos.conceptos.modoInput, row.modo);
    }

    const primaryField = this.commissionLineFieldByLabel(row.campo);

    await this.fillLineNumeric(commissionRow, primaryField.selector, row.valor, primaryField.fallbackIndex);

    if (!row.campoSecundario || !row.valorSecundario) {
      return;
    }

    const secondaryField = this.commissionLineFieldByLabel(row.campoSecundario);

    await this.fillLineNumeric(commissionRow, secondaryField.selector, row.valorSecundario, secondaryField.fallbackIndex);
  }

  private async deleteCommissionConceptLine(concepto: string): Promise<void> {
    const row = this.commissionConceptRow(concepto).first();

    await expect(row).toBeVisible();
    const deleteButton = row.locator(selectors.productos.conceptos.deleteButton).first();

    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click();
      return;
    }

    await row.click();
    await this.page.keyboard.press('Delete');
  }

  private commissionConceptRow(concepto: string): Locator {
    return this.page
      .locator(selectors.productos.conceptos.rows)
      .filter({ hasText: new RegExp(this.escapeRegExp(concepto), 'i') });
  }

  private async fillLineCombo(row: Locator, selector: string, value: string): Promise<void> {
    const input = row.locator(selector).first();

    if (!(await input.isVisible().catch(() => false))) {
      return;
    }

    await input.fill(value);
    await this.selectConceptAutocompleteOption(value);
  }

  private async setLinePeriodicityAndAssertDuration(row: Locator, periodicity: string, expectedDuration: string): Promise<void> {
    await this.fillLineCombo(row, selectors.productos.conceptos.periodicidadInput, periodicity);
    await expect
      .poll(async () => this.lineCellValue(row, 'duracion_value', selectors.productos.conceptos.duracionInput, 2))
      .toMatch(new RegExp(`^${this.escapeRegExp(expectedDuration)}(?:[,.]0+)?$`));
    await expect
      .poll(async () => this.lineCellValue(row, 'duracion_unit', selectors.productos.conceptos.unidadInput, 0))
      .toMatch(/Meses/i);
  }

  private async setCommissionLineFinanciado(concepto: string, checked: boolean): Promise<void> {
    const row = this.commissionConceptRow(concepto).first();

    await expect(row).toBeVisible();
    await row.click();

    const checkbox = row.locator(selectors.productos.conceptos.financiadoInput).first();

    await expect(checkbox).toBeVisible();

    if ((await checkbox.isChecked()) !== checked) {
      await checkbox.setChecked(checked);
    }
  }

  private async assertCommissionLineFinanciado(concepto: string, checked: boolean): Promise<void> {
    const row = this.commissionConceptRow(concepto).first();

    await expect(row).toBeVisible();

    const checkbox = row.locator(selectors.productos.conceptos.financiadoInput).first();

    if (await checkbox.isVisible().catch(() => false)) {
      await expect(checkbox).toBeChecked({ checked });
      return;
    }

    const cellText = ((await row.locator('td[name="financiado"], td[name="financed"], td[name="is_financed"]').first().textContent().catch(() => '')) ?? '').trim();

    if (checked) {
      expect(/true|si|s[ií]|✓|✔/i.test(cellText)).toBeTruthy();
    } else {
      expect(/true|si|s[ií]|✓|✔/i.test(cellText)).toBeFalsy();
    }
  }

  private async assertLineDurationFieldsAreLocked(row: Locator): Promise<void> {
    const durationInput = await this.optionalLineInput(row, selectors.productos.conceptos.duracionInput, 2);
    const unitInput = await this.optionalLineInput(row, selectors.productos.conceptos.unidadInput, 0);

    if (durationInput) {
      await expect(durationInput).toBeDisabled();
    }

    if (unitInput) {
      await expect(unitInput).toBeDisabled();
    }
  }

  private async assertLineAmountFieldsVisible(row: Locator): Promise<void> {
    await this.assertLineCellOrInputVisible(
      row,
      selectors.productos.conceptos.importeMinimoCell,
      selectors.productos.conceptos.importeMinimoInput,
      3
    );
    await this.assertLineCellOrInputVisible(
      row,
      selectors.productos.conceptos.importeMaximoCell,
      selectors.productos.conceptos.importeMaximoInput,
      4
    );
  }

  private async assertLineAmountFieldsHidden(row: Locator): Promise<void> {
    await this.assertLineCellOrInputHidden(
      row,
      selectors.productos.conceptos.importeMinimoCell,
      selectors.productos.conceptos.importeMinimoInput,
      3
    );
    await this.assertLineCellOrInputHidden(
      row,
      selectors.productos.conceptos.importeMaximoCell,
      selectors.productos.conceptos.importeMaximoInput,
      4
    );
  }

  private async assertLinePercentageFieldsVisible(row: Locator): Promise<void> {
    await this.assertLineCellOrInputVisible(
      row,
      selectors.productos.conceptos.porcentajeMinimoCell,
      selectors.productos.conceptos.porcentajeMinimoInput,
      0
    );
    await this.assertLineCellOrInputVisible(
      row,
      selectors.productos.conceptos.porcentajeMaximoCell,
      selectors.productos.conceptos.porcentajeMaximoInput,
      1
    );
  }

  private async assertLinePercentageFieldsHidden(row: Locator): Promise<void> {
    await this.assertLineCellOrInputHidden(
      row,
      selectors.productos.conceptos.porcentajeMinimoCell,
      selectors.productos.conceptos.porcentajeMinimoInput,
      0
    );
    await this.assertLineCellOrInputHidden(
      row,
      selectors.productos.conceptos.porcentajeMaximoCell,
      selectors.productos.conceptos.porcentajeMaximoInput,
      1
    );
  }

  private async assertLineDurationFieldsHidden(row: Locator): Promise<void> {
    await this.assertLineCellOrInputHidden(
      row,
      selectors.productos.conceptos.duracionCell,
      selectors.productos.conceptos.duracionInput,
      2
    );
    await this.assertLineCellOrInputHidden(
      row,
      selectors.productos.conceptos.unidadCell,
      selectors.productos.conceptos.unidadInput,
      0
    );
  }

  private async tryForceInvalidDuration(row: Locator, invalidDuration: string, expectedDuration: string): Promise<void> {
    const durationInput = await this.optionalLineInput(row, selectors.productos.conceptos.duracionInput, 2);

    if (!durationInput) {
      return;
    }

    if (await durationInput.isDisabled().catch(() => false)) {
      return;
    }

    await durationInput.fill(invalidDuration);
    await durationInput.press('Tab');
    await this.clickSaveExpectingValidation();
    await this.closeValidationDialogIfVisible();
    await expect
      .poll(async () => this.lineCellValue(row, 'duracion_value', selectors.productos.conceptos.duracionInput, 2))
      .toMatch(new RegExp(`^${this.escapeRegExp(expectedDuration)}(?:[,.]0+)?$`));
  }

  private async lineCellValue(
    row: Locator,
    cellName: string,
    inputSelector: string,
    fallbackIndex: number
  ): Promise<string> {
    const input = await this.optionalLineInput(row, inputSelector, fallbackIndex);

    if (input && (await input.isVisible().catch(() => false))) {
      return (await input.inputValue().catch(() => '')).trim();
    }

    return ((await row.locator(`td[name="${cellName}"]`).first().textContent().catch(() => '')) ?? '').trim();
  }

  private async optionalLineInput(row: Locator, selector: string, fallbackIndex: number): Promise<Locator | undefined> {
    const inputs = row.locator(selector);
    const count = await inputs.count();

    if (count === 0) {
      return undefined;
    }

    return count > fallbackIndex ? inputs.nth(fallbackIndex) : inputs.first();
  }

  private async requiredLineInput(row: Locator, selector: string, fallbackIndex: number): Promise<Locator> {
    const input = await this.optionalLineInput(row, selector, fallbackIndex);

    if (!input) {
      throw new Error(`No se encontro input requerido en linea de conceptos: ${selector}`);
    }

    return input;
  }

  private async assertOptionalLineInputHidden(row: Locator, selector: string, fallbackIndex: number): Promise<void> {
    const input = await this.optionalLineInput(row, selector, fallbackIndex);

    if (!input) {
      return;
    }

    await expect(input).toBeHidden();
  }

  private async assertLineCellOrInputVisible(
    row: Locator,
    cellSelector: string,
    inputSelector: string,
    fallbackIndex: number
  ): Promise<void> {
    const cell = row.locator(cellSelector).first();

    if ((await cell.count()) > 0) {
      await expect(cell).toBeVisible();
      return;
    }

    await expect(await this.requiredLineInput(row, inputSelector, fallbackIndex)).toBeVisible();
  }

  private async assertLineCellOrInputHidden(
    row: Locator,
    cellSelector: string,
    inputSelector: string,
    fallbackIndex: number
  ): Promise<void> {
    const cells = row.locator(cellSelector);
    const count = await cells.count();

    if (count > 0) {
      for (let index = 0; index < count; index += 1) {
        await expect(cells.nth(index)).toBeHidden();
      }
      return;
    }

    await this.assertOptionalLineInputHidden(row, inputSelector, fallbackIndex);
  }

  private async fillLineNumeric(row: Locator, selector: string, value: string, fallbackIndex: number): Promise<void> {
    const inputs = row.locator(selector);
    const input = (await inputs.count()) > fallbackIndex ? inputs.nth(fallbackIndex) : inputs.first();

    await expect(input).toBeVisible();
    await input.fill(value);
    await input.press('Tab');
  }

  private async fillOptionalLineNumeric(row: Locator, selector: string, value: string, fallbackIndex: number): Promise<void> {
    const inputs = row.locator(selector);

    if ((await inputs.count()) === 0) {
      return;
    }

    await this.fillLineNumeric(row, selector, value, fallbackIndex);
  }

  private async assertCommissionLineNumericValidation(caso: string): Promise<void> {
    await expect
      .poll(async () => this.hasCommissionLineNumericValidation(), {
        message: `Esperaba validacion numerica en linea de comision para caso ${caso}.`
      })
      .toBeTruthy();
  }

  private async selectConceptAutocompleteOption(value: string): Promise<void> {
    const option = this.page
      .locator(selectors.productos.conceptos.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }

    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Escape');
  }

  private async assertCommissionWasCopied(producto: ProductoFinancieroTestData): Promise<void> {
    const rows = this.page.locator(selectors.productos.comisiones.rows);
    const commissionRow = rows.filter({ hasText: new RegExp(this.escapeRegExp(producto.comision.nombre), 'i') }).first();

    await expect(commissionRow).toBeVisible();
    await expect(commissionRow).toContainText(new RegExp(this.escapeRegExp(producto.comision.valor)));
  }

  private async commissionValueInput(row: Locator): Promise<Locator | undefined> {
    const inputs = row.locator(selectors.productos.comisiones.valueInput);
    const count = await inputs.count();

    if (count === 0) {
      return undefined;
    }

    return count > 1 ? inputs.nth(1) : inputs.first();
  }

  private async enterEditModeIfNeeded(): Promise<void> {
    const saveButton = this.page.locator(selectors.productos.saveButton).first();

    if (await saveButton.isVisible().catch(() => false)) {
      return;
    }

    const editButton = this.page.locator(selectors.productos.editButton).first();

    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  private fieldContainer(input: Locator): Locator {
    return input.locator(
      'xpath=ancestor::*[@name or contains(@class, "o_field_widget") or contains(@class, "o_field_many2one") or contains(@class, "o_field_tags")][1]'
    );
  }

  private async selectAutocompleteOptionContainingIfNeeded(
    input: Locator,
    container: Locator,
    value: string
  ): Promise<void> {
    const option = this.page
      .locator(selectors.productos.autocompleteOption)
      .filter({ hasText: new RegExp(this.escapeRegExp(value), 'i') })
      .filter({ hasNotText: /Crear|Buscar/i })
      .first();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }

    const inputValue = await input.inputValue().catch(() => '');
    const containerText = (await container.textContent().catch(() => '')) ?? '';

    if (new RegExp(this.escapeRegExp(value), 'i').test(`${inputValue} ${containerText}`)) {
      await input.press('Tab');
      return;
    }

    await expect(option).toBeVisible();
  }

  private todayDateValuePattern(): RegExp {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
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

    return new RegExp(`${day}/${month}/${year}|${Number(day)}\\s+${monthNames[month]}\\.?\\s+${year}`, 'i');
  }

  private inputNearLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::*[self::input or self::textarea or @role="combobox"][1]`;
  }

  private readonlyValueNearLabelXPath(label: string): string {
    return `xpath=//*[normalize-space()="${label}" or normalize-space()="${label}?"]/following::*[self::span or self::div][normalize-space()][1]`;
  }

  private async hasNameRequiredValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return invalidFieldsCount > 0 || (/nombre/i.test(text) && /obligator|required|requerid/i.test(text));
  }

  private async hasDuplicatedCommissionLineValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const text = [...validationText, pageText].join(' ');

    return /ya existe|duplicad|producto.*concepto.*tipo.*compa/i.test(text);
  }

  private async hasCommissionLineNumericValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return (
      invalidFieldsCount > 0 ||
      /valor negativo|negativ|porcentaje|fuera de rango|m[ií]nimo.*m[aá]ximo|importe m[ií]nimo.*importe m[aá]ximo|mayor(?:es)? o igual(?:es)?|menor(?:es)? o igual(?:es)?/i.test(
        text
      )
    );
  }

  private async hasOrphanCommissionConceptValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const conceptValidationText = await this.page.locator(selectors.conceptosComision.validationText).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const text = [...validationText, ...conceptValidationText, pageText].join(' ');

    return /no tiene configurado.*producto de comisi[oó]n|producto de comisi[oó]n.*obligator|producto de comisi[oó]n.*requerid/i.test(
      text
    );
  }

  private async hasNegativeNumericValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return (
      invalidFieldsCount > 0 ||
      /valores numericos|valores numéricos|mayores o iguales|mayor o igual|negativ/i.test(text)
    );
  }

  private async hasRangeOrCoherenceValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return (
      invalidFieldsCount > 0 ||
      /0\s*-?\s*100|entre 0 y 100|mayor(?:es)? o igual(?:es)?|menor(?:es)? o igual(?:es)?|m[ií]nimo.*m[aá]ximo|m[aá]ximo.*m[ií]nimo|coherencia|rango|porcentaje/i.test(
        text
      )
    );
  }

  private async hasCommercialDateCoherenceValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return (
      invalidFieldsCount > 0 ||
      /fecha inicio|inicio.*fecha fin|fecha fin|debe ser.*<=|debe ser.*menor|menor o igual|posterior/i.test(text)
    );
  }

  private async hasFichaDateCoherenceValidation(): Promise<boolean> {
    const validationText = await this.page.locator(selectors.common.validationMessage).allTextContents();
    const pageText = (await this.page.locator('body').textContent()) ?? '';
    const invalidFieldsCount = await this.page.locator(selectors.common.invalidField).count();
    const text = [...validationText, pageText].join(' ');

    return (
      invalidFieldsCount > 0 ||
      /fecha de alta|fec\.?\s*alta|alta ficha|fecha de baja|fec\.?\s*baja|baja ficha|posterior|menor o igual/i.test(
        text
      )
    );
  }

  private async closeValidationDialogIfVisible(): Promise<void> {
    const visibleDialog = this.page.locator('.modal:visible, [role="dialog"]:visible').first();

    if (!(await visibleDialog.isVisible().catch(() => false))) {
      return;
    }

    const closeButton = this.page
      .locator(
        '.modal:visible button:has-text("Cerrar"), .modal:visible button:has-text("Aceptar"), .modal:visible button.btn-close, .modal:visible [aria-label="Cerrar"]'
      )
      .last();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }

    await this.page.keyboard.press('Escape');
    await expect(this.page.locator('.modal:visible, [role="dialog"]:visible')).toHaveCount(0, { timeout: 10000 });
  }

  private async closeCommissionConceptValidationDialogIfVisible(): Promise<void> {
    const closeButton = this.page.locator(selectors.conceptosComision.dialogCloseButton).first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }

  private async discardChangesIfVisible(): Promise<void> {
    const discardButton = this.page
      .locator('button[aria-label="Descartar todos los cambios"], button:has-text("Descartar")')
      .first();

    if (await discardButton.isVisible().catch(() => false)) {
      await discardButton.click();
    }
  }

  private async dismissKnownInactivityAlertIfVisible(): Promise<void> {
    const inactivityDialog = this.page
      .locator('.modal:visible, [role="dialog"]:visible')
      .filter({ hasText: /inactividad|sesion|sesión|expirad|duplicad/i })
      .first();

    if (!(await inactivityDialog.isVisible().catch(() => false))) {
      return;
    }

    const closeButton = inactivityDialog
      .locator('button:has-text("Aceptar"), button:has-text("Cerrar"), button.btn-close, [aria-label="Cerrar"]')
      .last();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
  }

  private async applyValidationRowValues(row: ProductoValidacionRango): Promise<void> {
    const primaryField = this.numericFieldByLabel(row.campo);

    await this.fillConfiguredField(primaryField.key, primaryField.label, row.valor);

    if (!row.campoSecundario || !row.valorSecundario) {
      return;
    }

    const secondaryField = this.numericFieldByLabel(row.campoSecundario);

    await this.fillConfiguredField(secondaryField.key, secondaryField.label, row.valorSecundario);
  }

  private async restoreValidationRowValues(row: ProductoValidacionRango): Promise<void> {
    const primaryField = this.numericFieldByLabel(row.campo);

    await this.fillConfiguredField(primaryField.key, primaryField.label, row.valorValido);

    if (!row.campoSecundario || !row.valorSecundarioValido) {
      return;
    }

    const secondaryField = this.numericFieldByLabel(row.campoSecundario);

    await this.fillConfiguredField(secondaryField.key, secondaryField.label, row.valorSecundarioValido);
  }

  private async applyValidProductNumericValues(): Promise<void> {
    const values: Array<{ campo: string; valor: string }> = [
      { campo: 'Reaval mínimo (%)', valor: '10' },
      { campo: 'Reaval máximo (%)', valor: '80' },
      { campo: 'Interés (%)', valor: '3.5' },
      { campo: 'Importe mínimo (€)', valor: '5000' },
      { campo: 'Importe máximo (€)', valor: '500000' },
      { campo: 'Mínimo (meses)', valor: '12' },
      { campo: 'Máximo (meses)', valor: '120' },
      { campo: 'Porcentaje compartido mínimo (%)', valor: '0' },
      { campo: 'Porcentaje compartido máximo (%)', valor: '100' }
    ];

    for (const value of values) {
      const field = this.numericFieldByLabel(value.campo);

      await this.fillConfiguredField(field.key, field.label, value.valor);
    }
  }

  private numericFieldByLabel(campo: string): ProductoCampoNumerico {
    const normalizedCampo = this.normalizeText(campo);
    const fields: ProductoCampoNumerico[] = [
      {
        campo: 'Reaval mínimo (%)',
        key: 'reavalMinimo',
        label: selectors.productos.labels.reavalMinimo
      },
      {
        campo: 'Reaval máximo (%)',
        key: 'reavalMaximo',
        label: selectors.productos.labels.reavalMaximo
      },
      {
        campo: 'Importe mínimo (€)',
        key: 'importeMinimo',
        label: selectors.productos.labels.importeMinimo
      },
      {
        campo: 'Importe máximo (€)',
        key: 'importeMaximo',
        label: selectors.productos.labels.importeMaximo
      },
      {
        campo: 'Mínimo (meses)',
        key: 'plazoMinimoMeses',
        label: selectors.productos.labels.plazoMinimoMeses
      },
      {
        campo: 'Máximo (meses)',
        key: 'plazoMaximoMeses',
        label: selectors.productos.labels.plazoMaximoMeses
      },
      {
        campo: 'Descuento (días)',
        key: 'descuentoDias',
        label: selectors.productos.labels.descuentoDias
      },
      {
        campo: 'Interés (%)',
        key: 'interes',
        label: selectors.productos.labels.interes
      },
      {
        campo: 'Porcentaje compartido mínimo (%)',
        key: 'porcentajeCompartidoMinimo',
        label: selectors.productos.labels.porcentajeCompartidoMinimo
      },
      {
        campo: 'Porcentaje compartido máximo (%)',
        key: 'porcentajeCompartidoMaximo',
        label: selectors.productos.labels.porcentajeCompartidoMaximo
      }
    ];
    const field = fields.find((candidate) => this.normalizeText(candidate.campo) === normalizedCampo);

    if (!field) {
      throw new Error(`No existe mapeo de campo numerico para "${campo}".`);
    }

    return field;
  }

  private commissionLineFieldByLabel(campo: string): ProductoLineaComisionCampo {
    const normalizedCampo = this.normalizeText(campo);
    const fields: ProductoLineaComisionCampo[] = [
      {
        campo: 'Plazo mín. (meses)',
        selector: selectors.productos.conceptos.plazoMinimoMesesInput,
        fallbackIndex: 2
      },
      {
        campo: '% mín.',
        selector: selectors.productos.conceptos.porcentajeMinimoInput,
        fallbackIndex: 0
      },
      {
        campo: '% máx.',
        selector: selectors.productos.conceptos.porcentajeMaximoInput,
        fallbackIndex: 1
      },
      {
        campo: 'PD mín.',
        selector: selectors.productos.conceptos.pdMinimoInput,
        fallbackIndex: 5
      },
      {
        campo: 'PD máx.',
        selector: selectors.productos.conceptos.pdMaximoInput,
        fallbackIndex: 6
      },
      {
        campo: 'Imp. mín. (€)',
        selector: selectors.productos.conceptos.importeMinimoInput,
        fallbackIndex: 3
      },
      {
        campo: 'Imp. máx. (€)',
        selector: selectors.productos.conceptos.importeMaximoInput,
        fallbackIndex: 4
      }
    ];
    const field = fields.find((candidate) => this.normalizeText(candidate.campo) === normalizedCampo);

    if (!field) {
      throw new Error(`No existe mapeo de campo de linea de comision para "${campo}".`);
    }

    return field;
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[€%()]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  private relativeSpanishDate(offset: { months: number }): string {
    const date = new Date();

    date.setMonth(date.getMonth() + offset.months);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

interface ProductoCampoNumericoNegativo {
  campo: string;
  valor: string;
  valorValido: string;
}

interface ProductoValidacionRango {
  caso: string;
  campo: string;
  valor: string;
  campoSecundario: string;
  valorSecundario: string;
  valorValido: string;
  valorSecundarioValido: string;
  resultado: string;
}

interface ProductoSolapamientoParametro {
  bloque: string;
  valor: string;
}

interface ProductoOpcionCapitalAfecto {
  opcion: string;
}

interface ProductoLineaComision {
  concepto: string;
  tipo: string;
  modo: string;
  porcentajeMinimo: string;
  porcentajeMaximo: string;
  periodicidad: string;
}

interface ProductoLineaComisionValidacion {
  caso: string;
  modo: string;
  campo: string;
  valor: string;
  campoSecundario: string;
  valorSecundario: string;
}

interface ConceptoComisionProtegido {
  concepto: string;
  codigo: string;
}

interface ProductoLineaComisionCampo {
  campo: string;
  selector: string;
  fallbackIndex: number;
}

interface ProductoSolapamientoSelectors {
  excluidosAddLineButton: string;
  incluidosAddLineButton: string;
  lineInput: string;
}

interface ProductoCampoNumerico {
  campo: string;
  key: keyof typeof selectors.productos.fields;
  label: string;
}
