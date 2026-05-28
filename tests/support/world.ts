import { setDefaultTimeout, setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import type {
  EmpresaBancoEspanaTestData,
  EmpresaCnaeDuplicadoTestData,
  EmpresaCnaeTestData,
  EmpresaDireccionExtendidaTestData,
  EmpresaIaeTestData,
  EmpresaInformeClienteTestData,
  MaestroContactosTestData,
  NaturalezaT4TestData,
  EmpresaRegistroMercantilTestData,
  EmpresaRepresentanteTestData,
  PersonaFisicaDocumentoTestData,
  PersonaFisicaTestData,
  ConceptoComisionHuerfanoTestData,
  ConceptoComisionNoProtegidoTestData,
  ProductoComisionTestData,
  ProductoFinancieroTestData,
  TipologiaProductoTestData,
  TipologiaContactosTestData,
  UnidadDecisionTestData
} from '../fixtures/testData';
import { ConfiguracionContactosPage } from '../pages/ConfiguracionContactosPage';
import { ContactosPage } from '../pages/ContactosPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductosPage } from '../pages/ProductosPage';

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  contactosPage!: ContactosPage;
  configuracionContactosPage!: ConfiguracionContactosPage;
  productosPage!: ProductosPage;
  currentPersonaFisica?: PersonaFisicaTestData;
  currentPersonaFisicaDocumento?: PersonaFisicaDocumentoTestData;
  currentConceptoComisionHuerfano?: ConceptoComisionHuerfanoTestData;
  currentConceptoComisionNoProtegido?: ConceptoComisionNoProtegidoTestData;
  conceptoComisionHuerfanoBloqueadoEnConfiguracion?: boolean;
  currentProductoComision?: ProductoComisionTestData;
  currentProductoFinanciero?: ProductoFinancieroTestData;
  currentTipologiaProducto?: TipologiaProductoTestData;
  currentEmpresaBancoEspana?: EmpresaBancoEspanaTestData;
  currentEmpresaCnae?: EmpresaCnaeTestData;
  currentEmpresaCnaeDuplicado?: EmpresaCnaeDuplicadoTestData;
  currentEmpresaDireccionExtendida?: EmpresaDireccionExtendidaTestData;
  currentEmpresaIae?: EmpresaIaeTestData;
  currentEmpresaInformeCliente?: EmpresaInformeClienteTestData;
  currentMaestroContactos?: MaestroContactosTestData;
  currentNaturalezaT4?: NaturalezaT4TestData;
  currentEmpresaRegistroMercantil?: EmpresaRegistroMercantilTestData;
  currentEmpresaRepresentante?: EmpresaRepresentanteTestData;
  currentUnidadDecision?: UnidadDecisionTestData;
  currentTipologiaContactos?: TipologiaContactosTestData;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initializePages(): void {
    this.loginPage = new LoginPage(this.page);
    this.contactosPage = new ContactosPage(this.page);
    this.configuracionContactosPage = new ConfiguracionContactosPage(this.page);
    this.productosPage = new ProductosPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60000);
