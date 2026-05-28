export const tipologiasProductoSelectors = {
    pageTitleText: /Tipolog[iÃ­]as de producto|Tipolog[iÃ­]as|Tipolog[iÃ­]a/i,
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    actionButton:
      'button:has-text("AcciÃ³n"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
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
} as const;
