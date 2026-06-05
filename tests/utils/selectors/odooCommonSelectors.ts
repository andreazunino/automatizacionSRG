export const odooCommonSelectors = {
  newButton: 'button:has-text("Nuevo")',
  editButton: 'button:has-text("Editar")',
  saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
  discardButton:
    'button[aria-label="Descartar todos los cambios"], button:has-text("Descartar"), button:has-text("Cancelar")',
  confirmDiscardButton:
    '.modal button:has-text("Descartar"), .modal button:has-text("Aceptar"), .modal button:has-text("Confirmar"), [role="dialog"] button:has-text("Descartar"), [role="dialog"] button:has-text("Aceptar")',
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
    '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
  validationText:
    '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger, .o_field_invalid, .is-invalid',
  invalidField: '[aria-invalid="true"], .o_field_invalid, .is-invalid, .o_form_invalid',
  chatter:
    '.o-mail-Chatter, .o_Chatter, .o_chatter, .oe_chatter, [class*="Chatter"], [class*="chatter"]',
  statusbarActive:
    '.o_statusbar_status .active, .o_statusbar_status button[aria-checked="true"], .o_statusbar_status button.active',
  htmlEditor: '[contenteditable="true"], .note-editable, .odoo-editor-editable'
} as const;
