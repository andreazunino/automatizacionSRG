export const selectors = {
  login: {
    usernameInput: 'input[name="login"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    homeTitle: '.o_main_navbar, .o_home_menu, .o_app'
  },
  common: {
    successMessage: '[data-testid="success-message"]',
    errorMessage: '[data-testid="error-message"]',
    unexpectedErrorDialog:
      '.modal:has-text("Se ha producido un error"), .modal:has-text("¡Uy!"), .o_dialog:has-text("Se ha producido un error"), .o_error_dialog, .o_technical_modal',
    validationMessage:
      '[data-testid="validation-message"], .o_notification, .o_notification_content, .invalid-feedback, .text-danger',
    invalidField: '[aria-invalid="true"], .o_field_invalid, .is-invalid, .o_form_invalid'
  },
  contactos: {
    menuLink: 'a[href="/odoo/contacts"], a:has-text("Contactos")',
    pageTitle: '.o_control_panel .breadcrumb, .o_breadcrumb, nav:has-text("Contactos")',
    pageTitleText: /Contactos/i,
    newButton: 'button:has-text("Nuevo")',
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    resultsTable: '.o_list_table, table',
    firstResult: '.o_data_row:first-child, tbody tr:first-child',
    editButton: 'button:has-text("Editar")',
    deleteButton: '.o_cp_action_menus button, button:has-text("Acción")',
    confirmDeleteButton: '.modal button:has-text("Eliminar"), .modal button:has-text("Aceptar")',
    form: {
      saveButton: 'button[aria-label="Guardar manualmente"], button:has-text("Guardar")',
      nombreInput: '[data-testid="contacto-nombre"]',
      apellidoInput: '[data-testid="contacto-apellido"]',
      emailInput: '[data-testid="contacto-email"]',
      telefonoInput: '[data-testid="contacto-telefono"]',
      documentoInput: '[data-testid="contacto-documento"]'
    },
    personaFisica: {
      ageField:
        'xpath=//*[normalize-space()="Edad" or normalize-space()="Edad?"]/following::*[self::input or self::span or self::div][1]',
      birthDateInput: 'div[name="fecha_nacimiento"] input, input[data-field="fecha_nacimiento"]',
      birthCountryInput:
        'div[name="pais_nacimiento_id"] input, div[name="country_birth_id"] input, div[name="birth_country_id"] input',
      validationDialogCloseButton: '.modal button:has-text("Cerrar"), .modal button:has-text("Aceptar")',
      fallecidoInput:
        'div[name="fallecido"] input, div[name="is_deceased"] input, div[name="deceased"] input, input[name="fallecido"], input[name="is_deceased"], input[name="deceased"]',
      personaPublicaInput:
        'div[name="persona_publica"] input, div[name="is_public_person"] input, div[name="public_person"] input, input[name="persona_publica"], input[name="is_public_person"], input[name="public_person"]',
      labels: {
        typeFisico: 'Físico',
        nombre: 'Nombre?',
        primerApellido: 'Primer Apellido?',
        segundoApellido: 'Segundo Apellido',
        nif: 'NIF?',
        tipoDocumento: 'Tipo de documento?',
        tabPersonasFisicas: 'Personas Físicas',
        fechaNacimiento: 'Fecha de nacimiento?',
        sexo: 'Sexo?',
        paisNacimiento: 'País de nacimiento?',
        fallecido: 'Fallecido/a',
        personaPublica: 'Persona Pública'
      }
    },
    empresa: {
      labels: {
        typeJuridico: 'Jurídico',
        nombre: 'Nombre',
        tabJuridicas: 'Jurídicas',
        tabPersonasRelacionadas: 'Personas relacionadas',
        tabCodigosCnae: 'Códigos CNAE',
        tabInformacionFiscalIae: 'Información Fiscal / IAE',
        tabInformeCliente: 'Informe Cliente',
        tabBancoEspana: 'Banco de España',
        tabRegistroMercantil: 'Registro Mercantil',
        situacionBe: 'Situación BE',
        vinculacionAapp: 'Vinculación AAPP',
        sectorInstitucional: 'Sector Institucional',
        provinciaInscripcion: 'Provincia de inscripción',
        fechaInscripcion: 'Fecha de inscripción',
        tomo: 'Tomo',
        folio: 'Folio',
        hoja: 'Hoja',
        inscripcion: 'Inscripción',
        tipoVia: 'Tipo de vía',
        numero: 'Número',
        planta: 'Planta',
        puerta: 'Puerta',
        codigoPostal: 'Código Postal'
      },
      nameInput: 'div[name="name"] input, h1 input[placeholder*="Lumber"], h1 input',
      informeCliente: {
        experienciaCliente:
          'div[name="experiencia_cliente"] textarea, div[name="experiencia_cliente"] input, textarea[name="experiencia_cliente"], input[name="experiencia_cliente"]',
        descripcionActividad:
          'div[name="descripcion_actividad"] textarea, div[name="descripcion_actividad"] input, textarea[name="descripcion_actividad"], input[name="descripcion_actividad"]',
        instalacionesMaquinaria:
          'div[name="instalaciones_maquinaria"] textarea, div[name="instalaciones_maquinaria"] input, textarea[name="instalaciones_maquinaria"], input[name="instalaciones_maquinaria"]',
        proveedoresHabituales:
          'div[name="proveedores_cliente"] textarea, div[name="proveedores_habituales"] textarea, div[name="proveedores_cliente"] input, div[name="proveedores_habituales"] input, textarea[name="proveedores_cliente"], textarea[name="proveedores_habituales"], input[name="proveedores_cliente"], input[name="proveedores_habituales"]',
        clientesRelevantes:
          'div[name="clientes_relevantes"] textarea, div[name="clientes_relevantes"] input, textarea[name="clientes_relevantes"], input[name="clientes_relevantes"]'
      },
      direccionAutocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
      tipoViaInput:
        'div[name="street_type_id"] input, div[name="tipo_via_id"] input, div[name="tipo_via"] input, input[name="street_type_id"], input[name="tipo_via_id"]',
      numeroInput:
        'div[name="street_number"] input, div[name="numero"] input, div[name="numero_via"] input, input[name="street_number"], input[name="numero"], input[name="numero_via"]',
      plantaInput:
        'div[name="floor"] input, div[name="planta"] input, input[name="floor"], input[name="planta"]',
      puertaInput:
        'div[name="door"] input, div[name="puerta"] input, input[name="door"], input[name="puerta"]',
      codigoPostalInput:
        'div[name="zip_id"] input, div[name="codigo_postal_id"] input, div[name="zip"] input, div[name="zipcode"] input, div[name="codigo_postal"] input, input[name="zip_id"], input[name="codigo_postal_id"], input[name="zip"], input[name="zipcode"], input[name="codigo_postal"]',
      cnaeRows: 'div[name="cnae_ids"] tbody tr:has(td[name="cnae_id"])',
      personasRelacionadasRows:
        'div[name="advisor_ids"] tr.o_data_row, div[name="representative_ids"] tr.o_data_row, div[name="related_person_ids"] tr.o_data_row, div[name="admin_ids"] tr.o_data_row',
      personasRelacionadasAddLineButton:
        'div[name="advisor_ids"] a:has-text("Agregar"), div[name="advisor_ids"] a:has-text("Añadir"), div[name="representative_ids"] a:has-text("Agregar"), div[name="representative_ids"] a:has-text("Añadir"), div[name="related_person_ids"] a:has-text("Agregar"), div[name="related_person_ids"] a:has-text("Añadir"), div[name="admin_ids"] a:has-text("Agregar"), div[name="admin_ids"] a:has-text("Añadir")',
      personaRelacionadaInput:
        'td[name="partner_id"] input, td[name="rel_partner_id"] input, td[name="person_id"] input, td[name="nombre_completo"] input, td input[role="combobox"]',
      tipoVinculacionInput:
        'td[name="partner_vinculation_id"] input, td[name="vinculation_id"] input, td[name="cargo_id"] input, td[name="tipo"] input, td input[role="combobox"]',
      cnaeSelectedRow: 'div[name="cnae_ids"] tr.o_selected_row',
      cnaeAddLineButton:
        'div[name="cnae_ids"] a:has-text("Agregar"), div[name="cnae_ids"] a:has-text("Añadir"), div[name="cnae_ids"] button:has-text("Agregar"), div[name="cnae_ids"] button:has-text("Añadir")',
      cnaeInput:
        'div[name="cnae_ids"] input[role="combobox"], div[name="cnae_ids"] .o_field_many2one input, div[name="cnae_ids"] input',
      cnaeCellInput: 'td[name="cnae_id"] input[role="combobox"], td[name="cnae_id"] input',
      cnaePrincipalInput: 'input[type="radio"], input[type="checkbox"], .o_field_boolean input, .o_radio_input',
      cnaeAutocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
      cnaeHeaderPrincipal:
        'xpath=//*[contains(normalize-space(), "CNAE principal") or contains(normalize-space(), "Principal")]',
      actividadEconomicaInput:
        'div[name="economic_activity"] input, div[name="actividad_economica"] input, div[name="is_economic_activity"] input, input[name="economic_activity"], input[name="actividad_economica"]',
      iaeRows:
        'div[name="iae_ids"] tr.o_data_row, div[name="epigrafe_ids"] tr.o_data_row, div[name="iae_line_ids"] tr.o_data_row',
      iaeAddLineButton:
        'div[name="iae_ids"] a:has-text("Agregar"), div[name="iae_ids"] a:has-text("Añadir"), div[name="epigrafe_ids"] a:has-text("Agregar"), div[name="epigrafe_ids"] a:has-text("Añadir"), div[name="iae_line_ids"] a:has-text("Agregar"), div[name="iae_line_ids"] a:has-text("Añadir")',
      iaeEpigrafeInput:
        'td[name="iae_code_id"] input, td[name="epigrafe_id"] input, td[name="iae_id"] input, td[name="activity_id"] input, td input[role="combobox"]',
      iaePrincipalInput: 'td[name="principal"] input, td[name="is_primary"] input, input[type="radio"], input[type="checkbox"]',
      iaeFechaInicioInput:
        'td[name="start_date"] input, td[name="fecha_inicio"] input, td[name="date_from"] input, td input.o_datepicker_input',
      iaeFechaBajaInput:
        'td[name="end_date"] input, td[name="fecha_baja"] input, td[name="date_to"] input, td input.o_datepicker_input',
      iaeAutocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
      bancoEspanaAutocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
      registroMercantilAutocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
      situacionBeInput:
        'div[name="situacion_be_id"] input, div[name="be_situation_id"] input, div[name="situacion_be"] input, input[name="situacion_be_id"], input[name="be_situation_id"]',
      vinculacionAappInput:
        'div[name="vinculacion_aapp_id"] input, div[name="aapp_link_id"] input, div[name="vinculacion_aapp"] input, input[name="vinculacion_aapp_id"], input[name="aapp_link_id"]',
      sectorInstitucionalInput:
        'div[name="sector_institucional_id"] input, div[name="institutional_sector_id"] input, div[name="sector_institucional"] input, input[name="sector_institucional_id"], input[name="institutional_sector_id"]',
      provinciaInscripcionInput:
        'input[id^="registred_state"], input[id^="registered_state"], div[name="registred_state"] input, div[name="registered_state"] input, div[name="province_registry_id"] input, div[name="provincia_inscripcion_id"] input, div[name="provincia_registro_id"] input, div[name="registro_mercantil_provincia_id"] input, input[name="registred_state"], input[name="registered_state"], input[name="province_registry_id"], input[name="provincia_inscripcion_id"]',
      fechaInscripcionInput:
        'input[id^="incription_date"], input[id^="inscription_date"], div[name="incription_date"] input, div[name="inscription_date"] input, div[name="registry_date"] input, div[name="fecha_inscripcion"] input, div[name="registro_mercantil_fecha"] input, div[name="date_registry"] input, input[name="incription_date"], input[name="inscription_date"], input[name="registry_date"], input[name="fecha_inscripcion"]',
      tomoInput:
        'input[id^="tome"], div[name="tome"] input, div[name="registry_volume"] input, div[name="tomo"] input, div[name="registro_mercantil_tomo"] input, input[name="tome"], input[name="registry_volume"], input[name="tomo"]',
      folioInput:
        'input[id^="folio"], div[name="registry_page"] input, div[name="folio"] input, div[name="registro_mercantil_folio"] input, input[name="registry_page"], input[name="folio"]',
      hojaInput:
        'input[id^="sheet"], div[name="sheet"] input, div[name="registry_sheet"] input, div[name="hoja"] input, div[name="registro_mercantil_hoja"] input, input[name="sheet"], input[name="registry_sheet"], input[name="hoja"]',
      inscripcionInput:
        'input[id^="inscription"], div[name="inscription"] input, div[name="registry_entry"] input, div[name="inscripcion"] input, div[name="registro_mercantil_inscripcion"] input, input[name="inscription"], input[name="registry_entry"], input[name="inscripcion"]'
    }
  },
  configuracionContactos: {
    menus: {
      configuracion: 'Configuración',
      formasJuridicas: 'Formas jurídicas',
      vinculaciones: 'Vínculos de socios',
      tipologias: 'Tipología'
    },
    labels: {
      nombre: 'Nombre',
      codigo: 'Código'
    },
    form: {
      saveButton: 'button[aria-label="Guardar manualmente"], button:has-text("Guardar")',
      discardButton: 'button[aria-label="Descartar todos los cambios"], button:has-text("Descartar")',
      nameInput: 'div[name="name"] input, input[name="name"], input[placeholder*="Nombre"]',
      codeInput: 'div[name="code"] input, input[name="code"], div[name="codigo"] input, input[name="codigo"]',
      descriptionInput:
        'div[name="description"] textarea, div[name="descripcion"] textarea, div[name="description"] input, div[name="descripcion"] input, textarea[name="description"], textarea[name="descripcion"], input[name="description"], input[name="descripcion"]'
    },
    grupoEconomico: {
      memberRows: 'div[name="member_ids"] tr.o_data_row',
      decisionUnitCell: 'td[name="decision_unit_id"]',
      decisionUnitInput: 'td[name="decision_unit_id"] input[role="combobox"], td[name="decision_unit_id"] input',
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    firstResult: '.o_data_row:first-child, tbody tr:first-child',
    duplicateValidationDialog:
      '.modal:has-text("Error de validación"), .modal:has-text("duplic"), .o_dialog:has-text("Error de validación")',
    validationText:
      '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger',
    dialogCloseButton: '.modal button:has-text("Cerrar"), .modal button:has-text("Aceptar"), .o_dialog button:has-text("Cerrar")'
  },
  tipologias: {
    tagInput:
      'div[name="category_id"] input, div[name="category_ids"] input, div[name="typology_ids"] input, div[name="tipologia_ids"] input, div[name="tipologias_ids"] input',
    tagContainer:
      'div[name="category_id"], div[name="category_ids"], div[name="typology_ids"], div[name="tipologia_ids"], div[name="tipologias_ids"]',
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
    listFilterButton:
      'button:has-text("Filtros"), button:has-text("Filters"), .o_searchview_dropdown_toggler',
    typologyFilterOption:
      '[role="menuitem"]:has-text("Tipología"), [role="option"]:has-text("Tipología"), .dropdown-item:has-text("Tipología"), [role="menuitem"]:has-text("Tipologia"), [role="option"]:has-text("Tipologia"), .dropdown-item:has-text("Tipologia")'
  },
  productosComision: {
    pageTitleText: /Productos de comisi[oó]n|Producto de comisi[oó]n|Comisiones/i,
    newButton: 'button:has-text("Nuevo")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    nameInput: 'div[name="name"] input, input[name="name"], h1 input',
    labels: {
      nombre: 'Nombre',
      referenciaInterna: 'Referencia interna',
      tipo: 'Tipo',
      impuestosCliente: 'Impuestos cliente',
      impuestosProveedor: 'Impuestos proveedor'
    },
    fields: {
      referenciaInterna:
        'div[name="default_code"] input, div[name="internal_reference"] input, div[name="referencia_interna"] input, input[name="default_code"], input[name="internal_reference"], input[name="referencia_interna"]',
      tipo:
        'div[name="detailed_type"] input, div[name="type"] input, div[name="tipo"] input, input[name="detailed_type"], input[name="type"], input[name="tipo"]',
      impuestosCliente:
        'div[name="taxes_id"] input, div[name="tax_ids"] input, div[name="impuestos_cliente"] input, input[name="taxes_id"], input[name="tax_ids"], input[name="impuestos_cliente"]',
      impuestosProveedor:
        'div[name="supplier_taxes_id"] input, div[name="supplier_tax_ids"] input, div[name="impuestos_proveedor"] input, input[name="supplier_taxes_id"], input[name="supplier_tax_ids"], input[name="impuestos_proveedor"]'
    }
  },
  conceptosComision: {
    pageTitleText: /Conceptos de comisi[oó]n|Conceptos/i,
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    actionButton:
      'button:has-text("Acción"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
    deleteMenuItem:
      '.dropdown-item:has-text("Eliminar"), [role="menuitem"]:has-text("Eliminar"), button:has-text("Eliminar")',
    confirmDeleteButton:
      '.modal button:has-text("Eliminar"), .modal button:has-text("Aceptar"), [role="dialog"] button:has-text("Eliminar"), [role="dialog"] button:has-text("Aceptar")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    nameInput: 'div[name="name"] input, input[name="name"], h1 input',
    codeInput: 'div[name="code"] input, input[name="code"], div[name="codigo"] input, input[name="codigo"]',
    productoComisionInput:
      'div[name="commission_product_id"] input, div[name="producto_comision_id"] input, div[name="product_commission_id"] input, input[name="commission_product_id"], input[name="producto_comision_id"], input[name="product_commission_id"]',
    validationText:
      '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger',
    dialogCloseButton:
      '.modal button:has-text("Cerrar"), .modal button:has-text("Aceptar"), .o_dialog button:has-text("Cerrar"), .o_dialog button:has-text("Aceptar")'
  },
  tipologiasProducto: {
    pageTitleText: /Tipolog[ií]as de producto|Tipolog[ií]as|Tipolog[ií]a/i,
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    actionButton:
      'button:has-text("Acción"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
    archiveMenuItem:
      '.dropdown-item:has-text("Archivar"), [role="menuitem"]:has-text("Archivar"), button:has-text("Archivar")',
    confirmArchiveButton:
      '.modal button:has-text("Archivar"), .modal button:has-text("Aceptar"), .modal button:has-text("Confirmar"), [role="dialog"] button:has-text("Archivar"), [role="dialog"] button:has-text("Aceptar")',
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    nameInput: 'div[name="name"] input, input[name="name"], h1 input',
    validationText:
      '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger',
    dialogCloseButton:
      '.modal button:has-text("Cerrar"), .modal button:has-text("Aceptar"), .o_dialog button:has-text("Cerrar"), .o_dialog button:has-text("Aceptar")',
    listFilterButton:
      'button:has-text("Filtros"), button:has-text("Filters"), .o_searchview_dropdown_toggler',
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
  },
  naturalezaT4: {
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    actionButton:
      'button:has-text("Acción"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
    archiveMenuItem:
      '.dropdown-item:has-text("Archivar"), [role="menuitem"]:has-text("Archivar"), button:has-text("Archivar")',
    confirmArchiveButton:
      '.modal button:has-text("Archivar"), .modal button:has-text("Aceptar"), .modal button:has-text("Confirmar"), [role="dialog"] button:has-text("Archivar"), [role="dialog"] button:has-text("Aceptar")',
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    codeInput: 'div[name="code"] input, input[name="code"], div[name="codigo"] input, input[name="codigo"]',
    descriptionInput:
      'div[name="description"] input, div[name="description"] textarea, div[name="descripcion"] input, div[name="descripcion"] textarea, input[name="description"], textarea[name="description"], input[name="descripcion"], textarea[name="descripcion"]',
    grupoProductoNaturalezaT4Input:
      'div[name="naturaleza_t4_id"] input, div[name="nature_t4_id"] input, input[name="naturaleza_t4_id"], input[name="nature_t4_id"]',
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
  },
  productos: {
    pageTitleText: /Productos financieros|Productos/i,
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    actionButton:
      'button:has-text("Acción"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
    archiveMenuItem:
      '.dropdown-item:has-text("Archivar"), [role="menuitem"]:has-text("Archivar"), button:has-text("Archivar")',
    duplicateMenuItem:
      '.dropdown-item:has-text("Duplicar"), [role="menuitem"]:has-text("Duplicar"), button:has-text("Duplicar")',
    unarchiveButton:
      'button:has-text("Desarchivar"), button:has-text("Restaurar"), .dropdown-item:has-text("Desarchivar"), [role="menuitem"]:has-text("Desarchivar")',
    confirmArchiveButton:
      '.modal button:has-text("Archivar"), .modal button:has-text("Aceptar"), .modal button:has-text("Confirmar"), [role="dialog"] button:has-text("Archivar"), [role="dialog"] button:has-text("Aceptar")',
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    nameInput: 'div[name="name"] input, input[name="name"], h1 input',
    fechaBajaInput:
      'div[name="fecha_baja"] input, div[name="date_end"] input, div[name="end_date"] input, div[name="deactivation_date"] input, input[name="fecha_baja"], input[name="date_end"], input[name="end_date"], input[name="deactivation_date"]',
    relacionInput:
      'div[name="parent_id"] input, div[name="relation_id"] input, div[name="relacion_id"] input, div[name="original_product_id"] input, div[name="source_product_id"] input, input[name="parent_id"], input[name="relation_id"], input[name="relacion_id"], input[name="original_product_id"], input[name="source_product_id"]',
    labels: {
      nombre: 'Nombre',
      tipologia: 'Tipologías',
      control: 'Control',
      grupoAsignar: 'Grupo asignar',
      reavalMinimo: 'Reaval mínimo (%)',
      reavalMaximo: 'Reaval máximo (%)',
      importeMinimo: 'Importe mínimo',
      importeMaximo: 'Importe máximo',
      plazoMinimoMeses: 'Mínimo (meses)',
      plazoMaximoMeses: 'Máximo (meses)',
      descuentoDias: 'Descuento (días)',
      interes: 'Interés (%)',
      porcentajeCompartidoMinimo: 'Porcentaje compartido mínimo (%)',
      porcentajeCompartidoMaximo: 'Porcentaje compartido máximo (%)',
      tabInformacionGeneral: 'Información general',
      tabOtraInformacion: 'Otra información',
      tabLimitesAmbito: 'Límites y ámbito',
      tabConceptos: 'Conceptos',
      fechaInicioComercializacion: 'Fecha inicio',
      fechaFinComercializacion: 'Fecha fin',
      fechaAltaFicha: 'Fec. alta ficha',
      fechaBajaFicha: 'Fec. baja ficha',
      receptorFijo: 'Receptor fijo',
      entidadFinanciera: 'Ent. financiera',
      tieneReceptorFijo: 'Tiene receptor fijo',
      tipoReceptorFijo: 'Tipo receptor fijo',
      contactoReceptor: 'Contacto receptor',
      capitalAfecto: 'Capital afecto',
      fechaBaja: 'Fecha baja',
      relacion: 'Relación',
      tabComisiones: 'Comisiones'
    },
    fields: {
      tipologia:
        'div[name="tipologia_ids"] input, div[name="typology_ids"] input, div[name="category_ids"] input, input[name="tipologia_ids"], input[name="typology_ids"]',
      control:
        'div[name="control"] input, div[name="control_id"] input, div[name="control_type"] input, input[name="control"], input[name="control_id"]',
      grupoAsignar:
        'div[name="grupo_asignar_id"] input, div[name="group_id"] input, div[name="product_group_id"] input, input[name="grupo_asignar_id"], input[name="group_id"]',
      reavalMinimo:
        'div[name="reaval_minimo"] input, div[name="reaval_min"] input, div[name="min_reaval"] input, input[name="reaval_minimo"], input[name="reaval_min"]',
      reavalMaximo:
        'div[name="reaval_maximo"] input, div[name="reaval_max"] input, div[name="max_reaval"] input, input[name="reaval_maximo"], input[name="reaval_max"]',
      importeMinimo:
        'div[name="importe_minimo"] input, div[name="min_amount"] input, div[name="amount_min"] input, input[name="importe_minimo"], input[name="min_amount"]',
      importeMaximo:
        'div[name="importe_maximo"] input, div[name="max_amount"] input, div[name="amount_max"] input, input[name="importe_maximo"], input[name="max_amount"]',
      plazoMinimoMeses:
        'div[name="minimo_meses"] input, div[name="plazo_minimo_meses"] input, div[name="min_months"] input, input[name="minimo_meses"], input[name="plazo_minimo_meses"]',
      plazoMaximoMeses:
        'div[name="maximo_meses"] input, div[name="plazo_maximo_meses"] input, div[name="max_months"] input, input[name="maximo_meses"], input[name="plazo_maximo_meses"]',
      descuentoDias:
        'div[name="descuento_dias"] input, div[name="discount_days"] input, div[name="days_discount"] input, input[name="descuento_dias"], input[name="discount_days"]',
      interes:
        'div[name="interest"] input, div[name="interes"] input, div[name="interest_rate"] input, input[name="interest"], input[name="interes"], input[name="interest_rate"]',
      porcentajeCompartidoMinimo:
        'div[name="porcentaje_compartido_minimo"] input, div[name="shared_percentage_min"] input, div[name="min_shared_percentage"] input, input[name="porcentaje_compartido_minimo"], input[name="shared_percentage_min"]',
      porcentajeCompartidoMaximo:
        'div[name="porcentaje_compartido_maximo"] input, div[name="shared_percentage_max"] input, div[name="max_shared_percentage"] input, input[name="porcentaje_compartido_maximo"], input[name="shared_percentage_max"]',
      fechaInicioComercializacion:
        'div[name="fecha_inicio"] input, div[name="start_date"] input, div[name="commercial_start_date"] input, div[name="date_start"] input, input[name="fecha_inicio"], input[name="start_date"], input[name="commercial_start_date"], input[name="date_start"]',
      fechaFinComercializacion:
        'div[name="fecha_fin"] input, div[name="end_date"] input, div[name="commercial_end_date"] input, div[name="date_end"] input, input[name="fecha_fin"], input[name="end_date"], input[name="commercial_end_date"], input[name="date_end"]',
      fechaAltaFicha:
        'div[name="fecha_alta_ficha"] input, div[name="card_start_date"] input, div[name="file_start_date"] input, div[name="registration_date"] input, input[name="fecha_alta_ficha"], input[name="card_start_date"], input[name="file_start_date"], input[name="registration_date"]',
      fechaBajaFicha:
        'div[name="fecha_baja_ficha"] input, div[name="card_end_date"] input, div[name="file_end_date"] input, div[name="deregistration_date"] input, input[name="fecha_baja_ficha"], input[name="card_end_date"], input[name="file_end_date"], input[name="deregistration_date"]',
      receptorFijo:
        'div[name="receptor_fijo"] input, div[name="fixed_receiver"] input, div[name="fixed_receiver_type"] input, input[name="receptor_fijo"], input[name="fixed_receiver"], input[name="fixed_receiver_type"]',
      entidadFinanciera:
        'div[name="entidad_financiera_id"] input, div[name="financial_entity_id"] input, div[name="bank_id"] input, input[name="entidad_financiera_id"], input[name="financial_entity_id"], input[name="bank_id"]',
      tieneReceptorFijo:
        'div[name="tiene_receptor_fijo"] input, div[name="has_fixed_receiver"] input, input[name="tiene_receptor_fijo"], input[name="has_fixed_receiver"]',
      tipoReceptorFijo:
        'div[name="tipo_receptor_fijo"] input, div[name="fixed_receiver_kind"] input, div[name="fixed_receiver_type_computed"] input, input[name="tipo_receptor_fijo"], input[name="fixed_receiver_kind"], input[name="fixed_receiver_type_computed"]',
      contactoReceptor:
        'div[name="contacto_receptor_id"] input, div[name="receiver_contact_id"] input, div[name="partner_receiver_id"] input, input[name="contacto_receptor_id"], input[name="receiver_contact_id"], input[name="partner_receiver_id"]',
      capitalAfecto:
        'div[name="capital_afecto"] input, div[name="affected_capital"] input, div[name="capital_affected"] input, input[name="capital_afecto"], input[name="affected_capital"], input[name="capital_affected"]'
    },
    comisiones: {
      rows:
        'div[name="commission_ids"] tr.o_data_row, div[name="comision_ids"] tr.o_data_row, div[name="commissions_ids"] tr.o_data_row, div[name="product_commission_ids"] tr.o_data_row, div[name="product_commission_line_ids"] tr.o_data_row',
      addLineButton:
        'div[name="commission_ids"] a:has-text("Agregar"), div[name="commission_ids"] a:has-text("Añadir"), div[name="comision_ids"] a:has-text("Agregar"), div[name="comision_ids"] a:has-text("Añadir"), div[name="commissions_ids"] a:has-text("Agregar"), div[name="commissions_ids"] a:has-text("Añadir"), div[name="product_commission_ids"] a:has-text("Agregar"), div[name="product_commission_ids"] a:has-text("Añadir"), div[name="product_commission_line_ids"] a:has-text("Agregar"), div[name="product_commission_line_ids"] a:has-text("Añadir")',
      nameInput:
        'td[name="commission_id"] input, td[name="comision_id"] input, td[name="name"] input, td[name="description"] input, td input[role="combobox"]',
      valueInput:
        'td[name="amount"] input, td[name="importe"] input, td[name="percentage"] input, td[name="porcentaje"] input, td[name="value"] input, td[name="valor"] input, td input[type="text"], td input[type="number"]'
    },
    cnae: {
      excluidosAddLineButton:
        'div[name="excluded_cnae_ids"] a:has-text("Agregar"), div[name="excluded_cnae_ids"] a:has-text("Añadir"), div[name="cnae_excluidos_ids"] a:has-text("Agregar"), div[name="cnae_excluidos_ids"] a:has-text("Añadir"), div[name="excluded_cnae_ids"] button:has-text("Agregar"), div[name="cnae_excluidos_ids"] button:has-text("Añadir")',
      incluidosAddLineButton:
        'div[name="included_cnae_ids"] a:has-text("Agregar"), div[name="included_cnae_ids"] a:has-text("Añadir"), div[name="cnae_incluidos_ids"] a:has-text("Agregar"), div[name="cnae_incluidos_ids"] a:has-text("Añadir"), div[name="included_cnae_ids"] button:has-text("Agregar"), div[name="cnae_incluidos_ids"] button:has-text("Añadir")',
      excluidosRows:
        'div[name="excluded_cnae_ids"] tr.o_data_row, div[name="cnae_excluidos_ids"] tr.o_data_row, div[name="excluded_cnae_ids"] tbody tr, div[name="cnae_excluidos_ids"] tbody tr',
      incluidosRows:
        'div[name="included_cnae_ids"] tr.o_data_row, div[name="cnae_incluidos_ids"] tr.o_data_row, div[name="included_cnae_ids"] tbody tr, div[name="cnae_incluidos_ids"] tbody tr',
      lineInput:
        'td[name="cnae_id"] input, td[name="code_id"] input, td[name="classification_id"] input, td input[role="combobox"], td input',
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    solapamientos: {
      tipologiaCliente: {
        excluidosAddLineButton:
          'div[name="excluded_client_typology_ids"] a:has-text("Agregar"), div[name="excluded_client_typology_ids"] a:has-text("Añadir"), div[name="tipologia_cliente_excluidos_ids"] a:has-text("Agregar"), div[name="tipologia_cliente_excluidos_ids"] a:has-text("Añadir")',
        incluidosAddLineButton:
          'div[name="included_client_typology_ids"] a:has-text("Agregar"), div[name="included_client_typology_ids"] a:has-text("Añadir"), div[name="tipologia_cliente_incluidos_ids"] a:has-text("Agregar"), div[name="tipologia_cliente_incluidos_ids"] a:has-text("Añadir")',
        lineInput:
          'td[name="typology_id"] input, td[name="tipologia_id"] input, td[name="category_id"] input, td input[role="combobox"], td input'
      },
      entidadesFinancieras: {
        excluidosAddLineButton:
          'div[name="excluded_financial_entity_ids"] a:has-text("Agregar"), div[name="excluded_financial_entity_ids"] a:has-text("Añadir"), div[name="entidades_financieras_excluidas_ids"] a:has-text("Agregar"), div[name="entidades_financieras_excluidas_ids"] a:has-text("Añadir")',
        incluidosAddLineButton:
          'div[name="included_financial_entity_ids"] a:has-text("Agregar"), div[name="included_financial_entity_ids"] a:has-text("Añadir"), div[name="entidades_financieras_incluidas_ids"] a:has-text("Agregar"), div[name="entidades_financieras_incluidas_ids"] a:has-text("Añadir")',
        lineInput:
          'td[name="financial_entity_id"] input, td[name="entidad_financiera_id"] input, td[name="bank_id"] input, td input[role="combobox"], td input'
      },
      limitesGeograficosProvincias: {
        excluidosAddLineButton:
          'div[name="excluded_state_ids"] a:has-text("Agregar"), div[name="excluded_state_ids"] a:has-text("Añadir"), div[name="excluded_province_ids"] a:has-text("Agregar"), div[name="excluded_province_ids"] a:has-text("Añadir"), div[name="provincias_excluidas_ids"] a:has-text("Agregar"), div[name="provincias_excluidas_ids"] a:has-text("Añadir")',
        incluidosAddLineButton:
          'div[name="included_state_ids"] a:has-text("Agregar"), div[name="included_state_ids"] a:has-text("Añadir"), div[name="included_province_ids"] a:has-text("Agregar"), div[name="included_province_ids"] a:has-text("Añadir"), div[name="provincias_incluidas_ids"] a:has-text("Agregar"), div[name="provincias_incluidas_ids"] a:has-text("Añadir")',
        lineInput:
          'td[name="state_id"] input, td[name="province_id"] input, td[name="provincia_id"] input, td input[role="combobox"], td input'
      },
      limitesGeograficosCodigosPostales: {
        excluidosAddLineButton:
          'div[name="excluded_zip_ids"] a:has-text("Agregar"), div[name="excluded_zip_ids"] a:has-text("Añadir"), div[name="excluded_postal_code_ids"] a:has-text("Agregar"), div[name="excluded_postal_code_ids"] a:has-text("Añadir"), div[name="codigos_postales_excluidos_ids"] a:has-text("Agregar"), div[name="codigos_postales_excluidos_ids"] a:has-text("Añadir")',
        incluidosAddLineButton:
          'div[name="included_zip_ids"] a:has-text("Agregar"), div[name="included_zip_ids"] a:has-text("Añadir"), div[name="included_postal_code_ids"] a:has-text("Agregar"), div[name="included_postal_code_ids"] a:has-text("Añadir"), div[name="codigos_postales_incluidos_ids"] a:has-text("Agregar"), div[name="codigos_postales_incluidos_ids"] a:has-text("Añadir")',
        lineInput:
          'td[name="zip_id"] input, td[name="postal_code_id"] input, td[name="codigo_postal_id"] input, td input[role="combobox"], td input'
      },
      limitesGeograficosCiudades: {
        excluidosAddLineButton:
          'div[name="excluded_city_ids"] a:has-text("Agregar"), div[name="excluded_city_ids"] a:has-text("Añadir"), div[name="excluded_town_ids"] a:has-text("Agregar"), div[name="excluded_town_ids"] a:has-text("Añadir"), div[name="ciudades_excluidas_ids"] a:has-text("Agregar"), div[name="ciudades_excluidas_ids"] a:has-text("Añadir")',
        incluidosAddLineButton:
          'div[name="included_city_ids"] a:has-text("Agregar"), div[name="included_city_ids"] a:has-text("Añadir"), div[name="included_town_ids"] a:has-text("Agregar"), div[name="included_town_ids"] a:has-text("Añadir"), div[name="ciudades_incluidas_ids"] a:has-text("Agregar"), div[name="ciudades_incluidas_ids"] a:has-text("Añadir")',
        lineInput:
          'td[name="city_id"] input, td[name="town_id"] input, td[name="ciudad_id"] input, td input[role="combobox"], td input'
      },
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    clienteObjetivo: {
      section:
        'div:has-text("Cliente objetivo"), group:has-text("Cliente objetivo"), .o_group:has-text("Cliente objetivo")',
      tipoJuridico:
        'div[name="target_legal_type"] input, div[name="tipo_juridico_objetivo"] input, input[name="target_legal_type"], input[name="tipo_juridico_objetivo"]',
      autonomoTipoFisico:
        'div[name="target_self_employed"] input, div[name="autonomo_tipo_fisico"] input, input[name="target_self_employed"], input[name="autonomo_tipo_fisico"]',
      emprendedoresNuevaEmpresa:
        'div[name="target_entrepreneurs"] input, div[name="emprendedores_nueva_empresa"] input, input[name="target_entrepreneurs"], input[name="emprendedores_nueva_empresa"]',
      tamanoEmpresaContainer:
        'div[name="target_company_size_ids"], div[name="tamano_empresa_objetivo_ids"], div[name="company_size_target_ids"]',
      tamanoEmpresaCheckboxes:
        'div[name="target_company_size_ids"] input[type="checkbox"], div[name="tamano_empresa_objetivo_ids"] input[type="checkbox"], div[name="company_size_target_ids"] input[type="checkbox"]'
    },
    conceptos: {
      rows:
        'div[name="concept_ids"] tr.o_data_row, div[name="commission_line_ids"] tr.o_data_row, div[name="product_commission_concept_ids"] tr.o_data_row, div[name="conceptos_ids"] tr.o_data_row',
      addLineButton:
        'div[name="concept_ids"] a:has-text("Agregar"), div[name="concept_ids"] a:has-text("Añadir"), div[name="commission_line_ids"] a:has-text("Agregar"), div[name="commission_line_ids"] a:has-text("Añadir"), div[name="product_commission_concept_ids"] a:has-text("Agregar"), div[name="product_commission_concept_ids"] a:has-text("Añadir"), div[name="conceptos_ids"] a:has-text("Agregar"), div[name="conceptos_ids"] a:has-text("Añadir")',
      conceptoInput:
        'td[name="concept_id"] input, td[name="concepto_id"] input, td[name="commission_concept_id"] input, td input[role="combobox"]',
      productoComisionInput:
        'td[name="commission_product_id"] input, td[name="producto_comision_id"] input, td[name="product_commission_id"] input',
      tipoInput:
        'td[name="type"] input, td[name="tipo"] input, td[name="line_type"] input, td input[role="combobox"]',
      modoInput:
        'td[name="mode"] input, td[name="modo"] input, td[name="calculation_mode"] input, td input[role="combobox"]',
      financiadoInput:
        'td[name="financiado"] input, td[name="financed"] input, td[name="is_financed"] input, td input[type="checkbox"]',
      porcentajeMinimoInput:
        'td[name="min_percentage"] input, td[name="porcentaje_minimo"] input, td[name="percent_min"] input, td input[type="text"], td input[type="number"]',
      porcentajeMaximoInput:
        'td[name="max_percentage"] input, td[name="porcentaje_maximo"] input, td[name="percent_max"] input, td input[type="text"], td input[type="number"]',
      pdMinimoInput:
        'td[name="pd_min"] input, td[name="pd_minimo"] input, td input[type="text"], td input[type="number"]',
      pdMaximoInput:
        'td[name="pd_max"] input, td[name="pd_maximo"] input, td input[type="text"], td input[type="number"]',
      plazoMinimoMesesInput:
        'td[name="min_term_months"] input, td[name="plazo_minimo_meses"] input, td[name="min_months"] input, td input[type="text"], td input[type="number"]',
      importeMinimoInput:
        'td[name="min_amount"] input, td[name="importe_minimo"] input, td[name="amount_min"] input, td input[type="text"], td input[type="number"]',
      importeMaximoInput:
        'td[name="max_amount"] input, td[name="importe_maximo"] input, td[name="amount_max"] input, td input[type="text"], td input[type="number"]',
      importeMinimoCell:
        'td[name="importe_min_eur"], td[name="min_amount"], td[name="importe_minimo"], td[name="amount_min"]',
      importeMaximoCell:
        'td[name="importe_max_eur"], td[name="max_amount"], td[name="importe_maximo"], td[name="amount_max"]',
      porcentajeMinimoCell:
        'td[name="percent_min"], td[name="min_percentage"], td[name="porcentaje_minimo"]',
      porcentajeMaximoCell:
        'td[name="percent_max"], td[name="max_percentage"], td[name="porcentaje_maximo"]',
      periodicidadInput:
        'td[name="periodicity"] input, td[name="periodicidad"] input, td input[role="combobox"]',
      duracionInput:
        'td[name="duracion_value"] input, td[name="duration"] input, td[name="duration_value"] input, td input[type="text"], td input[type="number"]',
      unidadInput:
        'td[name="duracion_unit"] input, td[name="duration_unit"] input, td[name="unit"] input, td input[role="combobox"]',
      duracionCell:
        'td[name="duracion_value"], td[name="duration"], td[name="duration_value"]',
      unidadCell:
        'td[name="duracion_unit"], td[name="duration_unit"], td[name="unit"]',
      deleteButton:
        'button[aria-label="Eliminar"], button[title="Eliminar"], .fa-trash, .o_list_record_remove',
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
  }
} as const;
