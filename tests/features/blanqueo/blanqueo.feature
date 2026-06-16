# language: es
@blanqueo
Característica: Gestion de expedientes de blanqueo
  Como usuario interno con acceso al modulo Blanqueo de Capitales
  Quiero crear expedientes de blanqueo
  Para verificar la gestion basica y la asignacion automatica de secuencia

  @bla-001
  Escenario: Crear expediente de blanqueo con datos completos y verificar codigo automatico de secuencia
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Blanqueo de Capitales
    Y creo un expediente de blanqueo con datos completos
    Entonces deberia visualizar el expediente de blanqueo creado con codigo automatico estado Incompleto origen Manual y NIF del titular

  @bla-002 @no_automatizar @bug_bloqueante
  Escenario: Verificar que el NIF se actualiza automaticamente al cambiar el Titular
    Dado que existe un expediente de blanqueo editable
    Y existe un titular con NIF "12345678Z"
    Y existe otro titular con NIF "B12345678"
    Cuando selecciono el titular con NIF "12345678Z" en el expediente
    Entonces el campo NIF deberia mostrar "12345678Z"
    Cuando cambio el titular por el contacto con NIF "B12345678"
    Entonces el campo NIF deberia actualizarse automaticamente a "B12345678"
    Y deberia poder guardar el expediente

  @bla-003
  Escenario: Buscar expedientes por identificador y filtrar activos archivados
    Dado que inicio sesion en la aplicacion
    Y accedo al modulo Blanqueo de Capitales
    Y identifico un expediente de blanqueo existente
    Cuando busco el expediente de blanqueo por su identificador
    Entonces deberia visualizar el expediente de blanqueo en la lista
    Cuando limpio la busqueda de expedientes de blanqueo
    Y aplico el filtro de expedientes de blanqueo "Activos"
    Entonces deberia visualizar el listado de expedientes de blanqueo filtrado por "Activos"
    Cuando aplico el filtro de expedientes de blanqueo "Archivados"
    Entonces deberia visualizar el listado de expedientes de blanqueo filtrado por "Archivados"
    Y deberia quedar el listado de expedientes de blanqueo sin filtros

  @bla-004
  Escenario: Intentar guardar un expediente sin Titular y validar campo obligatorio
    Dado que inicio sesion en la aplicacion
    Y accedo al modulo Blanqueo de Capitales
    Cuando intento guardar un expediente de blanqueo sin Titular
    Entonces deberia visualizar la validacion de Titular obligatorio en el expediente de blanqueo

  @bla-010
  Escenario: Ejecutar comprobacion directa de blanqueo contra listas de sanciones y verificar generacion de positivos
    Dado que inicio sesion en la aplicacion
    Cuando preparo un expediente con alertas Pendiente y sin positivos visibles
    Y pulso el boton Comprobar Blanqueo en la cabecera del formulario
    Entonces el stat button Alerta Blanqueo deberia incrementar con el total de coincidencias detectadas
    Y la pestaña Positivos de Blanqueo deberia permanecer vacia mientras las coincidencias esten en estado Pendiente
