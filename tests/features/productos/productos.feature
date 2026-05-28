# language: es
@productos
Característica: Gestion de productos financieros
  Como usuario gestor de productos
  Quiero administrar el ciclo de vida de productos financieros
  Para mantener vigente el catalogo de productos

  @prd-001
  Escenario: Crear, editar, archivar y desarchivar un producto financiero completo
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Entonces deberia visualizar la bandeja de Productos financieros
    Cuando creo un producto financiero completo
    Y edito el interes del producto financiero y guardo
    Y archivo el producto financiero
    Entonces deberia visualizar Fecha baja informada con la fecha actual
    Cuando desarchivo el producto financiero
    Entonces deberia visualizar Fecha baja vacia y el producto en la lista activa

  @prd-002
  Escenario: Intentar guardar producto financiero sin nombre
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y intento guardar un producto financiero sin nombre
    Entonces deberia visualizar la validacion de Nombre obligatorio y el producto no se guarda

  @prd-003
  Escenario: Duplicar producto financiero y verificar herencia de producto padre
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero con comisiones para duplicar
    Y duplico el producto financiero y cambio el nombre de la copia
    Entonces deberia visualizar la relacion al producto original y sus comisiones copiadas

  @prd-004
  Escenario: Rechazar valores negativos en campos numericos del producto
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y intento guardar valores negativos en campos numericos del producto
      | campo              | valor | valor_valido |
      | Reaval mínimo (%)  | -5    | 10           |
      | Importe mínimo (€) | -1000 | 5000         |
      | Mínimo (meses)    | -6    | 12           |
      | Descuento (días)   | -1    | 0            |
    Entonces deberia rechazarse cada valor negativo y conservarse el producto sin cambios invalidos

  @prd-005
  Escenario: Rechazar porcentajes fuera del rango 0-100 y verificar coherencia minimo maximo
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y valido rangos de porcentajes y coherencia minimo maximo del producto
      | caso | campo                              | valor  | campo_secundario                    | valor_secundario | valor_valido | valor_secundario_valido | resultado |
      | 1    | Reaval máximo (%)                  | 150    |                                      |                  | 80           |                          | falla     |
      | 2    | Interés (%)                        | -1     |                                      |                  | 3.5          |                          | falla     |
      | 3    | Interés (%)                        | 101    |                                      |                  | 3.5          |                          | falla     |
      | 4    | Reaval mínimo (%)                  | 60     | Reaval máximo (%)                    | 40               | 10           | 80                       | falla     |
      | 5    | Importe mínimo (€)                 | 100000 | Importe máximo (€)                   | 50000            | 5000         | 500000                   | falla     |
      | 6    | Mínimo (meses)                     | 60     | Máximo (meses)                       | 24               | 12           | 120                      | falla     |
      | 7    | Porcentaje compartido mínimo (%)   | 50     | Porcentaje compartido máximo (%)     | 30               | 0            | 100                      | falla     |
      | 8    | Reaval mínimo (%)                  | 10     | Reaval máximo (%)                    | 80               | 10           | 80                       | guarda    |
    Entonces deberia rechazar los casos invalidos y guardar la correccion final del producto

  @prd-006
  Escenario: Validar que Fecha inicio de comercializacion no puede ser posterior a Fecha fin
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y intento guardar Fecha inicio de comercializacion posterior a Fecha fin
    Entonces deberia visualizar la validacion de coherencia entre Fecha inicio y Fecha fin

  @prd-007
  Escenario: Validar que Fecha alta de ficha no puede ser posterior a Fecha baja
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y intento guardar Fecha alta de ficha posterior a Fecha baja de ficha
    Entonces deberia visualizar la validacion de coherencia entre Fecha alta y Fecha baja de ficha

  @prd-008
  Escenario: Configurar receptor fijo como Entidad Financiera y verificar campo calculado
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y configuro receptor fijo como Entidad financiera
    Entonces deberia visualizar los campos calculados de receptor fijo como Entidad financiera

  @prd-009
  Escenario: Configurar receptor fijo como Contacto y verificar campo calculado
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y configuro receptor fijo como Contacto
    Entonces deberia visualizar los campos calculados de receptor fijo como Contacto

  @prd-011
  Escenario: Detectar solapamiento entre CNAE excluidos e incluidos
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y excluyo un CNAE y consulto el selector de CNAE incluidos
    Entonces deberia observar que el CNAE excluido no aparece disponible para incluir

  @prd-012
  Escenario: Detectar solapamiento en Tipologia de cliente Entidades Financieras y limites geograficos
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y excluyo valores y verifico que no esten disponibles para incluir
      | bloque                         | valor              |
      | Tipología de Cliente           | tipologia cliente  |
      | Entidades Financieras          | entidad financiera |
      | Límites Geográficos (Provincias) | provincia          |
    Entonces deberia observar que cada valor excluido desaparece del selector de incluidos

  @prd-013
  Escenario: Crear producto de comision y verificar codigo automatico y ausencia de impuestos
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos de comision
    Y creo un producto de comision
    Entonces deberia visualizar el codigo automatico de comision y los impuestos vacios

  @prd-013-n
  Escenario: Detectar solapamiento en Ciudades y Codigos Postales
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y excluyo valores y verifico que no esten disponibles para incluir
      | bloque                                  | valor         |
      | Límites Geográficos (Códigos Postales) | codigo postal |
      | Límites Geográficos (Ciudades)         | ciudad        |
    Entonces deberia observar que cada valor excluido desaparece del selector de incluidos

  @prd-014
  Escenario: Verificar los valores de seleccion del campo Control
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y verifico las opciones del campo Control y guardo sus valores soportados
    Entonces deberia quedar documentada la discrepancia funcional del campo Control

  @prd-015
  Escenario: Verificar checkboxes de Clientes objetivo tipo juridico autonomo emprendedores y tamano empresa
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y verifico checkboxes de Cliente objetivo y su persistencia
    Entonces deberia quedar restaurada la configuracion de Cliente objetivo

  @prd-016
  Escenario: Verificar campo Capital afecto con sus opciones de seleccion
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y verifico las opciones de Capital afecto y guardo cada valor
      | opcion                              |
      | No actúa                            |
      | Formalizado                         |
      | Riesgo real                         |
      | Vigente                             |
      | Principal pendiente + principal vencido |
    Entonces deberia guardar correctamente cada opcion de Capital afecto

  @lin-001
  Escenario: Anadir editar y eliminar lineas de comision en la pestana Conceptos
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y gestiono lineas de comision en la pestana Conceptos
    Entonces deberia autocompletarse el producto de comision y permitir editar y eliminar la linea

  @lin-002
  Escenario: Intentar anadir linea de comision duplicada
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y intento agregar una linea de comision duplicada
    Entonces deberia visualizar la validacion de linea de comision duplicada

  @lin-003
  Escenario: Verificar error al seleccionar concepto sin Producto de comision configurado
    Dado que inicio sesion en la aplicacion
    Cuando creo un concepto de comision sin producto de comision configurado
    Y intento usar el concepto de comision huerfano en un producto financiero
    Entonces deberia visualizar la validacion de concepto sin Producto de comision

  @lin-004
  Escenario: Rechazar valores negativos y porcentajes fuera de rango en lineas de comision
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y valido valores invalidos en lineas de comision
      | caso | campo             | valor | campo_secundario | valor_secundario |
      | 2    | Plazo mín. (meses) | -1    |                  |                  |
      | 3    | % mín.            | -5    |                  |                  |
      | 4    | % máx.            | 150   |                  |                  |
      | 5    | Imp. mín. (€)     | 5000  | Imp. máx. (€)    | 1000             |
      | 6    | % mín.            | 5.0   | % máx.           | 2.0              |
    Entonces deberia rechazarse cada valor invalido de la linea de comision

  @lin-005
  Escenario: Verificar coherencia entre rangos visibles de lineas de comision
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y valido valores invalidos en lineas de comision
      | caso | modo       | campo               | valor | campo_secundario   | valor_secundario |
      | 1    | Importe    | Imp. mín. (€)       | 10000 | Imp. máx. (€)      | 1000             |
      | 2    | Porcentual | % mín.              | 20    | % máx.             | 10               |
      | 3    | Porcentual | PD mín.             | 20    | PD máx.            | 5                |
      | 4    | Importe    | Plazo mín. (meses)  | 24    | Plazo máx. (meses) | 12               |
    Entonces deberia rechazarse cada valor invalido de la linea de comision

  @lin-006
  Escenario: Verificar que la periodicidad Trimestral y Semestral fijan la duracion automaticamente
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y verifico periodicidades que bloquean duracion en linea de comision
    Entonces deberia guardar la linea con duracion automatica bloqueada

  @lin-008
  Escenario: Verificar campo Financiado en lineas de comision
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y verifico persistencia del campo Financiado en una linea de comision
    Entonces deberia persistir el valor activado y desactivado de Financiado

  @mae-001
  Escenario: Verificar proteccion de conceptos de comision nucleo
    Dado que inicio sesion en la aplicacion
    Cuando verifico proteccion de conceptos de comision protegidos
      | concepto         | codigo |
      | Comisión aval    | aval   |
      | Comisión estudio |        |
      | Cuotas sociales  |        |
    Entonces deberia permitir editar solo Producto de comision en conceptos protegidos

  @mae-002
  Escenario: Crear editar y eliminar un concepto de comision no protegido
    Dado que inicio sesion en la aplicacion
    Cuando creo edito y elimino un concepto de comision no protegido
    Entonces deberia completarse el ciclo CRUD del concepto de comision no protegido

  @mae-003
  Escenario: Gestionar Tipologia de producto crear editar archivar y verificar unicidad del nombre
    Dado que inicio sesion en la aplicacion
    Cuando gestiono una tipologia de producto y verifico unicidad archivado y filtros
    Entonces deberia completarse el ciclo de tipologia de producto sin aparecer en filtros activos

  @mae-007
  Escenario: Gestionar Naturaleza T4 crear y editar registros maestros
    Dado que inicio sesion en la aplicacion
    Cuando gestiono un registro maestro de Naturaleza T4 y verifico selector de Grupo de producto
    Entonces deberia completarse el ciclo de Naturaleza T4 sin aparecer como activa en Grupo de producto

  @seg-001
  Escenario: Verificar que el rol Usuario solo tiene acceso de lectura en productos y maestros
    Dado que inicio sesion como usuario de productos solo lectura
    Cuando verifico permisos de solo lectura en productos y maestros
    Entonces deberia impedir creacion edicion y acceso a configuracion de productos

  @seg-002
  Escenario: Verificar que el rol Gestor tiene acceso completo y menu de configuracion visible
    Dado que inicio sesion como administrador
    Cuando verifico permisos completos del rol gestor de productos
    Entonces deberia permitir CRUD y visualizar configuracion para el rol gestor

  @ui-002
  Escenario: Verificar visibilidad condicional de pestanas y campos segun Rol de producto
    Dado que inicio sesion en la aplicacion
    Cuando verifico visibilidad condicional de pestanas y campos por rol de producto
    Entonces deberia visualizar la UI correspondiente a producto financiero y producto de comision

  @ui-003
  Escenario: Verificar visibilidad condicional de campos en pestana Conceptos
    Dado que inicio sesion en la aplicacion
    Cuando accedo al modulo Productos financieros
    Y creo un producto financiero completo
    Y verifico visibilidad condicional de campos en formulario de linea de Conceptos
    Entonces deberia alternar campos de importe porcentaje y duracion segun modo y periodicidad
