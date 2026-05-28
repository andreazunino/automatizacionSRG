export const productosSelectors = {
    pageTitleText: /Productos financieros|Productos/i,
    newButton: 'button:has-text("Nuevo")',
    editButton: 'button:has-text("Editar")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    actionButton:
      'button:has-text("AcciÃ³n"), button:has-text("Acciones"), .o_cp_action_menus button, button[aria-label*="Acci"]',
    archiveMenuItem:
      '.dropdown-item:has-text("Archivar"), [role="menuitem"]:has-text("Archivar"), button:has-text("Archivar")',
    duplicateMenuItem:
      '.dropdown-item:has-text("Duplicar"), [role="menuitem"]:has-text("Duplicar"), button:has-text("Duplicar")',
    unarchiveButton:
      'button:has-text("Desarchivar"), button:has-text("Restaurar"), .dropdown-item:has-text("Desarchivar"), [role="menuitem"]:has-text("Desarchivar")',
    confirmArchiveButton:
      '.modal button:has-text("Archivar"), .modal button:has-text("Aceptar"), .modal button:has-text("Confirmar"), [role="dialog"] button:has-text("Archivar"), [role="dialog"] button:has-text("Aceptar")',
    searchInput: '.o_searchview input[type="text"], input.o_searchview_input, [role="searchbox"]',
    rows: '.o_data_row, tbody tr',
    nameInput: 'div[name="name"] input, input[name="name"], h1 input',
    fechaBajaInput:
      'div[name="fecha_baja"] input, div[name="date_end"] input, div[name="end_date"] input, div[name="deactivation_date"] input, input[name="fecha_baja"], input[name="date_end"], input[name="end_date"], input[name="deactivation_date"]',
    relacionInput:
      'div[name="parent_id"] input, div[name="relation_id"] input, div[name="relacion_id"] input, div[name="original_product_id"] input, div[name="source_product_id"] input, input[name="parent_id"], input[name="relation_id"], input[name="relacion_id"], input[name="original_product_id"], input[name="source_product_id"]',
    labels: {
      nombre: 'Nombre',
      tipologia: 'TipologÃ­as',
      control: 'Control',
      grupoAsignar: 'Grupo asignar',
      reavalMinimo: 'Reaval mÃ­nimo (%)',
      reavalMaximo: 'Reaval mÃ¡ximo (%)',
      importeMinimo: 'Importe mÃ­nimo',
      importeMaximo: 'Importe mÃ¡ximo',
      plazoMinimoMeses: 'MÃ­nimo (meses)',
      plazoMaximoMeses: 'MÃ¡ximo (meses)',
      descuentoDias: 'Descuento (dÃ­as)',
      interes: 'InterÃ©s (%)',
      porcentajeCompartidoMinimo: 'Porcentaje compartido mÃ­nimo (%)',
      porcentajeCompartidoMaximo: 'Porcentaje compartido mÃ¡ximo (%)',
      tabInformacionGeneral: 'InformaciÃ³n general',
      tabOtraInformacion: 'Otra informaciÃ³n',
      tabLimitesAmbito: 'LÃ­mites y Ã¡mbito',
      tabConceptos: 'Conceptos',
      fechaInicioComercializacion: 'Fecha inicio',
      fechaFinComercializacion: 'Fecha fin',
      fechaAltaFicha: 'Fec. alta ficha',
      fechaBajaFicha: 'Fec. baja ficha',
      receptorFijo: 'Receptor fijo',
      entidadFinanciera: 'Ent. financiera',
      tieneReceptorFijo: 'Tiene receptor fijo',
      tipoReceptorFijo: 'Tipo receptor fijo',
      contactoReceptor: 'Contacto receptor',
      capitalAfecto: 'Capital afecto',
      fechaBaja: 'Fecha baja',
      relacion: 'RelaciÃ³n',
      tabComisiones: 'Comisiones'
    },
    fields: {
      tipologia:
        'div[name="tipologia_ids"] input, div[name="typology_ids"] input, div[name="category_ids"] input, input[name="tipologia_ids"], input[name="typology_ids"]',
      control:
        'div[name="control"] input, div[name="control_id"] input, div[name="control_type"] input, input[name="control"], input[name="control_id"]',
      grupoAsignar:
        'div[name="grupo_asignar_id"] input, div[name="group_id"] input, div[name="product_group_id"] input, input[name="grupo_asignar_id"], input[name="group_id"]',
      reavalMinimo:
        'div[name="reaval_minimo"] input, div[name="reaval_min"] input, div[name="min_reaval"] input, input[name="reaval_minimo"], input[name="reaval_min"]',
      reavalMaximo:
        'div[name="reaval_maximo"] input, div[name="reaval_max"] input, div[name="max_reaval"] input, input[name="reaval_maximo"], input[name="reaval_max"]',
      importeMinimo:
        'div[name="importe_minimo"] input, div[name="min_amount"] input, div[name="amount_min"] input, input[name="importe_minimo"], input[name="min_amount"]',
      importeMaximo:
        'div[name="importe_maximo"] input, div[name="max_amount"] input, div[name="amount_max"] input, input[name="importe_maximo"], input[name="max_amount"]',
      plazoMinimoMeses:
        'div[name="minimo_meses"] input, div[name="plazo_minimo_meses"] input, div[name="min_months"] input, input[name="minimo_meses"], input[name="plazo_minimo_meses"]',
      plazoMaximoMeses:
        'div[name="maximo_meses"] input, div[name="plazo_maximo_meses"] input, div[name="max_months"] input, input[name="maximo_meses"], input[name="plazo_maximo_meses"]',
      descuentoDias:
        'div[name="descuento_dias"] input, div[name="discount_days"] input, div[name="days_discount"] input, input[name="descuento_dias"], input[name="discount_days"]',
      interes:
        'div[name="interest"] input, div[name="interes"] input, div[name="interest_rate"] input, input[name="interest"], input[name="interes"], input[name="interest_rate"]',
      porcentajeCompartidoMinimo:
        'div[name="porcentaje_compartido_minimo"] input, div[name="shared_percentage_min"] input, div[name="min_shared_percentage"] input, input[name="porcentaje_compartido_minimo"], input[name="shared_percentage_min"]',
      porcentajeCompartidoMaximo:
        'div[name="porcentaje_compartido_maximo"] input, div[name="shared_percentage_max"] input, div[name="max_shared_percentage"] input, input[name="porcentaje_compartido_maximo"], input[name="shared_percentage_max"]',
      fechaInicioComercializacion:
        'div[name="fecha_inicio"] input, div[name="start_date"] input, div[name="commercial_start_date"] input, div[name="date_start"] input, input[name="fecha_inicio"], input[name="start_date"], input[name="commercial_start_date"], input[name="date_start"]',
      fechaFinComercializacion:
        'div[name="fecha_fin"] input, div[name="end_date"] input, div[name="commercial_end_date"] input, div[name="date_end"] input, input[name="fecha_fin"], input[name="end_date"], input[name="commercial_end_date"], input[name="date_end"]',
      fechaAltaFicha:
        'div[name="fecha_alta_ficha"] input, div[name="card_start_date"] input, div[name="file_start_date"] input, div[name="registration_date"] input, input[name="fecha_alta_ficha"], input[name="card_start_date"], input[name="file_start_date"], input[name="registration_date"]',
      fechaBajaFicha:
        'div[name="fecha_baja_ficha"] input, div[name="card_end_date"] input, div[name="file_end_date"] input, div[name="deregistration_date"] input, input[name="fecha_baja_ficha"], input[name="card_end_date"], input[name="file_end_date"], input[name="deregistration_date"]',
      receptorFijo:
        'div[name="receptor_fijo"] input, div[name="fixed_receiver"] input, div[name="fixed_receiver_type"] input, input[name="receptor_fijo"], input[name="fixed_receiver"], input[name="fixed_receiver_type"]',
      entidadFinanciera:
        'div[name="entidad_financiera_id"] input, div[name="financial_entity_id"] input, div[name="bank_id"] input, input[name="entidad_financiera_id"], input[name="financial_entity_id"], input[name="bank_id"]',
      tieneReceptorFijo:
        'div[name="tiene_receptor_fijo"] input, div[name="has_fixed_receiver"] input, input[name="tiene_receptor_fijo"], input[name="has_fixed_receiver"]',
      tipoReceptorFijo:
        'div[name="tipo_receptor_fijo"] input, div[name="fixed_receiver_kind"] input, div[name="fixed_receiver_type_computed"] input, input[name="tipo_receptor_fijo"], input[name="fixed_receiver_kind"], input[name="fixed_receiver_type_computed"]',
      contactoReceptor:
        'div[name="contacto_receptor_id"] input, div[name="receiver_contact_id"] input, div[name="partner_receiver_id"] input, input[name="contacto_receptor_id"], input[name="receiver_contact_id"], input[name="partner_receiver_id"]',
      capitalAfecto:
        'div[name="capital_afecto"] input, div[name="affected_capital"] input, div[name="capital_affected"] input, input[name="capital_afecto"], input[name="affected_capital"], input[name="capital_affected"]'
    },
    comisiones: {
      rows:
        'div[name="commission_ids"] tr.o_data_row, div[name="comision_ids"] tr.o_data_row, div[name="commissions_ids"] tr.o_data_row, div[name="product_commission_ids"] tr.o_data_row, div[name="product_commission_line_ids"] tr.o_data_row',
      addLineButton:
        'div[name="commission_ids"] a:has-text("Agregar"), div[name="commission_ids"] a:has-text("AÃ±adir"), div[name="comision_ids"] a:has-text("Agregar"), div[name="comision_ids"] a:has-text("AÃ±adir"), div[name="commissions_ids"] a:has-text("Agregar"), div[name="commissions_ids"] a:has-text("AÃ±adir"), div[name="product_commission_ids"] a:has-text("Agregar"), div[name="product_commission_ids"] a:has-text("AÃ±adir"), div[name="product_commission_line_ids"] a:has-text("Agregar"), div[name="product_commission_line_ids"] a:has-text("AÃ±adir")',
      nameInput:
        'td[name="commission_id"] input, td[name="comision_id"] input, td[name="name"] input, td[name="description"] input, td input[role="combobox"]',
      valueInput:
        'td[name="amount"] input, td[name="importe"] input, td[name="percentage"] input, td[name="porcentaje"] input, td[name="value"] input, td[name="valor"] input, td input[type="text"], td input[type="number"]'
    },
    cnae: {
      excluidosAddLineButton:
        'div[name="excluded_cnae_ids"] a:has-text("Agregar"), div[name="excluded_cnae_ids"] a:has-text("AÃ±adir"), div[name="cnae_excluidos_ids"] a:has-text("Agregar"), div[name="cnae_excluidos_ids"] a:has-text("AÃ±adir"), div[name="excluded_cnae_ids"] button:has-text("Agregar"), div[name="cnae_excluidos_ids"] button:has-text("AÃ±adir")',
      incluidosAddLineButton:
        'div[name="included_cnae_ids"] a:has-text("Agregar"), div[name="included_cnae_ids"] a:has-text("AÃ±adir"), div[name="cnae_incluidos_ids"] a:has-text("Agregar"), div[name="cnae_incluidos_ids"] a:has-text("AÃ±adir"), div[name="included_cnae_ids"] button:has-text("Agregar"), div[name="cnae_incluidos_ids"] button:has-text("AÃ±adir")',
      excluidosRows:
        'div[name="excluded_cnae_ids"] tr.o_data_row, div[name="cnae_excluidos_ids"] tr.o_data_row, div[name="excluded_cnae_ids"] tbody tr, div[name="cnae_excluidos_ids"] tbody tr',
      incluidosRows:
        'div[name="included_cnae_ids"] tr.o_data_row, div[name="cnae_incluidos_ids"] tr.o_data_row, div[name="included_cnae_ids"] tbody tr, div[name="cnae_incluidos_ids"] tbody tr',
      lineInput:
        'td[name="cnae_id"] input, td[name="code_id"] input, td[name="classification_id"] input, td input[role="combobox"], td input',
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    solapamientos: {
      tipologiaCliente: {
        excluidosAddLineButton:
          'div[name="excluded_client_typology_ids"] a:has-text("Agregar"), div[name="excluded_client_typology_ids"] a:has-text("AÃ±adir"), div[name="tipologia_cliente_excluidos_ids"] a:has-text("Agregar"), div[name="tipologia_cliente_excluidos_ids"] a:has-text("AÃ±adir")',
        incluidosAddLineButton:
          'div[name="included_client_typology_ids"] a:has-text("Agregar"), div[name="included_client_typology_ids"] a:has-text("AÃ±adir"), div[name="tipologia_cliente_incluidos_ids"] a:has-text("Agregar"), div[name="tipologia_cliente_incluidos_ids"] a:has-text("AÃ±adir")',
        lineInput:
          'td[name="typology_id"] input, td[name="tipologia_id"] input, td[name="category_id"] input, td input[role="combobox"], td input'
      },
      entidadesFinancieras: {
        excluidosAddLineButton:
          'div[name="excluded_financial_entity_ids"] a:has-text("Agregar"), div[name="excluded_financial_entity_ids"] a:has-text("AÃ±adir"), div[name="entidades_financieras_excluidas_ids"] a:has-text("Agregar"), div[name="entidades_financieras_excluidas_ids"] a:has-text("AÃ±adir")',
        incluidosAddLineButton:
          'div[name="included_financial_entity_ids"] a:has-text("Agregar"), div[name="included_financial_entity_ids"] a:has-text("AÃ±adir"), div[name="entidades_financieras_incluidas_ids"] a:has-text("Agregar"), div[name="entidades_financieras_incluidas_ids"] a:has-text("AÃ±adir")',
        lineInput:
          'td[name="financial_entity_id"] input, td[name="entidad_financiera_id"] input, td[name="bank_id"] input, td input[role="combobox"], td input'
      },
      limitesGeograficosProvincias: {
        excluidosAddLineButton:
          'div[name="excluded_state_ids"] a:has-text("Agregar"), div[name="excluded_state_ids"] a:has-text("AÃ±adir"), div[name="excluded_province_ids"] a:has-text("Agregar"), div[name="excluded_province_ids"] a:has-text("AÃ±adir"), div[name="provincias_excluidas_ids"] a:has-text("Agregar"), div[name="provincias_excluidas_ids"] a:has-text("AÃ±adir")',
        incluidosAddLineButton:
          'div[name="included_state_ids"] a:has-text("Agregar"), div[name="included_state_ids"] a:has-text("AÃ±adir"), div[name="included_province_ids"] a:has-text("Agregar"), div[name="included_province_ids"] a:has-text("AÃ±adir"), div[name="provincias_incluidas_ids"] a:has-text("Agregar"), div[name="provincias_incluidas_ids"] a:has-text("AÃ±adir")',
        lineInput:
          'td[name="state_id"] input, td[name="province_id"] input, td[name="provincia_id"] input, td input[role="combobox"], td input'
      },
      limitesGeograficosCodigosPostales: {
        excluidosAddLineButton:
          'div[name="excluded_zip_ids"] a:has-text("Agregar"), div[name="excluded_zip_ids"] a:has-text("AÃ±adir"), div[name="excluded_postal_code_ids"] a:has-text("Agregar"), div[name="excluded_postal_code_ids"] a:has-text("AÃ±adir"), div[name="codigos_postales_excluidos_ids"] a:has-text("Agregar"), div[name="codigos_postales_excluidos_ids"] a:has-text("AÃ±adir")',
        incluidosAddLineButton:
          'div[name="included_zip_ids"] a:has-text("Agregar"), div[name="included_zip_ids"] a:has-text("AÃ±adir"), div[name="included_postal_code_ids"] a:has-text("Agregar"), div[name="included_postal_code_ids"] a:has-text("AÃ±adir"), div[name="codigos_postales_incluidos_ids"] a:has-text("Agregar"), div[name="codigos_postales_incluidos_ids"] a:has-text("AÃ±adir")',
        lineInput:
          'td[name="zip_id"] input, td[name="postal_code_id"] input, td[name="codigo_postal_id"] input, td input[role="combobox"], td input'
      },
      limitesGeograficosCiudades: {
        excluidosAddLineButton:
          'div[name="excluded_city_ids"] a:has-text("Agregar"), div[name="excluded_city_ids"] a:has-text("AÃ±adir"), div[name="excluded_town_ids"] a:has-text("Agregar"), div[name="excluded_town_ids"] a:has-text("AÃ±adir"), div[name="ciudades_excluidas_ids"] a:has-text("Agregar"), div[name="ciudades_excluidas_ids"] a:has-text("AÃ±adir")',
        incluidosAddLineButton:
          'div[name="included_city_ids"] a:has-text("Agregar"), div[name="included_city_ids"] a:has-text("AÃ±adir"), div[name="included_town_ids"] a:has-text("Agregar"), div[name="included_town_ids"] a:has-text("AÃ±adir"), div[name="ciudades_incluidas_ids"] a:has-text("Agregar"), div[name="ciudades_incluidas_ids"] a:has-text("AÃ±adir")',
        lineInput:
          'td[name="city_id"] input, td[name="town_id"] input, td[name="ciudad_id"] input, td input[role="combobox"], td input'
      },
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    clienteObjetivo: {
      section:
        'div:has-text("Cliente objetivo"), group:has-text("Cliente objetivo"), .o_group:has-text("Cliente objetivo")',
      tipoJuridico:
        'div[name="target_legal_type"] input, div[name="tipo_juridico_objetivo"] input, input[name="target_legal_type"], input[name="tipo_juridico_objetivo"]',
      autonomoTipoFisico:
        'div[name="target_self_employed"] input, div[name="autonomo_tipo_fisico"] input, input[name="target_self_employed"], input[name="autonomo_tipo_fisico"]',
      emprendedoresNuevaEmpresa:
        'div[name="target_entrepreneurs"] input, div[name="emprendedores_nueva_empresa"] input, input[name="target_entrepreneurs"], input[name="emprendedores_nueva_empresa"]',
      tamanoEmpresaContainer:
        'div[name="target_company_size_ids"], div[name="tamano_empresa_objetivo_ids"], div[name="company_size_target_ids"]',
      tamanoEmpresaCheckboxes:
        'div[name="target_company_size_ids"] input[type="checkbox"], div[name="tamano_empresa_objetivo_ids"] input[type="checkbox"], div[name="company_size_target_ids"] input[type="checkbox"]'
    },
    conceptos: {
      rows:
        'div[name="concept_ids"] tr.o_data_row, div[name="commission_line_ids"] tr.o_data_row, div[name="product_commission_concept_ids"] tr.o_data_row, div[name="conceptos_ids"] tr.o_data_row',
      addLineButton:
        'div[name="concept_ids"] a:has-text("Agregar"), div[name="concept_ids"] a:has-text("AÃ±adir"), div[name="commission_line_ids"] a:has-text("Agregar"), div[name="commission_line_ids"] a:has-text("AÃ±adir"), div[name="product_commission_concept_ids"] a:has-text("Agregar"), div[name="product_commission_concept_ids"] a:has-text("AÃ±adir"), div[name="conceptos_ids"] a:has-text("Agregar"), div[name="conceptos_ids"] a:has-text("AÃ±adir")',
      conceptoInput:
        'td[name="concept_id"] input, td[name="concepto_id"] input, td[name="commission_concept_id"] input, td input[role="combobox"]',
      productoComisionInput:
        'td[name="commission_product_id"] input, td[name="producto_comision_id"] input, td[name="product_commission_id"] input',
      tipoInput:
        'td[name="type"] input, td[name="tipo"] input, td[name="line_type"] input, td input[role="combobox"]',
      modoInput:
        'td[name="mode"] input, td[name="modo"] input, td[name="calculation_mode"] input, td input[role="combobox"]',
      financiadoInput:
        'td[name="financiado"] input, td[name="financed"] input, td[name="is_financed"] input, td input[type="checkbox"]',
      porcentajeMinimoInput:
        'td[name="min_percentage"] input, td[name="porcentaje_minimo"] input, td[name="percent_min"] input, td input[type="text"], td input[type="number"]',
      porcentajeMaximoInput:
        'td[name="max_percentage"] input, td[name="porcentaje_maximo"] input, td[name="percent_max"] input, td input[type="text"], td input[type="number"]',
      pdMinimoInput:
        'td[name="pd_min"] input, td[name="pd_minimo"] input, td input[type="text"], td input[type="number"]',
      pdMaximoInput:
        'td[name="pd_max"] input, td[name="pd_maximo"] input, td input[type="text"], td input[type="number"]',
      plazoMinimoMesesInput:
        'td[name="min_term_months"] input, td[name="plazo_minimo_meses"] input, td[name="min_months"] input, td input[type="text"], td input[type="number"]',
      importeMinimoInput:
        'td[name="min_amount"] input, td[name="importe_minimo"] input, td[name="amount_min"] input, td input[type="text"], td input[type="number"]',
      importeMaximoInput:
        'td[name="max_amount"] input, td[name="importe_maximo"] input, td[name="amount_max"] input, td input[type="text"], td input[type="number"]',
      importeMinimoCell:
        'td[name="importe_min_eur"], td[name="min_amount"], td[name="importe_minimo"], td[name="amount_min"]',
      importeMaximoCell:
        'td[name="importe_max_eur"], td[name="max_amount"], td[name="importe_maximo"], td[name="amount_max"]',
      porcentajeMinimoCell:
        'td[name="percent_min"], td[name="min_percentage"], td[name="porcentaje_minimo"]',
      porcentajeMaximoCell:
        'td[name="percent_max"], td[name="max_percentage"], td[name="porcentaje_maximo"]',
      periodicidadInput:
        'td[name="periodicity"] input, td[name="periodicidad"] input, td input[role="combobox"]',
      duracionInput:
        'td[name="duracion_value"] input, td[name="duration"] input, td[name="duration_value"] input, td input[type="text"], td input[type="number"]',
      unidadInput:
        'td[name="duracion_unit"] input, td[name="duration_unit"] input, td[name="unit"] input, td input[role="combobox"]',
      duracionCell:
        'td[name="duracion_value"], td[name="duration"], td[name="duration_value"]',
      unidadCell:
        'td[name="duracion_unit"], td[name="duration_unit"], td[name="unit"]',
      deleteButton:
        'button[aria-label="Eliminar"], button[title="Eliminar"], .fa-trash, .o_list_record_remove',
      autocompleteOption:
        '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
    },
    autocompleteOption:
      '.o-autocomplete--dropdown-item, .dropdown-menu .dropdown-item, .ui-menu-item, .o_select_menu_item, [role="option"], [role="menuitem"]'
} as const;
