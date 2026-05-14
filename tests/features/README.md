# Alcance de automatización E2E

Los escenarios Gherkin deben representar flujos de usuario validables desde la interfaz web. No se deben automatizar como casos E2E los escenarios que dependan principalmente de procesos técnicos, integraciones externas o funcionalidades no disponibles.

## Casos excluidos

Los siguientes casos quedan fuera del alcance automatizable del framework:

- Crons o acciones planificadas.
- RPC o llamadas técnicas directas al servidor.
- APIs externas: Notariado, Experian, CIRBE, IdConfirma, SMTP/email y listas de sanciones externas.
- Bugs activos que bloquean el caso de prueba.
- Funcionalidades no implementadas.

## Tags de exclusión

Si un escenario queda documentado temporalmente en un `.feature`, debe marcarse con alguno de estos tags para que Cucumber lo excluya automáticamente:

- `@no_automatizar`
- `@cron`
- `@rpc`
- `@api_externa`
- `@bug_bloqueante`
- `@no_implementado`

Ejemplo:

```gherkin
@api_externa @no_automatizar
Escenario: Validar respuesta de Experian
  Dado que existe una solicitud de evaluación crediticia
  Cuando se consulta Experian
  Entonces debería registrarse la respuesta externa
```

Estos casos deben validarse por otra estrategia de prueba, como pruebas de integración, contract testing, mocks controlados, monitoreo operativo o validación manual asistida.
