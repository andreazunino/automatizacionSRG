export const contactosSelectors = {
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
    },
    bienes: {
      rows:
        'div[name="asset_ids"] tr.o_data_row, div[name="bien_ids"] tr.o_data_row, div[name="property_ids"] tr.o_data_row, div[name="owner_asset_ids"] tr.o_data_row',
      viewButton:
        'button:has-text("Ver bien"), a:has-text("Ver bien"), button:has-text("Ver Bien"), a:has-text("Ver Bien"), button[aria-label*="Ver"], a[aria-label*="Ver"]',
      labels: {
        tabBienes: 'Bienes'
      }
    }
} as const;
