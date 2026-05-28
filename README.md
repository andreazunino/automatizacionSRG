# Automatizacion SGR E2E

Framework base para automatizacion E2E de una aplicacion web usando Playwright, TypeScript, Cucumber, Gherkin y Page Object Model.

## Instalacion

```bash
npm install
npx playwright install
```

En Windows, si PowerShell bloquea `npm`, usar:

```bash
npm.cmd install
npx.cmd playwright install
```

## Configuracion

Crear un archivo `.env` a partir de `.env.example`:

```env
BASE_URL=https://atlas-pruebas.odoo.com/web/login?redirect=%2Fodoo%3F
CONTACTS_URL=https://atlas-pruebas.odoo.com/odoo/contacts
ADMIN_USER=usuario_admin
ADMIN_PASSWORD=password_admin
INTERNAL_USER=usuario_interno
INTERNAL_PASSWORD=password_interno
QA_USER=usuario_qa
QA_PASSWORD=password_qa
HEADLESS=true
```

No se deben versionar credenciales reales ni URLs sensibles.

## Ejecucion

Ejecutar todos los escenarios automatizables:

```bash
npm run test
```

Ejecutar solo el modulo Contactos:

```bash
npm run test:contactos
```

Ejecutar con navegador visible:

```bash
npm run test:headed
```

Limpiar evidencias generadas:

```bash
npm run clean
```

## Casos excluidos

Quedan fuera del alcance de automatizacion E2E:

- Crons o acciones planificadas.
- RPC o llamadas tecnicas directas al servidor.
- APIs externas: Notariado, Experian, CIRBE, IdConfirma, SMTP/email y listas de sanciones externas.
- Bugs activos que bloquean el caso de prueba.
- Funcionalidades no implementadas.

Si un caso debe quedar documentado temporalmente en Gherkin, marcarlo con tags de exclusion:

```gherkin
@api_externa @no_automatizar
Escenario: Validar respuesta de Experian
  Dado que existe una solicitud de evaluacion crediticia
  Cuando se consulta Experian
  Entonces deberia registrarse la respuesta externa
```

Cucumber excluye automaticamente estos tags:

- `@no_automatizar`
- `@cron`
- `@rpc`
- `@api_externa`
- `@bug_bloqueante`

## Reportes y evidencias

Cada ejecucion genera reportes de Cucumber en:

- `reports/cucumber-report.html`
- `reports/cucumber-report.json`

Ante fallos se generan:

- Screenshots en `screenshots/`
- Videos en `videos/`
- Traces en `traces/`

## Agregar un escenario Gherkin

1. Crear o editar un archivo `.feature` dentro de `tests/features/<modulo>/`.
2. Escribir el escenario en espanol usando `Dado`, `Cuando` y `Entonces`.
3. Confirmar que el escenario no pertenezca a los casos excluidos.
4. Agregar los steps necesarios en `tests/steps/`.
5. Mantener la logica tecnica dentro de Page Objects y helpers reutilizables.

Ejemplo:

```gherkin
# language: es
Escenario: Crear persona física con datos completos
  Dado que inicio sesion en la aplicacion
  Y accedo al modulo Contactos
  Cuando creo una persona fisica con todos los campos de identidad
  Entonces deberia visualizar la persona fisica guardada con nombre completo calculado
```

## Agregar un nuevo modulo

Para sumar modulos como Expedientes, Riesgos o Garantias:

1. Crear `tests/features/<modulo>/<modulo>.feature`.
2. Crear `tests/pages/<Modulo>Page.ts`.
3. Crear `tests/steps/<modulo>.steps.ts`.
4. Centralizar selectores nuevos en `tests/utils/selectors.ts`.
5. Centralizar datos reutilizables en `tests/fixtures/testData.ts`.

Los step definitions deben llamar metodos de pages. No se debe escribir logica Playwright directamente en los steps.

## Estado inicial

Los selectores y datos incluidos son placeholders basados en `data-testid`. Antes de ejecutar contra una aplicacion real, reemplazar los valores de `tests/utils/selectors.ts` por los selectores reales del sistema.

## Notas funcionales Productos

- `LIN-005`: en la inspeccion de la pantalla real de `Productos financieros > Conceptos` no se encontraron campos visibles ni columnas opcionales separadas para `Rango Estandar` y `Umbral Permiso`. El caso se automatiza sobre las reglas de coherencia visibles en la grilla: `Plazo min. <= Plazo max.`, `Imp. min. <= Imp. max.`, `% min. <= % max.` y `PD min. <= PD max.`.
