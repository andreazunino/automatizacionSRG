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
} from '../fixtures/contactos/contactosData';
import type {
  ConceptoComisionHuerfanoTestData,
  ConceptoComisionNoProtegidoTestData,
  NaturalezaT4TestData,
  ProductoComisionTestData,
  ProductoFinancieroTestData,
  TipologiaProductoTestData
} from '../fixtures/productos/productosData';
import type {
  BienDocumentosTestData,
  BienAgrupacionTestData,
  BienCargaHistoricoTestData,
  BienCargaHipotecariaTestData,
  BienCargaImportesNegativosTestData,
  BienSinAgrupacionTestData,
  BienBusquedaFiltrosTestData,
  BienPrincipalTestData,
  BienPropietariosExcesoTestData,
  BienPropietariosFechasTestData,
  BienPropietarioBajaTestData,
  BienPropietariosTestData,
  BienSeguridadCrudTestData,
  BienTasacionGarantiaTestData,
  BienTasacionJustificacionesTestData,
  BienTasacionManualTestData,
  MotivoSolicitudTestData,
  RegistroPropiedadTestData,
  SolicitudTasacionDominiosTestData,
  SolicitudTasacionWorkflowTestData,
  TipoBienTestData,
  TipoCargaTestData
} from '../fixtures/bienes/tipoBienData';
import { ConfiguracionContactosPage } from '../pages/ConfiguracionContactosPage';
import { ContactosPage } from '../pages/ContactosPage';
import { LoginPage } from '../pages/LoginPage';
import { BienesPage } from '../pages/BienesPage';
import { ProductosPage } from '../pages/ProductosPage';

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  contactosPage!: ContactosPage;
  configuracionContactosPage!: ConfiguracionContactosPage;
  bienesPage!: BienesPage;
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
  currentBienDocumentos?: BienDocumentosTestData;
  currentBienAgrupacion?: BienAgrupacionTestData;
  currentBienCargaHistorico?: BienCargaHistoricoTestData;
  currentBienCargaHipotecaria?: BienCargaHipotecariaTestData;
  currentBienCargaImportesNegativos?: BienCargaImportesNegativosTestData;
  currentBienSinAgrupacion?: BienSinAgrupacionTestData;
  currentBienBusquedaFiltros?: BienBusquedaFiltrosTestData;
  currentBienPropietarios?: BienPropietariosTestData;
  currentBienPropietariosExceso?: BienPropietariosExcesoTestData;
  currentBienPropietariosFechas?: BienPropietariosFechasTestData;
  currentBienPropietarioBaja?: BienPropietarioBajaTestData;
  currentBienSeguridadCrud?: BienSeguridadCrudTestData;
  currentBienTasacionManual?: BienTasacionManualTestData;
  currentBienTasacionGarantia?: BienTasacionGarantiaTestData;
  currentBienTasacionJustificaciones?: BienTasacionJustificacionesTestData;
  currentTipoBien?: TipoBienTestData;
  currentBienPrincipal?: BienPrincipalTestData;
  currentTipoCarga?: TipoCargaTestData;
  currentRegistroPropiedad?: RegistroPropiedadTestData;
  currentMotivoSolicitud?: MotivoSolicitudTestData;
  currentSolicitudTasacionDominios?: SolicitudTasacionDominiosTestData;
  currentSolicitudTasacionWorkflow?: SolicitudTasacionWorkflowTestData;
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
    this.bienesPage = new BienesPage(this.page);
    this.productosPage = new ProductosPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60000);



