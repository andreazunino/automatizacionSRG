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
