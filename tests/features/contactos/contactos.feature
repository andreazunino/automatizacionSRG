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

  @no_implementado
  Escenario: Crear contacto
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando creo un contacto con datos válidos
    Entonces debería visualizar el mensaje de contacto creado
    Y el contacto debería aparecer en la búsqueda

  Escenario: Buscar contacto
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando busco un contacto existente
    Entonces debería visualizar el contacto en los resultados

  @no_implementado
  Escenario: Editar contacto
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando edito un contacto existente
    Entonces debería visualizar el mensaje de contacto actualizado
    Y debería visualizar los datos actualizados del contacto

  @no_implementado
  Escenario: Eliminar contacto
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando elimino un contacto existente
    Entonces debería visualizar el mensaje de contacto eliminado
    Y el contacto no debería aparecer en la búsqueda

  @no_implementado
  Escenario: Validar campos obligatorios
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento crear un contacto sin completar campos obligatorios
    Entonces debería visualizar los mensajes de campos obligatorios

  @no_implementado
  Escenario: Validar contacto duplicado
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento crear un contacto duplicado
    Entonces debería visualizar el mensaje de contacto duplicado
