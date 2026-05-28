# language: es
@contactos
Característica: Gestión de Contactos
  Como usuario gestor
  Quiero administrar contactos
  Para mantener actualizada la información del sistema

  Escenario: Login exitoso
    Dado que navego a la aplicación
    Cuando inicio sesión con credenciales válidas
    Entonces debería visualizar la pantalla principal

  Escenario: Acceso al módulo Contactos
    Dado que inicio sesión en la aplicación
    Cuando accedo al módulo Contactos
    Entonces debería visualizar la bandeja de Contactos

  @per-001
  Escenario: Crear persona física con todos los campos de identidad y guardar
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo una persona física con todos los campos de identidad
    Entonces debería visualizar la persona física guardada con nombre completo calculado
    Cuando edito el segundo apellido de la persona física
    Entonces debería visualizar el nombre recalculado de la persona física

  @per-002
  Escenario: Intentar guardar persona física sin Nombre ni Primer Apellido
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento guardar una persona física sin Nombre ni Primer Apellido
    Entonces debería visualizar la validación de Nombre y Primer Apellido obligatorios

  @per-003
  Escenario: Validar NIF y NIE según Tipo de Documento
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento guardar una persona física con NIF inválido
    Entonces debería visualizar la validación de formato de NIF
    Cuando corrijo el NIF con un valor válido y guardo
    Entonces debería visualizar la persona física guardada con NIF válido
    Cuando creo una persona física con NIE válido
    Entonces debería visualizar la persona física guardada con NIE válido

  @per-006
  Escenario: Asignar múltiples CNAEs a una empresa y gestionar el CNAE principal
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo una empresa para gestionar sus CNAEs
    Y asigno múltiples CNAEs e intento marcar ambos como principal
    Entonces debería visualizar ambos CNAEs y un único CNAE principal actualizado

  @per-007
  Escenario: Gestionar epígrafes IAE con fecha de baja y actividad económica
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo una empresa con actividad económica activada
    Y gestiono epígrafes IAE con fecha de baja
    Entonces debería visualizar el epígrafe principal activo y el epígrafe secundario inactivo

  @per-010
  Escenario: Completar campos de Banco de España en una empresa
    Dado que inicio sesión como administrador
    Y accedo al módulo Contactos
    Cuando completo los campos de Banco de España en una empresa
    Entonces debería visualizar los datos de Banco de España guardados correctamente

  @per-011
  Escenario: Marcar contacto como fallecido y como persona pública
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo una persona física para validar indicadores simples
    Y marco la persona física como fallecida y persona pública
    Entonces debería visualizar la persona física con los indicadores Fallecido y Persona Pública activos

  @per-012
  Escenario: Validar que la fecha de nacimiento no puede ser futura
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento guardar una persona física con fecha de nacimiento futura
    Entonces debería visualizar la validación de fecha de nacimiento futura

  @per-013
  Escenario: Completar dirección con tipo de vía, número, planta y puerta
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando completo la dirección extendida en una empresa
    Entonces debería visualizar la dirección extendida guardada correctamente

  @per-015
  Escenario: Crear forma jurídica, rechazar duplicado exacto y crear vinculación
    Dado que inicio sesión como administrador
    Y accedo al módulo Contactos
    Cuando creo una forma jurídica desde configuración
    Y intento crear otra forma jurídica con el mismo código exacto
    Entonces debería visualizar el rechazo por código duplicado exacto
    Cuando creo una vinculación desde configuración
    Entonces debería visualizar la vinculación disponible en configuración

  @per-016
  Escenario: Crear unidad de decisión y vincularla con miembros del grupo económico
    Dado que inicio sesión como administrador
    Y accedo al módulo Contactos
    Cuando creo una unidad de decisión desde configuración
    Y vinculo la unidad de decisión con un miembro de un grupo económico existente
    Entonces debería visualizar la unidad de decisión asignada al miembro del grupo económico

  @per-017
  Escenario: Intentar guardar persona física sin país de nacimiento
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento guardar una persona física sin país de nacimiento
    Entonces debería visualizar la validación de país de nacimiento obligatorio

  @per-018
  Escenario: Completar y guardar los campos de Informe Cliente en una empresa
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo una empresa para completar Informe Cliente
    Y completo y guardo los campos de Informe Cliente
    Entonces debería visualizar los campos de Informe Cliente guardados al reabrir la empresa

  @per-020
  Escenario: Verificar que al cambiar el tipo de empresa la interfaz adapta los campos visibles
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando abro el formulario de nuevo contacto
    Y selecciono tipo Físico y verifico sus campos dinámicos
    Entonces al cambiar a tipo Jurídico debería visualizar la interfaz de empresa

  @per-022
  Escenario: Añadir y consultar representante de una persona jurídica
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando añado un representante a una persona jurídica
    Entonces debería visualizar el representante vinculado a la persona jurídica

  @per-024
  Escenario: Consultar las relaciones directas e indirectas de una persona desde su ficha
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando preparo una persona jurídica con una relación conocida
    Entonces debería visualizar las relaciones disponibles en la ficha con las discrepancias actuales

  @per-025
  Escenario: Asignar múltiples tipologías a un contacto y documentar ausencia de filtro por tipología
    Dado que inicio sesión como administrador
    Y accedo al módulo Contactos
    Cuando creo una tipología para asignarla a contactos
    Y accedo al módulo Contactos
    Y creo un contacto para asignarle tipologías
    Y asigno la tipología nueva y otra existente al contacto
    Entonces debería visualizar las tipologías asignadas en el contacto
    Y debería documentar que no existe filtro visible por tipología en el listado

  @per-027
  Escenario: Completar datos del Registro Mercantil y validar que la fecha de inscripción no es futura
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando completo los datos del Registro Mercantil en una empresa
    Entonces debería visualizar los datos del Registro Mercantil guardados correctamente
    Cuando intento guardar una fecha de inscripción futura en el Registro Mercantil
    Entonces debería visualizar la validación de fecha de inscripción futura

  @per-028
  Escenario: Intentar asignar el mismo código CNAE dos veces a la misma empresa
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo una empresa para validar CNAE duplicado
    Y intento asignar el mismo código CNAE dos veces a la empresa
    Entonces debería visualizar la validación de CNAE duplicado sin guardar el duplicado
