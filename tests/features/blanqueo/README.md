# Blanqueo

Este modulo contiene los casos de prueba del flujo de expedientes de Blanqueo de Capitales.

## Casos automatizados

### BLA-001

Crea un expediente de blanqueo con datos completos y verifica:

- codigo automatico de secuencia;
- estado inicial `Incompleto`;
- origen `Manual`;
- NIF autocompletado desde el Titular;
- chatter de creacion visible.

### BLA-003

Valida que el listado de expedientes permita:

- identificar dinamicamente un expediente existente;
- buscarlo por su codigo;
- aplicar el filtro `Activos`;
- aplicar el filtro `Archivados`;
- limpiar todos los filtros.

El codigo usado se obtiene desde la primera fila visible para evitar depender de datos fijos del ambiente.

### BLA-004

Valida que el sistema impida guardar un expediente de blanqueo sin `Titular`.

El escenario:

- abre un expediente nuevo;
- completa solamente `Fecha de Apertura` con la fecha actual;
- intenta guardar;
- comprueba que el formulario permanezca sin guardar y que `Titular` sea informado como obligatorio.

## Casos bloqueados

### BLA-002

Estado: bloqueado.

Objetivo: verificar que el campo `NIF` se actualice automaticamente al cambiar el `Titular` del expediente.

Motivo del bloqueo: el campo `Titular` no permite modificacion en la interfaz actual, impidiendo seleccionar un segundo contacto y comprobar la actualizacion automatica del NIF.

Tags aplicados:

```gherkin
@bla-002 @no_automatizar @bug_bloqueante
```

El caso queda documentado en `blanqueo.feature`, pero no forma parte de la ejecucion automatizada hasta que se habilite la modificacion del campo `Titular`.

### BLA-010

Estado: automatizado.

Objetivo: ejecutar `Comprobar Blanqueo` y verificar la representacion correcta de las coincidencias generadas.

Criterio de validacion del CP:

- el stat button `Alerta Blanqueo` debe incrementar indicando el total de coincidencias detectadas;
- las coincidencias nuevas se generan inicialmente en estado `Pendiente`;
- la pestaña `Positivos de Blanqueo` debe permanecer vacia mientras las coincidencias esten en estado `Pendiente`;
- las coincidencias solamente deben visualizarse en la pestaña `Positivos de Blanqueo` cuando sean marcadas como `Positivo`.

Por lo tanto, que la pestaña permanezca vacia despues de ejecutar `Comprobar Blanqueo` no representa un fallo si el contador `Alerta Blanqueo` incremento correctamente y las coincidencias siguen en estado `Pendiente`.

La precondicion se obtiene dinamicamente desde `Alertas de Blanqueo`, seleccionando un Titular agrupado con coincidencias y creando un expediente nuevo por UI. Antes de ejecutar la comprobacion se valida que la pestaña `Positivos de Blanqueo` este vacia.

## Ejecucion

Ejecutar los casos automatizables del modulo:

```powershell
npm.cmd run test:blanqueo
```
