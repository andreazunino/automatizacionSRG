# AGENTS.md

## Objetivo del proyecto

Framework de automatización E2E reutilizable y escalable usando:
- Playwright
- TypeScript
- Cucumber
- Gherkin
- Page Object Model

El proyecto debe ser mantenible por perfiles QA técnicos y semi técnicos.

---

## Reglas obligatorias

- Usar Page Object Model.
- No escribir lógica Playwright directamente en los step definitions.
- Los steps deben llamar métodos de Pages.
- Reutilizar componentes comunes.
- Evitar código duplicado.
- No usar waits fijos (`waitForTimeout`) salvo casos excepcionales.
- Priorizar `locator`, `expect` y waits explícitas.
- Mantener escenarios Gherkin legibles para QA manual y funcionales.
- Los escenarios deben escribirse en español.
- Centralizar selectores y datos reutilizables.
- Separar selectores y datos por modulo:
  - Selectores comunes: `tests/utils/selectors/commonSelectors.ts`, `tests/utils/selectors/odooCommonSelectors.ts` o archivos comunes equivalentes.
  - Selectores de modulo: `tests/utils/selectors/<modulo>Selectors.ts`.
  - Datos/factories de modulo: `tests/fixtures/<modulo>/<modulo>Data.ts`.
  - No agregar nuevos selectores o datos en archivos centrales legacy.
- No hardcodear credenciales ni URLs.
- Usar TypeScript estricto.
- Mantener carpetas separadas:
  - features
  - steps
  - pages
  - fixtures
  - utils
  - support

---

## Evidencias obligatorias

Cada ejecución debe generar:
- HTML Report
- Screenshots en fallos
- Video en fallos
- Trace en fallos

---

## Convenciones

### Naming
- Pages: `NombrePage.ts`
- Steps: `nombre.steps.ts`
- Features: `nombre.feature`

### Features
Usar:
- Característica
- Escenario
- Dado
- Cuando
- Entonces

### Selectores
Priorizar:
1. data-testid
2. role
3. text
4. css
5. xpath como último recurso

---

## Escalabilidad

El framework debe permitir agregar nuevos módulos:
- Contactos
- Riesgos
- Expedientes
- Garantías

sin modificar módulos existentes.

---

## Calidad esperada

El código debe parecer de nivel profesional enterprise QA Automation.
