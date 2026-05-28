export const productosComisionSelectors = {
    pageTitleText: /Productos de comisi[oÃ³]n|Producto de comisi[oÃ³]n|Comisiones/i,
    newButton: 'button:has-text("Nuevo")',
    saveButton: 'button[aria-label="Guardar manualmente"]:visible, button:has-text("Guardar"):visible',
    nameInput: 'div[name="name"] input, input[name="name"], h1 input',
    labels: {
      nombre: 'Nombre',
      referenciaInterna: 'Referencia interna',
      tipo: 'Tipo',
      impuestosCliente: 'Impuestos cliente',
      impuestosProveedor: 'Impuestos proveedor'
    },
    fields: {
      referenciaInterna:
        'div[name="default_code"] input, div[name="internal_reference"] input, div[name="referencia_interna"] input, input[name="default_code"], input[name="internal_reference"], input[name="referencia_interna"]',
      tipo:
        'div[name="detailed_type"] input, div[name="type"] input, div[name="tipo"] input, input[name="detailed_type"], input[name="type"], input[name="tipo"]',
      impuestosCliente:
        'div[name="taxes_id"] input, div[name="tax_ids"] input, div[name="impuestos_cliente"] input, input[name="taxes_id"], input[name="tax_ids"], input[name="impuestos_cliente"]',
      impuestosProveedor:
        'div[name="supplier_taxes_id"] input, div[name="supplier_tax_ids"] input, div[name="impuestos_proveedor"] input, input[name="supplier_taxes_id"], input[name="supplier_tax_ids"], input[name="impuestos_proveedor"]'
    }
} as const;
