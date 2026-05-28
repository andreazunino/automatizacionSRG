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
