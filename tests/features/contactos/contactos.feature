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

  Escenario: Editar contacto
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando edito un contacto existente
    Entonces debería visualizar el mensaje de contacto actualizado
    Y debería visualizar los datos actualizados del contacto

  Escenario: Eliminar contacto
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando elimino un contacto existente
    Entonces debería visualizar el mensaje de contacto eliminado
    Y el contacto no debería aparecer en la búsqueda

  Escenario: Validar campos obligatorios
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento crear un contacto sin completar campos obligatorios
    Entonces debería visualizar los mensajes de campos obligatorios

  Escenario: Validar contacto duplicado
    Dado que inicio sesión en la aplicación
    Y accedo al módulo Contactos
    Cuando intento crear un contacto duplicado
    Entonces debería visualizar el mensaje de contacto duplicado
