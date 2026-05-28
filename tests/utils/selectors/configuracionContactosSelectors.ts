export const configuracionContactosSelectors = {
    menus: {
      configuracion: 'ConfiguraciÃ³n',
      formasJuridicas: 'Formas jurÃ­dicas',
      vinculaciones: 'VÃ­nculos de socios',
      tipologias: 'TipologÃ­a'
    },
    labels: {
      nombre: 'Nombre',
      codigo: 'CÃ³digo'
    },
    form: {
      saveButton: 'button[aria-label="Guardar manualmente"], button:has-text("Guardar")',
      discardButton: 'button[aria-label="Descartar todos los cambios"], button:has-text("Descartar")',
      nameInput: 'div[name="name"] input, input[name="name"], input[placeholder*="Nombre"]',
      codeInput: 'div[name="code"] input, input[name="code"], div[name="codigo"] input, input[name="codigo"]',
      descriptionInput:
        'div[name="description"] textarea, div[name="descripcion"] textarea, div[name="description"] input, div[name="descripcion"] input, textarea[name="description"], textarea[name="descripcion"], input[name="description"], input[name="descripcion"]'
    },
    grupoEconomico: {
      memberRows: 'div[name="member_ids"] tr.o_data_row',
      decisionUnitCell: 'td[name="decision_unit_id"]',
      decisionUnitInput: 'td[name="decision_unit_id"] input[role="combobox"], td[name="decision_unit_id"] input',
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    firstResult: '.o_data_row:first-child, tbody tr:first-child',
    duplicateValidationDialog:
      '.modal:has-text("Error de validaciÃ³n"), .modal:has-text("duplic"), .o_dialog:has-text("Error de validaciÃ³n")',
    validationText:
      '.modal, .o_dialog, .o_notification, .o_notification_content, .invalid-feedback, .text-danger',
    dialogCloseButton: '.modal button:has-text("Cerrar"), .modal button:has-text("Aceptar"), .o_dialog button:has-text("Cerrar")'
} as const;
