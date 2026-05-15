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
    validationMessage: '[data-testid="validation-message"]'
  },
  contactos: {
    menuLink: 'a[href="/odoo/contacts"], a:has-text("Contactos")',
    pageTitle: '.o_control_panel .breadcrumb, .o_breadcrumb, nav:has-text("Contactos")',
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
    }
  }
} as const;
