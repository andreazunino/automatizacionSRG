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
  EmpresaRegistroMercantilTestData,
  EmpresaRepresentanteTestData,
  PersonaFisicaDocumentoTestData,
  PersonaFisicaTestData,
  TipologiaContactosTestData,
  UnidadDecisionTestData
} from '../fixtures/testData';
import { ConfiguracionContactosPage } from '../pages/ConfiguracionContactosPage';
import { ContactosPage } from '../pages/ContactosPage';
import { LoginPage } from '../pages/LoginPage';

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  contactosPage!: ContactosPage;
  configuracionContactosPage!: ConfiguracionContactosPage;
  currentPersonaFisica?: PersonaFisicaTestData;
  currentPersonaFisicaDocumento?: PersonaFisicaDocumentoTestData;
  currentEmpresaBancoEspana?: EmpresaBancoEspanaTestData;
  currentEmpresaCnae?: EmpresaCnaeTestData;
  currentEmpresaCnaeDuplicado?: EmpresaCnaeDuplicadoTestData;
  currentEmpresaDireccionExtendida?: EmpresaDireccionExtendidaTestData;
  currentEmpresaIae?: EmpresaIaeTestData;
  currentEmpresaInformeCliente?: EmpresaInformeClienteTestData;
  currentMaestroContactos?: MaestroContactosTestData;
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
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60000);
