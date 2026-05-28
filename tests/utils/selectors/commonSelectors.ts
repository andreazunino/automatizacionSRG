export const commonSelectors = {
    successMessage: '[data-testid="success-message"]',
    errorMessage: '[data-testid="error-message"]',
    unexpectedErrorDialog:
      '.modal:has-text("Se ha producido un error"), .modal:has-text("Â¡Uy!"), .o_dialog:has-text("Se ha producido un error"), .o_error_dialog, .o_technical_modal',
    validationMessage:
      '[data-testid="validation-message"], .o_notification, .o_notification_content, .invalid-feedback, .text-danger',
    invalidField: '[aria-invalid="true"], .o_field_invalid, .is-invalid, .o_form_invalid'
} as const;
