export const conceptosComisionSelectors = {
    pageTitleText: /Conceptos de comisi[oÃ³]n|Conceptos/i,
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    actionButton:
      'button:has-text("AcciÃ³n"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
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
} as const;
