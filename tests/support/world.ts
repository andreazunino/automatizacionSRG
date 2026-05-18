import { setDefaultTimeout, setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import type {
  EmpresaBancoEspanaTestData,
  EmpresaCnaeTestData,
  EmpresaDireccionExtendidaTestData,
  EmpresaIaeTestData,
  EmpresaRegistroMercantilTestData,
  EmpresaRepresentanteTestData,
  PersonaFisicaDocumentoTestData,
  PersonaFisicaTestData
} from '../fixtures/testData';
import { ContactosPage } from '../pages/ContactosPage';
import { LoginPage } from '../pages/LoginPage';

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  contactosPage!: ContactosPage;
  currentPersonaFisica?: PersonaFisicaTestData;
  currentPersonaFisicaDocumento?: PersonaFisicaDocumentoTestData;
  currentEmpresaBancoEspana?: EmpresaBancoEspanaTestData;
  currentEmpresaCnae?: EmpresaCnaeTestData;
  currentEmpresaDireccionExtendida?: EmpresaDireccionExtendidaTestData;
  currentEmpresaIae?: EmpresaIaeTestData;
  currentEmpresaRegistroMercantil?: EmpresaRegistroMercantilTestData;
  currentEmpresaRepresentante?: EmpresaRepresentanteTestData;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initializePages(): void {
    this.loginPage = new LoginPage(this.page);
    this.contactosPage = new ContactosPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60000);
