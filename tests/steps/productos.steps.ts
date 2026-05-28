import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import {
  createConceptoComisionHuerfanoTestData,
  createConceptoComisionNoProtegidoTestData,
  createNaturalezaT4TestData,
  createProductoComisionTestData,
  createProductoFinancieroTestData,
  createTipologiaProductoTestData
} from '../fixtures/testData';
import type { CustomWorld } from '../support/world';

When('accedo al modulo Productos financieros', async function (this: CustomWorld) {
  await this.productosPage.navigateToProductos();
});

Given('que inicio sesion como usuario de productos solo lectura', async function (this: CustomWorld) {
  await this.loginPage.navigateToApplication();
  await this.loginPage.loginAs('productUser');
  await this.loginPage.assertHomeIsVisible();
});

Then('deberia visualizar la bandeja de Productos financieros', async function (this: CustomWorld) {
  await this.productosPage.assertProductosPageIsVisible();
});

When('creo un producto financiero completo', async function (this: CustomWorld) {
  this.currentProductoFinanciero = createProductoFinancieroTestData();
  await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
});

When('edito el interes del producto financiero y guardo', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.updateInterestAndSave(this.currentProductoFinanciero);
});

When('archivo el producto financiero', async function (this: CustomWorld) {
  await this.productosPage.archiveCurrentProduct();
});

Then('deberia visualizar Fecha baja informada con la fecha actual', async function (this: CustomWorld) {
  await this.productosPage.assertFechaBajaHasCurrentDate();
});

When('desarchivo el producto financiero', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.reactivateCurrentProduct();
});

Then('deberia visualizar Fecha baja vacia y el producto en la lista activa', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertFechaBajaIsEmptyAndProductIsActive(this.currentProductoFinanciero);
});

When('intento guardar un producto financiero sin nombre', async function (this: CustomWorld) {
  await this.productosPage.trySaveProductoWithoutName();
});

Then('deberia visualizar la validacion de Nombre obligatorio y el producto no se guarda', async function (
  this: CustomWorld
) {
  await this.productosPage.assertNameRequiredValidationAndProductWasNotSaved();
});

When('creo un producto financiero con comisiones para duplicar', async function (this: CustomWorld) {
  this.currentProductoFinanciero = createProductoFinancieroTestData();
  await this.productosPage.createProductoFinancieroWithCommission(this.currentProductoFinanciero);
});

When('duplico el producto financiero y cambio el nombre de la copia', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.duplicateCurrentProductAndSaveCopy(this.currentProductoFinanciero);
});

Then('deberia visualizar la relacion al producto original y sus comisiones copiadas', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertDuplicatedProductKeepsParentRelationAndCommissions(
    this.currentProductoFinanciero
  );
});

When('intento guardar valores negativos en campos numericos del producto', async function (
  this: CustomWorld,
  table: DataTable
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  const rows = table.hashes().map((row) => ({
    campo: row.campo,
    valor: row.valor,
    valorValido: row.valor_valido
  }));

  await this.productosPage.validateNegativeNumericFields(rows);
});

Then('deberia rechazarse cada valor negativo y conservarse el producto sin cambios invalidos', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('valido rangos de porcentajes y coherencia minimo maximo del producto', async function (
  this: CustomWorld,
  table: DataTable
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  const rows = table.hashes().map((row) => ({
    caso: row.caso,
    campo: row.campo,
    valor: row.valor,
    campoSecundario: row.campo_secundario,
    valorSecundario: row.valor_secundario,
    valorValido: row.valor_valido,
    valorSecundarioValido: row.valor_secundario_valido,
    resultado: row.resultado
  }));

  await this.productosPage.validatePercentageAndCoherenceCases(rows);
});

Then('deberia rechazar los casos invalidos y guardar la correccion final del producto', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('intento guardar Fecha inicio de comercializacion posterior a Fecha fin', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.trySaveCommercialStartDateAfterEndDate();
});

Then('deberia visualizar la validacion de coherencia entre Fecha inicio y Fecha fin', async function (
  this: CustomWorld
) {
  await this.productosPage.assertCommercialStartDateAfterEndDateValidation();
});

When('intento guardar Fecha alta de ficha posterior a Fecha baja de ficha', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.trySaveFichaStartDateAfterEndDate();
});

Then('deberia visualizar la validacion de coherencia entre Fecha alta y Fecha baja de ficha', async function (
  this: CustomWorld
) {
  await this.productosPage.assertFichaStartDateAfterEndDateValidation();
});

When('configuro receptor fijo como Entidad financiera', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.configureFixedReceiverAsFinancialEntity(this.currentProductoFinanciero);
});

Then('deberia visualizar los campos calculados de receptor fijo como Entidad financiera', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertFixedReceiverCalculatedFields(this.currentProductoFinanciero);
});

When('configuro receptor fijo como Contacto', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.configureFixedReceiverAsContact(this.currentProductoFinanciero);
});

Then('deberia visualizar los campos calculados de receptor fijo como Contacto', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertFixedReceiverContactCalculatedFields(this.currentProductoFinanciero);
});

When('excluyo un CNAE y consulto el selector de CNAE incluidos', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.excludeCnaeAndAssertItIsNotAvailableForIncludedList(
    this.currentProductoFinanciero
  );
});

Then('deberia observar que el CNAE excluido no aparece disponible para incluir', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }
});

When('excluyo valores y verifico que no esten disponibles para incluir', async function (
  this: CustomWorld,
  table: DataTable
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.assertExcludedValuesAreNotAvailableForIncludedSelectors(
    table.hashes().map((row) => ({
      bloque: row.bloque,
      valor: row.valor
    })),
    this.currentProductoFinanciero
  );
});

Then('deberia observar que cada valor excluido desaparece del selector de incluidos', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }
});

When('accedo al modulo Productos de comision', async function (this: CustomWorld) {
  await this.productosPage.navigateToProductosComision();
});

When('creo un producto de comision', async function (this: CustomWorld) {
  this.currentProductoComision = createProductoComisionTestData();
  await this.productosPage.createProductoComision(this.currentProductoComision);
});

Then('deberia visualizar el codigo automatico de comision y los impuestos vacios', async function (
  this: CustomWorld
) {
  if (!this.currentProductoComision) {
    throw new Error('No existe un producto de comision creado en el escenario actual.');
  }

  await this.productosPage.assertProductoComisionAutomaticCodeAndNoTaxes(this.currentProductoComision);
});

When('verifico las opciones del campo Control y guardo sus valores soportados', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  const note = await this.productosPage.verifyControlOptionsAndSaveSupportedValues(this.currentProductoFinanciero);

  await this.attach(note, 'text/plain');
});

Then('deberia quedar documentada la discrepancia funcional del campo Control', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('verifico checkboxes de Cliente objetivo y su persistencia', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.verifyClienteObjetivoCheckboxesAndPersistence();
});

Then('deberia quedar restaurada la configuracion de Cliente objetivo', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('verifico las opciones de Capital afecto y guardo cada valor', async function (
  this: CustomWorld,
  table: DataTable
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.verifyCapitalAfectoOptionsAndSaveValues(
    table.hashes().map((row) => ({ opcion: row.opcion }))
  );
});

Then('deberia guardar correctamente cada opcion de Capital afecto', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('gestiono lineas de comision en la pestana Conceptos', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.manageCommissionConceptLine(this.currentProductoFinanciero);
});

Then('deberia autocompletarse el producto de comision y permitir editar y eliminar la linea', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('intento agregar una linea de comision duplicada', async function (this: CustomWorld) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.tryAddDuplicatedCommissionConceptLine(this.currentProductoFinanciero);
});

Then('deberia visualizar la validacion de linea de comision duplicada', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertDuplicatedCommissionConceptLineValidation(this.currentProductoFinanciero);
});

When('creo un concepto de comision sin producto de comision configurado', async function (
  this: CustomWorld
) {
  this.currentConceptoComisionHuerfano = createConceptoComisionHuerfanoTestData();
  this.conceptoComisionHuerfanoBloqueadoEnConfiguracion =
    await this.productosPage.tryCreateOrphanCommissionConcept(this.currentConceptoComisionHuerfano);
});

When('intento usar el concepto de comision huerfano en un producto financiero', async function (
  this: CustomWorld
) {
  if (!this.currentConceptoComisionHuerfano) {
    throw new Error('No existe un concepto de comision huerfano en el escenario actual.');
  }

  if (this.conceptoComisionHuerfanoBloqueadoEnConfiguracion) {
    await this.attach(
      'La aplicacion ya impidio guardar el concepto sin Producto de comision en configuracion.',
      'text/plain'
    );
    return;
  }

  this.currentProductoFinanciero = createProductoFinancieroTestData();
  await this.productosPage.tryUseOrphanCommissionConceptInProduct(
    this.currentProductoFinanciero,
    this.currentConceptoComisionHuerfano
  );
});

Then('deberia visualizar la validacion de concepto sin Producto de comision', async function (
  this: CustomWorld
) {
  if (this.conceptoComisionHuerfanoBloqueadoEnConfiguracion) {
    return;
  }

  await this.productosPage.assertOrphanCommissionConceptValidation();
});

When('valido valores invalidos en lineas de comision', async function (
  this: CustomWorld,
  table: DataTable
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.validateCommissionLineNumericCases(
    this.currentProductoFinanciero,
    table.hashes().map((row) => ({
      caso: row.caso,
      modo: row.modo,
      campo: row.campo,
      valor: row.valor,
      campoSecundario: row.campo_secundario,
      valorSecundario: row.valor_secundario
    }))
  );
});

Then('deberia rechazarse cada valor invalido de la linea de comision', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('verifico periodicidades que bloquean duracion en linea de comision', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.verifyCommissionLinePeriodicityLocksDuration(this.currentProductoFinanciero);
});

Then('deberia guardar la linea con duracion automatica bloqueada', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('verifico persistencia del campo Financiado en una linea de comision', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.verifyCommissionLineFinanciadoPersistence(this.currentProductoFinanciero);
});

Then('deberia persistir el valor activado y desactivado de Financiado', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.productosPage.assertProductRemainsSaved(this.currentProductoFinanciero);
});

When('verifico proteccion de conceptos de comision protegidos', async function (
  this: CustomWorld,
  table: DataTable
) {
  await this.productosPage.verifyProtectedCommissionConceptsOnlyAllowCommissionProduct(
    table.hashes().map((row) => ({
      concepto: row.concepto,
      codigo: row.codigo
    }))
  );
});

Then('deberia permitir editar solo Producto de comision en conceptos protegidos', async function (
  this: CustomWorld
) {
  await this.attach(
    'Validado: Nombre y Codigo permanecen readonly; Producto de comision es el unico campo editable.',
    'text/plain'
  );
});

When('creo edito y elimino un concepto de comision no protegido', async function (
  this: CustomWorld
) {
  this.currentConceptoComisionNoProtegido = createConceptoComisionNoProtegidoTestData();
  await this.productosPage.createEditAndDeleteUnprotectedCommissionConcept(
    this.currentConceptoComisionNoProtegido
  );
});

Then('deberia completarse el ciclo CRUD del concepto de comision no protegido', async function (
  this: CustomWorld
) {
  if (!this.currentConceptoComisionNoProtegido) {
    throw new Error('No existe un concepto de comision no protegido en el escenario actual.');
  }
});

When('gestiono una tipologia de producto y verifico unicidad archivado y filtros', async function (
  this: CustomWorld
) {
  this.currentTipologiaProducto = createTipologiaProductoTestData();
  await this.productosPage.manageProductTypologyAndArchive(this.currentTipologiaProducto);
});

Then('deberia completarse el ciclo de tipologia de producto sin aparecer en filtros activos', async function (
  this: CustomWorld
) {
  if (!this.currentTipologiaProducto) {
    throw new Error('No existe una tipologia de producto en el escenario actual.');
  }
});

When('gestiono un registro maestro de Naturaleza T4 y verifico selector de Grupo de producto', async function (
  this: CustomWorld
) {
  this.currentNaturalezaT4 = createNaturalezaT4TestData();
  await this.productosPage.manageNaturalezaT4AndAssertInactiveInProductGroup(this.currentNaturalezaT4);
});

Then('deberia completarse el ciclo de Naturaleza T4 sin aparecer como activa en Grupo de producto', async function (
  this: CustomWorld
) {
  if (!this.currentNaturalezaT4) {
    throw new Error('No existe una Naturaleza T4 en el escenario actual.');
  }
});

When('verifico permisos de solo lectura en productos y maestros', async function (this: CustomWorld) {
  await this.productosPage.assertProductUserHasReadOnlyAccess();
});

Then('deberia impedir creacion edicion y acceso a configuracion de productos', async function (
  this: CustomWorld
) {
  await this.attach('Validado rol de solo lectura: lista visible, sin creacion, sin edicion y sin Configuracion.', 'text/plain');
});

When('verifico permisos completos del rol gestor de productos', async function (this: CustomWorld) {
  await this.productosPage.assertProductManagerHasFullAccess();
  this.currentProductoComision = createProductoComisionTestData();
  await this.productosPage.createEditAndDeleteUnprotectedCommissionConcept({
    nombre: this.currentProductoComision.nombre,
    nombreEditado: `${this.currentProductoComision.nombre} v2`,
    codigo: `seg${Date.now().toString().slice(-6)}`,
    productoComision: 'Comisión aval Producto'
  });
  this.currentTipologiaProducto = createTipologiaProductoTestData();
  await this.productosPage.manageProductTypologyAndArchive(this.currentTipologiaProducto);
});

Then('deberia permitir CRUD y visualizar configuracion para el rol gestor', async function (
  this: CustomWorld
) {
  await this.attach('Validado rol gestor: Configuracion visible y operaciones CRUD ejecutadas sin errores.', 'text/plain');
});

When('verifico visibilidad condicional de pestanas y campos por rol de producto', async function (
  this: CustomWorld
) {
  await this.productosPage.assertProductRoleConditionalUi();
});

Then('deberia visualizar la UI correspondiente a producto financiero y producto de comision', async function (
  this: CustomWorld
) {
  await this.attach(
    'Validada UI por rol de producto: tabs Atlas visibles en financiero, ocultas en comision, Tipo Servicio readonly.',
    'text/plain'
  );
});

When('verifico visibilidad condicional de campos en formulario de linea de Conceptos', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    this.currentProductoFinanciero = createProductoFinancieroTestData();
    await this.productosPage.createProductoFinanciero(this.currentProductoFinanciero);
  }

  await this.productosPage.verifyConceptLineConditionalFieldVisibility(this.currentProductoFinanciero);
});

Then('deberia alternar campos de importe porcentaje y duracion segun modo y periodicidad', async function (
  this: CustomWorld
) {
  if (!this.currentProductoFinanciero) {
    throw new Error('No existe un producto financiero creado en el escenario actual.');
  }

  await this.attach(
    'Validada UI de linea de Conceptos: Modo Importe/Porcentual alterna campos y Periodicidad Al tiron oculta Duracion.',
    'text/plain'
  );
});
