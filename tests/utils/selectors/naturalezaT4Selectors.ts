export const naturalezaT4Selectors = {
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
    codeInput: 'div[name="code"] input, input[name="code"], div[name="codigo"] input, input[name="codigo"]',
    descriptionInput:
      'div[name="description"] input, div[name="description"] textarea, div[name="descripcion"] input, div[name="descripcion"] textarea, input[name="description"], textarea[name="description"], input[name="descripcion"], textarea[name="descripcion"]',
    grupoProductoNaturalezaT4Input:
      'div[name="naturaleza_t4_id"] input, div[name="nature_t4_id"] input, input[name="naturaleza_t4_id"], input[name="nature_t4_id"]',
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
} as const;
