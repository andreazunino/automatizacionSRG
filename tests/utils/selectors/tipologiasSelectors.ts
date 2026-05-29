export const tipologiasSelectors = {
    tagInput:
      'div[name="category_id"] input, div[name="category_ids"] input, div[name="typology_ids"] input, div[name="tipologia_ids"] input, div[name="tipologias_ids"] input',
    tagContainer:
      'div[name="category_id"], div[name="category_ids"], div[name="typology_ids"], div[name="tipologia_ids"], div[name="tipologias_ids"]',
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]',
    listFilterButton:
      'button:has-text("Filtros"), button:has-text("Filters"), .o_searchview_dropdown_toggler',
    typologyFilterOption:
      '[role="menuitem"]:has-text("Tipología"), [role="option"]:has-text("Tipología"), .dropdown-item:has-text("Tipología"), [role="menuitem"]:has-text("Tipologia"), [role="option"]:has-text("Tipologia"), .dropdown-item:has-text("Tipologia")'
} as const;
