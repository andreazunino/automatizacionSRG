# language: es
@bienes
Característica: Gestion de bienes
  Como usuario interno con acceso al modulo Bienes
  Quiero administrar los tipos de bienes
  Para mantener actualizado el catalogo de maestros

  @tc-001
  Escenario: Crear editar archivar y activar un Tipo de Bienes
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Bienes
    Y creo edito archivo y activo un Tipo de Bienes
    Entonces deberia completarse el ciclo CRUD de Tipo de Bienes

  @tc-002
  Escenario: Validar campo Descripcion obligatorio en Tipo de Bienes
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Bienes
    Y intento guardar un Tipo de Bienes sin Descripcion
    Entonces deberia visualizar la validacion de Descripcion obligatoria y el Tipo de Bienes no se guarda

  @tc-003
  Escenario: Crear editar archivar y validar Cod Registro obligatorio en Registro de Propiedad
    # Observacion funcional: el campo Observaciones admite contenido enriquecido, pero se observo que
    # puede mostrar etiquetas HTML visibles al usuario. No forma parte de la validacion automatizada de este CP.
    Dado que inicio sesion en la aplicacion
    Cuando creo edito archivo y valido Cod Registro obligatorio en Registro de Propiedad
    Entonces deberia completarse el ciclo de Registro de Propiedad y rechazarse el alta sin Cod Registro

  @tc-004
  Escenario: Gestionar Tipos de Carga con CRUD y validacion de codigo unico
    Dado que inicio sesion en la aplicacion
    Cuando gestiono Tipos de Carga y valido codigo unico
    Entonces deberia completarse la gestion de Tipos de Carga con rechazo de duplicado y archivado correcto

  @tc-005
  Escenario: Gestionar Motivos de Solicitud y limpiar campo secundario al cambiar Motivo
    # Observacion funcional: el campo secundario siempre se encuentra visible, pero cambia sus opciones
    # segun el Motivo de peticion elegido.
    Dado que inicio sesion en la aplicacion
    Cuando gestiono Motivos de Solicitud y verifico limpieza del campo secundario
    Entonces deberia quedar validada la gestion de Motivos de Solicitud y nombre calculado dinamico

  @tc-006
  Escenario: Crear editar y archivar un Bien con sus campos principales
    Dado que inicio sesion en la aplicacion
    Cuando creo edito y archivo un Bien con sus campos principales
    Entonces deberia completarse el ciclo CRUD del Bien y desaparecer de la lista activa

  @tc-007
  Escenario: Validar campo Descripcion obligatorio al crear un Bien
    Dado que inicio sesion en la aplicacion
    Cuando intento guardar un Bien sin Descripcion
    Entonces deberia visualizar la validacion de Descripcion obligatoria y el Bien no se guarda

  @tc-008
  Escenario: Crear carpeta de documentos automaticamente al guardar un Bien
    Dado que inicio sesion en la aplicacion
    Cuando creo un Bien y abro su carpeta de documentos
    Entonces deberia visualizar la carpeta de documentos del Bien dentro de 04 - Bienes

  @tc-009
  Escenario: Renombrar automaticamente la carpeta de documentos al cambiar el nombre del Bien
    Dado que inicio sesion en la aplicacion
    Cuando renombro un Bien con carpeta de documentos
    Entonces deberia visualizar la carpeta de documentos con el nuevo nombre del Bien

  @tc-013
  Escenario: Validar busqueda global filtros predefinidos y agrupacion en lista de Bienes
    Dado que inicio sesion en la aplicacion
    Cuando preparo bienes y valido busqueda global filtros y agrupacion
    Entonces deberia quedar validada la busqueda por multiples campos filtros predefinidos y agrupacion por Tipo

  @tc-014
  Escenario: Añadir editar y eliminar propietarios de un Bien
    Dado que inicio sesion en la aplicacion
    Cuando gestiono propietarios de un Bien y verifico el total calculado tras cada operacion
    Entonces deberia quedar validado el recalculo del total de propietarios activos del Bien

  @tc-015
  Escenario: Validar que el porcentaje total de propietarios activos no puede superar el 100
    Dado que inicio sesion en la aplicacion
    Cuando intento guardar propietarios activos de un Bien superando el cien por ciento
    Entonces deberia visualizar la validacion de porcentaje total de propietarios activos superior al cien por ciento

  @tc-016
  Escenario: Validar fechas de propietario futuras bajas sin adquisicion y rangos invalidos
    Dado que inicio sesion en la aplicacion
    Cuando intento guardar propietarios de un Bien con fechas invalidas
    Entonces deberia visualizar las validaciones de fechas de propietarios

  @tc-017
  Escenario: Dar de baja un propietario y verificar que no cuenta en el porcentaje activo
    # Observacion funcional: una fecha de baja pasada debe excluir al propietario del calculo de activos.
    Dado que inicio sesion en la aplicacion
    Cuando doy de baja un propietario de un Bien con dos propietarios activos
    Entonces deberia visualizar que el porcentaje activo excluye al propietario dado de baja

  @tc-018
  Escenario: Agrupar bienes y desagrupar reactivando el bien hijo
    # Observacion funcional: el bien hijo se archiva al agrupar y se reactiva al desagrupar.
    Dado que inicio sesion en la aplicacion
    Cuando agrupo dos bienes y luego desagrupo el bien hijo
    Entonces deberia visualizar que el bien hijo se reactiva y pierde la finca agrupadora

  @tc-019
  Escenario: Validar que no aparece desagrupar en bienes sin finca agrupadora
    Dado que inicio sesion en la aplicacion
    Cuando abro un Bien sin finca agrupadora
    Entonces no deberia visualizar accion ni registro de desagrupar en la agrupacion del Bien

  @tc-020
  Escenario: Validar filtros Bienes Agrupadores y Bienes Agrupados en la lista
    Dado que inicio sesion en la aplicacion
    Cuando preparo bienes agrupados y valido filtros de agrupacion
    Entonces deberia quedar validado que los filtros muestran padres e hijos agrupados correctamente

  @tc-021
  Escenario: Añadir una carga a un Bien y verificar calculo del total hipotecario
    # Observacion funcional: el total debe sumar principal, intereses ordinarios, intereses de demora y gastos.
    Dado que inicio sesion en la aplicacion
    Cuando añado una carga hipotecaria a un Bien y edito su descripcion
    Entonces deberia visualizar el total hipotecario calculado correctamente y la edicion persistida

  @tc-023
  Escenario: Dar de baja una carga y verificar que pasa al historico
    # Observacion funcional: una carga con fecha baja pasada desaparece de vigentes y aparece en historico.
    Dado que inicio sesion en la aplicacion
    Cuando doy de baja una carga vigente de un Bien
    Entonces deberia visualizar la carga en historico y no en vigentes

  @tc-027
  Escenario: Crear Solicitud de Tasacion y verificar dominios de Titular y Tasadora
    # Observacion funcional: al buscar valores fuera de dominio aparece "No hay registros"; al guardar,
    # se validan obligatorios pendientes y el estado queda Solicitada.
    Dado que inicio sesion en la aplicacion
    Cuando valido dominios de Titular y Tasadora en una Solicitud de Tasacion
    Entonces deberia visualizar estado Solicitada y validacion por campos obligatorios pendientes

  @tc-028
  Escenario: Verificar la pestaña Bienes en la ficha de un Contacto propietario
    Dado que inicio sesion en la aplicacion
    Cuando preparo un Bien con propietario y abro la ficha del Contacto propietario
    Entonces deberia visualizar el Bien en la pestaña Bienes del Contacto y abrir su formulario

  @tc-029
  Escenario: Verificar acceso CRUD completo para usuario interno estandar
    Dado que inicio sesion en la aplicacion
    Cuando valido acceso CRUD completo de Bienes con usuario interno estandar
    Entonces deberia quedar validado el acceso CRUD completo al modulo Bienes

  @tc-030
  Escenario: Crear una tasacion manual en un Bien y verificar asignacion de secuencia
    # Observacion funcional: en la prueba manual no se encontraron los campos Tipo Tasacion R ni Tipo de Valoracion.
    Dado que inicio sesion en la aplicacion
    Cuando creo una tasacion manual en un Bien y verifico su secuencia
    Entonces deberia quedar validada la tasacion manual con secuencia y ultima tasacion actualizada
