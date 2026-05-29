import { odooCommonSelectors } from './odooCommonSelectors';

export const bienesSelectors = {
  ...odooCommonSelectors,
  pageTitleText: /Tipo de Bienes|Tipos de Bienes|Bienes/i,
  validationText:
    '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger, .o_field_invalid, .is-invalid',
  invalidField: '[aria-invalid="true"], .o_field_invalid, .is-invalid, .o_form_invalid',
  descriptionInput:
    'div[name="name"] input, div[name="description"] input, div[name="descripcion"] input, input[name="name"], input[name="description"], input[name="descripcion"], h1 input',
  tipoGtiInput:
    'div[name="tipo_gti"] input, div[name="type_gti"] input, div[name="gti_type"] input, input[name="tipo_gti"], input[name="type_gti"], input[name="gti_type"]',
  tipoBeInput:
    'div[name="tipo_be"] input, div[name="type_be"] input, div[name="be_type"] input, input[name="tipo_be"], input[name="type_be"], input[name="be_type"]',
  limitarResponsabilidadPrincipalInput:
    'div[name="limit_resp_prin"] input, div[name="limitar_resp_prin"] input, div[name="limitar_responsabilidad_principal"] input, div[name="limit_main_responsibility"] input, input[name="limit_resp_prin"], input[name="limitar_resp_prin"], input[name="limitar_responsabilidad_principal"], input[name="limit_main_responsibility"]',
  registroPropiedad: {
    pageTitleText: /Registro Propiedad|Registros de Propiedad|Registro de Propiedad|Bienes/i,
    codeInput:
      'div[name="code"] input, div[name="codigo"] input, div[name="cod_registro"] input, div[name="registry_code"] input, input[name="code"], input[name="codigo"], input[name="cod_registro"], input[name="registry_code"]',
    descriptionInput:
      'div[name="name"] input, div[name="description"] input, div[name="descripcion"] input, input[name="name"], input[name="description"], input[name="descripcion"], h1 input',
    addressInput:
      'div[name="street"] input, div[name="direccion"] input, div[name="address"] input, input[name="street"], input[name="direccion"], input[name="address"]',
    postalCodeInput:
      'div[name="zip"] input, div[name="codigo_postal"] input, div[name="postal_code"] input, input[name="zip"], input[name="codigo_postal"], input[name="postal_code"]',
    cityInput:
      'div[name="city"] input, div[name="poblacion"] input, div[name="town"] input, input[name="city"], input[name="poblacion"], input[name="town"]',
    phoneInput:
      'div[name="phone"] input, div[name="telefono"] input, input[name="phone"], input[name="telefono"]',
    emailInput:
      'div[name="email"] input, div[name="correo"] input, input[name="email"], input[name="correo"]',
    webInput:
      'div[name="website"] input, div[name="web"] input, input[name="website"], input[name="web"]',
    labels: {
      codigo: 'Cod. Registro',
      descripcion: 'Descripcion',
      direccion: 'Direccion',
      codigoPostal: 'CP',
      poblacion: 'Poblacion',
      telefono: 'Telefono',
      email: 'Email',
      web: 'Web'
    }
  },
  motivosSolicitud: {
    pageTitleText: /Motivos de Solicitud|Motivo de Solicitud|Bienes/i,
    motivoInput:
      'div[name="motivo"] input, div[name="reason"] input, div[name="request_reason"] input, div[name="motivo_id"] input, div[name="reason_id"] input, input[name="motivo"], input[name="reason"], input[name="motivo_id"], input[name="reason_id"]',
    tipoSolicitudInput:
      'div[name="tipo_solicitud"] input, div[name="request_type"] input, div[name="tipo_solicitud_id"] input, div[name="request_type_id"] input, div[name="secondary_type"] input, input[name="tipo_solicitud"], input[name="request_type"], input[name="tipo_solicitud_id"], input[name="request_type_id"], input[name="secondary_type"]',
    nombreCompletoInput:
      'div[name="name"] input, div[name="display_name"] input, div[name="nombre_completo"] input, input[name="name"], input[name="display_name"], input[name="nombre_completo"], h1 input',
    labels: {
      motivo: 'Motivo',
      tipoSolicitud: 'Tipo de Solicitud',
      nombreCompleto: 'Nombre completo'
    }
  },
  tiposCarga: {
    pageTitleText: /Tipos de Carga|Tipo de Carga|Bienes/i,
    codeInput:
      'div[name="code"] input, div[name="codigo"] input, div[name="cod"] input, input[name="code"], input[name="codigo"], input[name="cod"]',
    descriptionInput:
      'div[name="name"] input, div[name="description"] input, div[name="descripcion"] input, input[name="name"], input[name="description"], input[name="descripcion"], h1 input',
    sequenceInput:
      'div[name="sequence"] input, div[name="secuencia"] input, input[name="sequence"], input[name="secuencia"]',
    cargaFavorSgrInput:
      'div[name="carga_favor_sgr"] input, div[name="is_sgr_charge"] input, div[name="sgr_charge"] input, input[name="carga_favor_sgr"], input[name="is_sgr_charge"], input[name="sgr_charge"]',
    labels: {
      codigo: 'Código',
      descripcion: 'Descripción',
      secuencia: 'Secuencia',
      cargaFavorSgr: 'Carga a favor de la SGR'
    }
  },
  bienes: {
    pageTitleText: /Bienes|Bien/i,
    codeInput:
      'div[name="code_registry"] input, div[name="code"] input, div[name="codigo"] input, input[name="code_registry"], input[name="code"], input[name="codigo"]',
    descriptionInput:
      'div[name="name"] input, div[name="description"] input, div[name="descripcion"] input, input[name="name"], input[name="description"], input[name="descripcion"], h1 input',
    typeInput:
      'div[name="type_asset"] input, div[name="asset_type_id"] input, div[name="tipo_bien_id"] input, div[name="tipo_id"] input, div[name="type_id"] input, input[name="type_asset"], input[name="asset_type_id"], input[name="tipo_bien_id"], input[name="tipo_id"], input[name="type_id"]',
    guaranteeTypeInput:
      'div[name="guarantee_type_id"] input, div[name="tipo_garantia_id"] input, div[name="warranty_type_id"] input, input[name="guarantee_type_id"], input[name="tipo_garantia_id"], input[name="warranty_type_id"]',
    fechaNoSimpleInput:
      'div[name="date_simple_note"] input, div[name="fecha_no_simple"] input, div[name="fecha_nota_simple"] input, div[name="simple_note_date"] input, div[name="non_simple_date"] input, div[name="fecha_simple"] input, input[name="date_simple_note"], input[name="fecha_no_simple"], input[name="fecha_nota_simple"], input[name="simple_note_date"], input[name="non_simple_date"], input[name="fecha_simple"]',
    registroPropiedadInput:
      'div[name="registry_property"] input, div[name="property_registry_id"] input, div[name="registro_propiedad_id"] input, div[name="registry_id"] input, input[name="registry_property"], input[name="property_registry_id"], input[name="registro_propiedad_id"], input[name="registry_id"]',
    libroInput:
      'div[name="book"] input, div[name="libro"] input, input[name="book"], input[name="libro"]',
    hojaInput:
      'div[name="sheet"] input, div[name="hoja"] input, input[name="sheet"], input[name="hoja"]',
    folioInput:
      'div[name="folio"] input, input[name="folio"]',
    numeroFincaInput:
      'div[name="building_number"] input, div[name="farm_number"] input, div[name="numero_finca"] input, div[name="finca"] input, input[name="building_number"], input[name="farm_number"], input[name="numero_finca"], input[name="finca"]',
    referenciaCatastralInput:
      'div[name="cadastral_reference"] input, div[name="referencia_catastral"] input, input[name="cadastral_reference"], input[name="referencia_catastral"]',
    superficieEdificadaInput:
      'div[name="build_area"] input, div[name="built_surface"] input, div[name="superficie_edificada"] input, input[name="build_area"], input[name="built_surface"], input[name="superficie_edificada"]',
    superficieUtilInput:
      'div[name="useful_surface"] input, div[name="superficie_util"] input, input[name="useful_surface"], input[name="superficie_util"]',
    valorMercadoInput:
      'div[name="budget_value"] input, div[name="market_value"] input, div[name="valor_mercado"] input, input[name="budget_value"], input[name="market_value"], input[name="valor_mercado"]',
    llavesInput:
      'div[name="keys"] input, div[name="llaves"] input, input[name="keys"], input[name="llaves"]',
    ocupadoInput:
      'div[name="ocuppied"] input, div[name="occupied"] input, div[name="ocupado"] input, input[name="ocuppied"], input[name="occupied"], input[name="ocupado"]',
    documentsButton:
      '.oe_stat_button:has-text("Documentos"), .oe_stat_button:has-text("Documents"), button:has-text("Documentos"), button:has-text("Documents"), a:has-text("Documentos"), a:has-text("Documents")',
    documentsCounter: '.o_stat_value, .stat_value, [class*="stat_value"]',
    documentsRows:
      '.o_kanban_record, .o_data_row, tbody tr, .o_documents_kanban .o_kanban_record, .o_document_kanban .o_kanban_record',
    activeSearchItems: '.o_searchview_facet, .o_searchview .badge, .o_searchview .o_facet_value',
    searchRemoveButtons: '.o_searchview_facet .o_facet_remove, .o_searchview .o_facet_remove, .o_searchview .fa-remove',
    filterOption:
      '.dropdown-item, [role="menuitem"], [role="option"], button, span.o_menu_item',
    groupByButton:
      'button:has-text("Agrupar por"), button:has-text("Group By"), .o_searchview_dropdown_toggler',
    groupHeader: '.o_group_header, .o_kanban_group, tr.o_group_header',
    propietarios: {
      rows:
        'div[name="owner_ids"] tr.o_data_row, div[name="propietario_ids"] tr.o_data_row, div[name="property_owner_ids"] tr.o_data_row, div[name="owners_ids"] tr.o_data_row',
      selectedRow:
        'div[name="owner_ids"] tr.o_selected_row, div[name="propietario_ids"] tr.o_selected_row, div[name="property_owner_ids"] tr.o_selected_row, div[name="owners_ids"] tr.o_selected_row',
      addLineButton:
        'div[name="owner_ids"] a:has-text("Agregar"), div[name="owner_ids"] a:has-text("Añadir"), div[name="propietario_ids"] a:has-text("Agregar"), div[name="propietario_ids"] a:has-text("Añadir"), div[name="property_owner_ids"] a:has-text("Agregar"), div[name="property_owner_ids"] a:has-text("Añadir"), div[name="owners_ids"] a:has-text("Agregar"), div[name="owners_ids"] a:has-text("Añadir")',
      propietarioInput:
        'td[name="partner_id"] input, td[name="owner_id"] input, td[name="propietario_id"] input, td[name="contact_id"] input, td input[role="combobox"]',
      porcentajeInput:
        'td[name="percentage"] input, td[name="porcentaje"] input, td[name="ownership_percentage"] input, td[name="percent"] input, td input[type="number"]',
      fechaAdquisicionInput:
        'td[name="acquisition_date"] input, td[name="fecha_adquisicion"] input, td[name="date_acquisition"] input, td input.o_datepicker_input',
      fechaBajaInput:
        'td[name="end_date"] input, td[name="fecha_baja"] input, td[name="date_to"] input, td[name="baja"] input, td input.o_datepicker_input',
      registrarPropiedadInput:
        'td[name="registry_owner"] input, td[name="registrar_propiedad"] input, td[name="registro_propiedad"] input, td[name="is_registry_owner"] input, td input[type="checkbox"]',
      removeLineButton:
        'button[aria-label="Eliminar"], button[title="Eliminar"], .fa-trash, .o_list_record_remove',
      totalPorcentajeInput:
        'div[name="total_active_owner_percentage"] input, div[name="total_porcentaje_propietarios_activos"] input, div[name="total_percent_owners"] input, input[name="total_active_owner_percentage"], input[name="total_porcentaje_propietarios_activos"], input[name="total_percent_owners"]',
      totalPorcentajeValue:
        'div[name="total_active_owner_percentage"], div[name="total_porcentaje_propietarios_activos"], div[name="total_percent_owners"]'
    },
    agrupacion: {
      rows:
        'div[name="grouped_asset_ids"] tr.o_data_row, div[name="agrupacion_ids"] tr.o_data_row, div[name="child_asset_ids"] tr.o_data_row, div[name="bienes_agrupados_ids"] tr.o_data_row',
      selectedRow:
        'div[name="grouped_asset_ids"] tr.o_selected_row, div[name="agrupacion_ids"] tr.o_selected_row, div[name="child_asset_ids"] tr.o_selected_row, div[name="bienes_agrupados_ids"] tr.o_selected_row',
      addLineButton:
        'div[name="grouped_asset_ids"] a:has-text("Agregar"), div[name="grouped_asset_ids"] a:has-text("Añadir"), div[name="agrupacion_ids"] a:has-text("Agregar"), div[name="agrupacion_ids"] a:has-text("Añadir"), div[name="child_asset_ids"] a:has-text("Agregar"), div[name="child_asset_ids"] a:has-text("Añadir"), div[name="bienes_agrupados_ids"] a:has-text("Agregar"), div[name="bienes_agrupados_ids"] a:has-text("Añadir")',
      bienInput:
        'td[name="asset_id"] input, td[name="bien_id"] input, td[name="child_asset_id"] input, td[name="finca_id"] input, td input[role="combobox"]',
      removeLineButton:
        'button[aria-label="Eliminar"], button[title="Eliminar"], .fa-trash, .o_list_record_remove',
      fincaAgrupadoraInput:
        'div[name="parent_asset_id"] input, div[name="finca_agrupadora_id"] input, div[name="grouping_asset_id"] input, input[name="parent_asset_id"], input[name="finca_agrupadora_id"], input[name="grouping_asset_id"]',
      ungroupButton:
        'button:has-text("Desagrupar"), a:has-text("Desagrupar"), .dropdown-item:has-text("Desagrupar"), [role="button"]:has-text("Desagrupar")'
    },
    cargas: {
      rows:
        'div[name="charge_ids"] tr.o_data_row, div[name="carga_ids"] tr.o_data_row, div[name="mortgage_charge_ids"] tr.o_data_row, div[name="traba_ids"] tr.o_data_row',
      selectedRow:
        'div[name="charge_ids"] tr.o_selected_row, div[name="carga_ids"] tr.o_selected_row, div[name="mortgage_charge_ids"] tr.o_selected_row, div[name="traba_ids"] tr.o_selected_row',
      addLineButton:
        'div[name="charge_ids"] a:has-text("Agregar"), div[name="charge_ids"] a:has-text("Añadir"), div[name="carga_ids"] a:has-text("Agregar"), div[name="carga_ids"] a:has-text("Añadir"), div[name="mortgage_charge_ids"] a:has-text("Agregar"), div[name="mortgage_charge_ids"] a:has-text("Añadir"), div[name="traba_ids"] a:has-text("Agregar"), div[name="traba_ids"] a:has-text("Añadir")',
      descriptionInput:
        'td[name="name"] input, td[name="description"] input, td[name="descripcion"] input, td input[name="name"], td input[name="description"], td input[name="descripcion"]',
      tipoCargaInput:
        'td[name="charge_type_id"] input, td[name="tipo_carga_id"] input, td[name="type_id"] input, td input[role="combobox"]',
      beneficiarioInput:
        'td[name="beneficiary_id"] input, td[name="beneficiario_id"] input, td[name="partner_id"] input, td input[role="combobox"]',
      fechaBajaInput:
        'td[name="end_date"] input, td[name="fecha_baja"] input, td[name="date_to"] input, td input.o_datepicker_input',
      importePrincipalInput:
        'td[name="principal_amount"] input, td[name="importe_principal"] input, td[name="principal"] input, td input[type="number"]',
      interesesOrdinariosInput:
        'td[name="ordinary_interest"] input, td[name="intereses_ordinarios"] input, td[name="interes_ordinario"] input, td input[type="number"]',
      interesesDemoraInput:
        'td[name="default_interest"] input, td[name="intereses_demora"] input, td[name="interes_demora"] input, td input[type="number"]',
      gastosInput:
        'td[name="expenses"] input, td[name="gastos"] input, td input[type="number"]',
      totalResponsabilidadInput:
        'td[name="total_mortgage_liability"] input, td[name="total_resp_hipotecaria_principal"] input, td[name="total_responsabilidad"] input',
      totalResponsabilidadCell:
        'td[name="total_mortgage_liability"], td[name="total_resp_hipotecaria_principal"], td[name="total_responsabilidad"]',
      historicoButton:
        'button:has-text("Ver histórico"), button:has-text("Ver historico"), a:has-text("Ver histórico"), a:has-text("Ver historico")',
      vigentesButton:
        'button:has-text("Ver vigentes"), a:has-text("Ver vigentes"), button:has-text("Cargas vigentes"), a:has-text("Cargas vigentes")'
    },
    tasaciones: {
      rows:
        'div[name="appraisal_ids"] tr.o_data_row, div[name="tasacion_ids"] tr.o_data_row, div[name="valuation_ids"] tr.o_data_row, div[name="asset_appraisal_ids"] tr.o_data_row',
      selectedRow:
        'div[name="appraisal_ids"] tr.o_selected_row, div[name="tasacion_ids"] tr.o_selected_row, div[name="valuation_ids"] tr.o_selected_row, div[name="asset_appraisal_ids"] tr.o_selected_row',
      addLineButton:
        'div[name="appraisal_ids"] a:has-text("Agregar"), div[name="appraisal_ids"] a:has-text("AÃ±adir"), div[name="tasacion_ids"] a:has-text("Agregar"), div[name="tasacion_ids"] a:has-text("AÃ±adir"), div[name="valuation_ids"] a:has-text("Agregar"), div[name="valuation_ids"] a:has-text("AÃ±adir"), div[name="asset_appraisal_ids"] a:has-text("Agregar"), div[name="asset_appraisal_ids"] a:has-text("AÃ±adir")',
      sequenceCell:
        'td[name="name"], td[name="code"], td[name="tasacion"], td[name="appraisal_code"], td[name="appraisal_sequence"]',
      tipoTasacionInput:
        'td[name="appraisal_type"] input, td[name="tipo_tasacion"] input, td[name="type_id"] input, td input[role="combobox"]',
      fechaValorInput:
        'td[name="value_date"] input, td[name="fecha_valor"] input, td[name="date_value"] input, td input.o_datepicker_input',
      fechaCaducidadInput:
        'td[name="expiration_date"] input, td[name="fecha_caducidad"] input, td[name="date_expiration"] input, td input.o_datepicker_input',
      tipoValoracionInput:
        'td[name="valuation_type_id"] input, td[name="tipo_valoracion_id"] input, td[name="value_type_id"] input, td input[role="combobox"]',
      valorInput:
        'td[name="value"] input, td[name="valor"] input, td[name="amount"] input, td[name="appraisal_value"] input, td input[type="number"]',
      cumpleEcoInput:
        'td[name="eco_compliant"] input, td[name="cumple_eco"] input, td[name="is_eco"] input, td input[type="checkbox"]',
      tasadoraInput:
        'td[name="valuer_id"] input, td[name="tasadora_id"] input, td[name="appraiser_id"] input, td input[role="combobox"]',
      metodoTasacionInput:
        'td[name="appraisal_method_id"] input, td[name="metodo_tasacion_id"] input, td[name="method_id"] input, td input[role="combobox"]',
      ultimaTasacionInput:
        'div[name="last_appraisal_id"] input, div[name="ultima_tasacion_id"] input, div[name="last_valuation_id"] input, input[name="last_appraisal_id"], input[name="ultima_tasacion_id"], input[name="last_valuation_id"]',
      fechaUltimaTasacionInput:
        'div[name="last_appraisal_date"] input, div[name="fecha_ultima_tasacion"] input, div[name="last_valuation_date"] input, input[name="last_appraisal_date"], input[name="fecha_ultima_tasacion"], input[name="last_valuation_date"]'
    },
    labels: {
      codigo: 'Código',
      descripcion: 'Descripción',
      tipo: 'Tipo',
      tipoGarantia: 'Tipo de garantía',
      fechaNoSimple: 'Fecha Nota Simple',
      registroPropiedad: 'Reg. Propiedad',
      libro: 'Libro',
      hoja: 'Hoja',
      folio: 'Folio',
      numeroFinca: 'Número de Finca',
      referenciaCatastral: 'Ref. Catastral',
      superficieEdificada: 'Superficie Edificada',
      superficieUtil: 'Superficie Útil',
      valorMercado: 'Valor de Mercado',
      llaves: 'Llaves',
      ocupado: 'Ocupado',
      tabPropietarios: 'Propietarios',
      tabAgrupacion: 'Agrupación de Bienes',
      fincaAgrupadora: 'Finca agrupadora',
      tabCargas: 'Trabas / Cargas',
      tabTasaciones: 'Tasaciones',
      ultimaTasacion: 'Última Tasación',
      fechaUltimaTasacion: 'Fecha Última Tasación',
      totalPorcentajePropietariosActivos: 'Total % propietarios activos',
      tabOtrosDatos: 'Otros datos',
      tabInformacionJuridica: 'Información jurídica'
    }
  },
  solicitudesTasacion: {
    pageTitleText: /Solicitudes de Tasaci[oó]n|Solicitud de Tasaci[oó]n|Tasaci[oó]n|Bienes/i,
    titularInput:
      'div[name="partner_id"] input, div[name="titular_id"] input, div[name="owner_id"] input, input[name="partner_id"], input[name="titular_id"], input[name="owner_id"]',
    bienInput:
      'div[name="asset_id"] input, div[name="bien_id"] input, div[name="property_id"] input, input[name="asset_id"], input[name="bien_id"], input[name="property_id"]',
    tasadoraInput:
      'div[name="valuer_id"] input, div[name="tasadora_id"] input, div[name="appraiser_id"] input, input[name="valuer_id"], input[name="tasadora_id"], input[name="appraiser_id"]',
    motivoInput:
      'div[name="request_reason_id"] input, div[name="motivo_id"] input, div[name="reason_id"] input, input[name="request_reason_id"], input[name="motivo_id"], input[name="reason_id"]',
    estadoInput:
      'div[name="state"] input, div[name="estado"] input, input[name="state"], input[name="estado"]',
    estadoValue:
      'div[name="state"], div[name="estado"], span[name="state"], span[name="estado"]',
    noRecordsOption:
      '.o-autocomplete--dropdown-item:has-text("No hay registros"), .o-autocomplete--dropdown-item:has-text("No records"), .dropdown-menu:has-text("No hay registros"), .dropdown-menu:has-text("No records"), [role="option"]:has-text("No hay registros"), [role="option"]:has-text("No records")',
    labels: {
      titular: 'Titular',
      bien: 'Bien',
      tasadora: 'Tasadora',
      motivo: 'Motivo',
      estado: 'Estado'
    }
  },
  labels: {
    descripcion: 'Descripcion',
    tipoGti: 'Tipo GTI',
    tipoBe: 'Tipo BE',
    limitarResponsabilidadPrincipal: 'Limitar con Resp. Prin.'
  }
} as const;
