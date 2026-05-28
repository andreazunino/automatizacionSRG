export const odooCommonSelectors = {
  newButton: 'button:has-text("Nuevo")',
  editButton: 'button:has-text("Editar")',
  saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
  actionButton:
    'button:has-text("Accion"), button:has-text("Acción"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
  archiveMenuItem:
    '.dropdown-item:has-text("Archivar"), [role="menuitem"]:has-text("Archivar"), button:has-text("Archivar")',
  unarchiveButton:
    'button:has-text("Desarchivar"), button:has-text("Restaurar"), .dropdown-item:has-text("Desarchivar"), [role="menuitem"]:has-text("Desarchivar")',
  confirmArchiveButton:
    '.modal button:has-text("Archivar"), .modal button:has-text("Aceptar"), .modal button:has-text("Confirmar"), [role="dialog"] button:has-text("Archivar"), [role="dialog"] button:has-text("Aceptar")',
  searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
  rows: '.o_data_row, tbody tr',
  filterButton: 'button:has-text("Filtros"), button:has-text("Filters"), .o_searchview_dropdown_toggler',
  archivedFilterOption:
    '.dropdown-item:has-text("Archivado"), [role="menuitem"]:has-text("Archivado"), [role="option"]:has-text("Archivado"), button:has-text("Archivado")',
  autocompleteOption:
    '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
} as const;
