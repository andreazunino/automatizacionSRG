export const selectors = {
  login: {
    usernameInput: '[data-testid="login-username"]',
    passwordInput: '[data-testid="login-password"]',
    submitButton: '[data-testid="login-submit"]',
    homeTitle: '[data-testid="home-title"]'
  },
  common: {
    successMessage: '[data-testid="success-message"]',
    errorMessage: '[data-testid="error-message"]',
    validationMessage: '[data-testid="validation-message"]'
  },
  contactos: {
    menuLink: '[data-testid="menu-contactos"]',
    pageTitle: '[data-testid="contactos-title"]',
    newButton: '[data-testid="contactos-new"]',
    searchInput: '[data-testid="contactos-search"]',
    searchButton: '[data-testid="contactos-search-button"]',
    resultsTable: '[data-testid="contactos-results"]',
    firstResult: '[data-testid="contactos-result-row"]',
    editButton: '[data-testid="contactos-edit"]',
    deleteButton: '[data-testid="contactos-delete"]',
    confirmDeleteButton: '[data-testid="contactos-confirm-delete"]',
    form: {
      nombreInput: '[data-testid="contacto-nombre"]',
      apellidoInput: '[data-testid="contacto-apellido"]',
      emailInput: '[data-testid="contacto-email"]',
      telefonoInput: '[data-testid="contacto-telefono"]',
      documentoInput: '[data-testid="contacto-documento"]',
      saveButton: '[data-testid="contacto-save"]'
    }
  }
} as const;
