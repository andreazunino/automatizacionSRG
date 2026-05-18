export const selectors = {
  login: {
    usernameInput: 'input[name="login"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    homeTitle: '.o_main_navbar'
  },
  common: {
    successMessage: '[data-testid="success-message"]',
    errorMessage: '[data-testid="error-message"]',
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
      validationDialogCloseButton: '.modal button:has-text("Cerrar"), .modal button:has-text("Aceptar")',
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
        paisNacimiento: 'País de nacimiento?'
      }
    },
    empresa: {
      labels: {
        typeJuridico: 'Jurídico',
        nombre: 'Nombre',
        tabCodigosCnae: 'Códigos CNAE',
        tabInformacionFiscalIae: 'Información Fiscal / IAE'
      },
      nameInput: 'div[name="name"] input, h1 input[placeholder*="Lumber"], h1 input',
      cnaeRows: 'div[name="cnae_ids"] tbody tr:has(td[name="cnae_id"])',
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
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    }
  }
} as const;
