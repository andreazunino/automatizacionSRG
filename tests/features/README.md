# Alcance de automatizacion E2E

Los escenarios Gherkin deben representar flujos de usuario validables desde la interfaz web. No se deben automatizar como casos E2E los escenarios que dependan principalmente de procesos tecnicos, integraciones externas o funcionalidades no disponibles.

## Modulo Productos

Los escenarios del modulo `productos` estan en `tests/features/productos/productos.feature` y cubren productos financieros, productos de comision, lineas de comision, maestros, seguridad y validaciones de UI.

### Configuracion requerida

El modulo usa URLs y credenciales desde variables de entorno. No deben hardcodearse en features, steps ni pages.

Variables relevantes:

- `BASE_URL`
- `PRODUCTS_URL`
- `COMMISSION_PRODUCTS_URL`
- `ADMIN_USER`
- `ADMIN_PASSWORD`
- `PRODUCT_USER`
- `PRODUCT_PASSWORD`

`PRODUCTS_URL` debe apuntar a la accion de Productos financieros. Para el entorno de pruebas actual se uso como referencia:

```text
https://atlas-pruebas.odoo.com/odoo/action-1194
```

`COMMISSION_PRODUCTS_URL` debe apuntar a la accion real de Productos de comision del entorno. Si no esta configurada, los escenarios `@prd-013` y parte de `@ui-002` no son ejecutables de punta a punta.

### Criterios de implementacion

- Los escenarios se mantienen en espanol y orientados a negocio.
- Las tablas Gherkin se usan cuando el mismo flujo valida multiples campos o subcasos.
- La logica Playwright vive en `tests/pages/ProductosPage.ts`; los steps solo orquestan llamadas al Page Object.
- Los selectores reutilizables del modulo viven en `tests/utils/selectors/productosSelectors.ts` y archivos relacionados.
- Los datos reutilizables y factories viven en `tests/fixtures/productos/productosData.ts`.
- Las fechas se calculan de forma relativa en el codigo cuando el caso depende de "hoy", "hoy - 1 mes" o valores equivalentes.

## Modulo Contactos

Los escenarios del modulo `contactos` estan en `tests/features/contactos/contactos.feature` y cubren personas fisicas, personas juridicas, datos fiscales, CNAE, IAE, Banco de Espana, Registro Mercantil, tipologias y maestros de configuracion.

### Implementacion

- Page principal: `tests/pages/ContactosPage.ts`.
- Page de configuracion: `tests/pages/ConfiguracionContactosPage.ts`.
- Steps: `tests/steps/contactos.steps.ts`.
- Selectores principales: `tests/utils/selectors/contactosSelectors.ts`.
- Selectores de configuracion: `tests/utils/selectors/configuracionContactosSelectors.ts`.
- Selectores de tipologias: `tests/utils/selectors/tipologiasSelectors.ts`.
- Datos y factories: `tests/fixtures/contactos/contactosData.ts`.

## Modulo Bienes

Los escenarios del modulo `bienes` estan en `tests/features/bienes/bienes.feature`.

### Implementacion

- Page principal: `tests/pages/BienesPage.ts`.
- Steps: `tests/steps/bienes.steps.ts`.
- Selectores: `tests/utils/selectors/bienesSelectors.ts`.
- Datos y factories: `tests/fixtures/bienes/tipoBienData.ts`.
- URL configurable para Tipo de Bienes: `ACTION_BIENES`.
- URL configurable para Registro de Propiedad: `ACTION_REGISTRO_PROPIEDAD`.
- URL configurable para Motivos de Solicitud: `ACTION_MOTIVOS_SOLICITUD` (`https://atlas-pruebas.odoo.com/odoo/action-994`).

El caso `TC-001` valida crear, editar, archivar y activar un Tipo de Bienes desde la UI.
El caso `TC-002` valida que `Descripcion` sea obligatorio en Tipo de Bienes.
El caso `TC-003` valida crear, editar y archivar Registro de Propiedad, y rechazar el alta sin `Cod. Registro`.

Observacion funcional de `TC-003`: al completar el campo `Observaciones`, que aparentemente admite contenido enriquecido, se observa que no se renderiza correctamente en la interfaz y muestra etiquetas HTML visibles al usuario. No forma parte de la validacion automatizada principal del CP.
El caso `TC-005` valida Motivos de Solicitud usando `ACTION_MOTIVOS_SOLICITUD`: el campo secundario cambia sus opciones segun el Motivo, se limpia al modificarlo, y el Nombre completo se calcula dinamicamente.

## Estructura por modulo

Cada modulo nuevo debe seguir esta forma:

```text
tests/features/<modulo>/<modulo>.feature
tests/steps/<modulo>.steps.ts
tests/pages/<Modulo>Page.ts
tests/fixtures/<modulo>/<modulo>Data.ts
tests/utils/selectors/<modulo>Selectors.ts
```

Los selectores comunes de Odoo deben reutilizarse desde:

- `tests/utils/selectors/commonSelectors.ts`
- `tests/utils/selectors/odooCommonSelectors.ts`

No agregar nuevos selectores en un archivo central unico. Cada modulo debe mantener sus selectores y datos en sus propios archivos para permitir commits y revisiones por bloque.

### Notas funcionales y acotaciones

- `PRD-001`: valida el ciclo completo de estado. Al archivar, `Fecha baja` debe informarse con la fecha actual; al desarchivar debe quedar vacia y el producto debe volver a la lista activa.
- `PRD-004`, `PRD-005`, `LIN-004` y `LIN-005`: son data-driven. Las tablas de datos representan subcasos independientes sobre el mismo flujo de edicion/guardado.
- `PRD-005`: existe un bug conocido de alerta duplicada por inactividad. No bloquea la automatizacion; las validaciones ignoran esa alerta si aparece y continuan con la comprobacion funcional.
- `PRD-011`, `PRD-012` y `PRD-013-N`: el comportamiento observado no muestra un mensaje de error al intentar solapar excluidos e incluidos. Al elegir un valor como excluido, deja de aparecer en el selector de incluidos. Por eso la automatizacion valida la desaparicion del valor en el selector, no una modal de validacion.
- `LIN-003`: el concepto huerfano requiere intentar crear primero un concepto de comision sin `Producto de comision`. En la aplicacion actual la validacion puede dispararse ya al guardar el maestro, antes de usarlo en una linea de producto. Ese comportamiento se considera valido para el caso.
- `LIN-005`: en la inspeccion de la pantalla real de `Productos financieros > Conceptos` no se encontraron campos visibles separados para `Rango Estandar` y `Umbral Permiso`. El caso se automatiza sobre las reglas visibles equivalentes: `Plazo min. <= Plazo max.`, `Imp. min. <= Imp. max.`, `% min. <= % max.` y `PD min. <= PD max.`.
- `LIN-006`: para periodicidades `Trimestral` y `Semestral`, la duracion esperada se autocompleta en 3 y 6 meses respectivamente y los campos quedan bloqueados.
- `MAE-001`: en conceptos protegidos solo debe permitirse modificar `Producto de comision`; `Nombre` y `Codigo` deben permanecer readonly y el registro no debe poder eliminarse.
- `MAE-007`: Naturaleza T4 es un maestro necesario para configurar Grupo de producto (`atlas.naturaleza.t4`). El selector de Grupo de producto debe mostrar solo registros activos.
- `UI-003`: valida el comportamiento visible de la linea en `Conceptos`. Al seleccionar `Modo = Importe`, se esperan campos de importe visibles y campos porcentuales ocultos; con `Modo = Porcentual` se invierte. Con `Periodicidad = Al tiron`, el bloque de duracion debe ocultarse sin necesidad de guardar.

### Ejecucion recomendada

Dry-run tecnico del modulo:

```bash
npx cucumber-js tests/features/productos/productos.feature --tags "@productos" --dry-run
```

Ejecucion de un caso puntual:

```bash
npx cucumber-js tests/features/productos/productos.feature --tags "@lin-006"
```

Antes de ejecutar contra Odoo, validar que las URLs de acciones y credenciales del entorno correspondan al usuario/rol requerido por cada escenario.

Observacion funcional de `TC-030`: la automatizacion de la tasacion manual omite los campos `Tipo Tasacion: R` y `Tipo de Valoracion`, porque no se encontraron en la vista de Odoo al realizar la validacion manual. El caso valida el alta con fecha valor, fecha caducidad, valor, Cumple ECO, tasadora, metodo de tasacion, secuencia generada y actualizacion de ultima tasacion.

Dry-run por scripts:

```bash
npm run test:contactos -- --dry-run
npm run test:productos -- --dry-run
npm run test:bienes -- --dry-run
```

## Casos excluidos

Los siguientes casos quedan fuera del alcance automatizable del framework:

- Crons o acciones planificadas.
- RPC o llamadas tecnicas directas al servidor.
- APIs externas: Notariado, Experian, CIRBE, IdConfirma, SMTP/email y listas de sanciones externas.
- Bugs activos que bloquean el caso de prueba.
- Funcionalidades no implementadas.

## Tags de exclusion

Si un escenario queda documentado temporalmente en un `.feature`, debe marcarse con alguno de estos tags para que Cucumber lo excluya automaticamente:

- `@no_automatizar`
- `@cron`
- `@rpc`
- `@api_externa`
- `@bug_bloqueante`

Ejemplo:

```gherkin
@api_externa @no_automatizar
Escenario: Validar respuesta de Experian
  Dado que existe una solicitud de evaluacion crediticia
  Cuando se consulta Experian
  Entonces deberia registrarse la respuesta externa
```

Estos casos deben validarse por otra estrategia de prueba, como pruebas de integracion, contract testing, mocks controlados, monitoreo operativo o validacion manual asistida.

