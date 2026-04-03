export const endPoints = {
    // INVENTARIOS
    getProductos: 'inventario/productos',
    getCodigoInventario: 'inventario/codigo-recomendado',
    postInventario: 'inventario',

    // CATEGORIAS
    getCategorias: 'categoria',
    getSubCategoria: 'categoria/sub-categorias',
    postSubCategoria: 'categoria/sub-categoria',
    postCatgoria: 'categoria',
    postTipoProducto: 'productos/tipoProducto',
    getCodigoSubCategoria: 'categoria/sub-categoria/codigo',

    // LOGISTICA
    postUbicacion: 'logistica/ubicacion',
    postBodega: 'logistica/bodega',
    getCodigoUbicacion: 'logistica/ubicacion/codigo-recomendado',
    getCodigoBodega: 'logistica/bodega/codigo-recomendado',

    // PRODUCTOS
    getCodigoProducto: 'productos/codigo-recomendado',
    postProducto: 'productos',

    // EQUIPOS DE COMPUTO
    postTipoAlm: 'equipos-computo/tipoAlmacenamiento',
    postTipoConexion: 'equipos-computo/tipoConexion',
    postTipoDispositivo: 'equipos-computo/tipoDispositivo',
    postTipoImpresora: 'equipos-computo/tipoImpresora',

    getTipoAlm: 'equipos-computo/tipoAlmacenamiento',
    getTipoConexion: 'equipos-computo/tipoConexion',
    getTipoDispositivo: 'equipos-computo/tipoDispositivo',
    gteTipoImpresora: 'equipos-computo/tipoImpresora',

    //ARMAS
    postTipoCalibre: 'armas/tipoCalibre',
    postTipoArma: 'armas/tipoArma',
    posSistemaDisparo: 'armas/sistemaDisparo',

    getTipoCalibre: 'armas/tipoCalibre',
    getTipoArma: 'armas/tipoArma',
    getSistemaDisparo: 'armas/sistemaDisparo',

    // SOLICITUDES
    getCodigoSolicitud: 'solicitudes/codigo-recomendado',
    postSolicitud: 'solicitudes',
    postTipoSolicitud: 'solicitudes/tipo-solicitud',

    // ORDENES
    getCodigoOrden: 'ordenes/codigo-recomendado',
    postOrden: 'ordenes',
    postTipoOrden: 'ordenes/tipo-orden',

    // LOGIN
    postLogin: '/usuarios/login'
}

export const queries = {
    // PRODUCTOS
    GET_PRODUCTS: `
        query GetProductos($id: Int!) {
            findProductos(id: $id) {
                idProducto
                codigoProducto
                nombreProducto
                precio
                marca
                modelo
                precio
                estado
                subCategoria {
                    idSubCategoria
                    nombre
                    categoria {
                        nombreCategoria
                    }
                }
                inventarioProductos {
                    stockMin
                    stockMax
                    stock
                }
                tipoProducto {
                    nombre
                }
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
    GET_PRODUCTOS: `
        query {
            findAllProductos {
                idProducto
                codigoProducto
                nombreProducto
                precio
                marca
                modelo
                precio
                estado
                subCategoria {
                    idSubCategoria
                    nombre
                    categoria {
                        nombreCategoria
                    }
                }
                inventarioProductos {
                    stockMin
                    stockMax
                    stock
                }
                tipoProducto {
                    nombre
                }
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
    GET_PRODUCTO_BY_ID: `
        query GetProductoById($idProducto: Int!) {
            findProductoById(idProducto: $idProducto) {
                idTipoProducto
                idSubCategoria
                idProducto
                codigoProducto
                nombreProducto
                precio
                marca
                modelo
                imagen
                precio
                observaciones
                detallesEspecificos {
                    ... on EquiposComputo {
                        ramGB
                        cantidadAlm
                        procesador
                        idTipoDispositivo
                        idTipoAlmacenamiento
                    }
                    ... on ArmasFuego {
                        numSerie
                        capacidadCargador
                        longitudCanon
                        licencia
                        material
                        idCalibre
                        idTipoArma
                        idSistemaDisparo
                    }
                    ... on Mobiliario {
                        color
                        material
                    }
                }
                caracteristicasEspeciales
                subCategoria {
                    categoria {
                        idCategoria
                        codigoSubCategoria
                    }
                }
                inventarioProductos {
                    idInventario
                    idProductoInventario
                    estado
                    stockMin
                    stockMax
                    stock
                }
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
    GET_TIPO_PRODUCTOS: `
        query {
            findTipoProducto {
                idTipoProducto,
                nombre,
                descripcion,
                estado,
                fechaRegistro,
                usuarioRegistro
            }
        }
	`,
    GET_TIPO_PRODUCTOS_COMBOBOX: `
        query {
            findTipoProducto {
                idTipoProducto,
                nombre,
                descripcion,
            }
        }
	`,
    GET_TIPOPROD_BY_ID: `
        query GetTipoProd($idTipoProducto: Int!) {
            findTipoProductoById(idTipoProducto: $idTipoProducto) {
                idTipoProducto
                nombre
                descripcion
                fechaRegistro
                usuarioRegistro
                estado
            }
        }
    `,

    // PROVEEDORES
    GET_PROVIDERS: `
        query {
            findAllProveedores {
                idProveedor
                codigoProveedor
                nombreProveedor
                nombreComercial
                ruc
                direccion
                telefono
                correo
                estado
                observaciones
                fechaRegistro
                usuarioRegistro
            }
        }
    `,

    // DEPARTAMENTOS
    GET_DEPARTAMENTOS: `
        query {
            findDepartamentos {
                idDepartamento
                codigoDepartamento
                nombreDepartamento
                descripcion
                estado
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
    GET_DEPARTAMENTOS_COMBOBOX: `
        query {
            findDepartamentos {
                idDepartamento
                codigoDepartamento
                nombreDepartamento
            }
        }
    `,
    GET_DEPARTAMENTO_BY_ID: `
        query GetUbicacion($idDepartamento: Int!) {
            findDepartamentoById(idDepartamento: $idDepartamento) {
                idDepartamento
                codigoDepartamento
                nombreDepartamento
                descripcion
                estado
                fechaRegistro
                usuarioRegistro
            }
        }
    `,


    // UBICACIONES Y BODEGAS
    GET_UBICACIONES: `
        query {
            findAllUbicaciones {
                idUbicacion
                codigoUbicacion
                nombreUbicacion
                direccion
                estado
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
    GET_UBICACIONES_COMBOBOX: `
        query {
            findAllUbicaciones {
                idUbicacion
                codigoUbicacion
                nombreUbicacion
                direccion
            }
        }
    `,
    GET_UBICACION_BY_ID: `
        query GetUbicacion($idUbicacion: Int!) {
            findUbicacionById(idUbicacion: $idUbicacion) {
                idUbicacion
                nombreUbicacion
                codigoUbicacion
                direccion
                estado
                usuarioRegistro
                fechaRegistro
                bodegas {
                    idBodega
                    nombreBodega
                    codigoBodega
                    estado
                    descripcion
                    fechaRegistro
                    usuarioRegistro
                }
            }
        }
    `,
    GET_BODEGA_BY_ID: `
        query GetUbicacion($idBodega: Int!) {
            findBodegaById(idBodega: $idBodega) {
                idBodega
                idUbicacion
                nombreBodega
                codigoBodega
                descripcion
                estado
                usuarioRegistro
                fechaRegistro
            }
        }
    `,
    GET_BODEGAS: `
        query {
            findAllBodegas {
                idBodega
                codigoBodega
                nombreBodega
                descripcion
                fechaRegistro
                usuarioRegistro
                idUbicacion
                ubicacion {
                    nombreUbicacion
                }
            }
        }
    `,
    GET_BODEGAS_COMBOBOX: `
        query GetBodegas($idUbicacion: Int!) {
            findAllBodegasCombobox(idUbicacion: $idUbicacion) {
                idBodega
                codigoBodega
                nombreBodega
                descripcion
            }
        }
    `,

    // INVENTARIOS
    GET_INVENTARIO: `
        query {
            findInventarios {
                idInventario
                codigoInventario
                pathRoute
                nombreInventario
                estado
                observaciones
                usuarioRegistro
                fechaRegistro
                bodegas {
                    codigoBodega
                    nombreBodega
                }
            }
        }
    `,
     // INVENTARIOS
    GET_INVENTARIO_COMBOBOX: `
        query {
            findInventarios {
                idInventario
                codigoInventario
                nombreInventario
            }
        }
    `,
    GET_INVENTAIRO_BY_ID: `
        query GetInventario($idInventario: Int!) {
            findInventarioById(idInventario: $idInventario) {
                idInventario
                codigoInventario
                nombreInventario
                estado
                pathRoute
                observaciones
                fechaRegistro
                idBodega
                idDepartamento
                usuarioRegistro
                estadoInventarios {
                    idEstadoInventario
                    idEstado
                    idInventario
                    observaciones
                    usuarioRegistro
                    fechaAsignacion
                }
                bodegas{
                    idBodega
                    codigoBodega
                    nombreBodega
                    descripcion
                    estado
                    ubicacion {
                        idUbicacion
                        nombreUbicacion
                    }
                }
                inventarioProductos {
                    idProductoInventario
                    stockMin
                    stockMax
                    stock
                    estado
                    fechaRegistro
                    usuarioRegistro
                    producto {
                        idProducto
                        codigoProducto
                        nombreProducto
                        precio
                    }
                }
            }
        }
    `,

    // CATEGORIAS Y SUBCATEGORIAS
    GET_CATEGORIA_BY_ID: `
        query GetCategory($idCategoria: Int!) {
            finCategoryById(idCategoria: $idCategoria) {
                idCategoria
                nombreCategoria
                descripcion
                fechaRegistro
                usuarioRegistro
                codigoSubCategoria
                subCategorias {
                    idSubCategoria
                    nombre
                    estado
                    codigoProducto
                    codigoSubCategoria
                    fechaRegistro
                    usuarioRegistro
                    descripcion
                }
            }
        }
    `,
    GET_CATEGORIAS: `
        query {
            findAllCategories {
            idCategoria
            nombreCategoria
            descripcion
            estado
            fechaRegistro
            usuarioRegistro
            codigoSubCategoria
            subCategorias {
                idSubCategoria
                nombre
                codigoProducto
                codigoSubCategoria
            }
        }
	}`,
    GET_SUBCATEGORIA_BY_ID: `
        query GetSubCategory($idSubCategoria: Int!) {
            finSubCategoryById(idSubCategoria: $idSubCategoria) {
                idSubCategoria
                codigoSubCategoria
                codigoProducto
                idCategoria
                nombre
                descripcion
                estado
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
    GET_CATEGORIA_COMBOBOX: `
        query {
            findAllCategories {
                codigoSubCategoria
                idCategoria
                nombreCategoria
                descripcion
            }
        }
    `,
    GET_SUBCATEGORIA_COMBOBOX: `
        query GetSubCategoryByCategory($idCategoria: Int!) {
            finSubCategoryByCategory(idCategoria: $idCategoria) {
                codigoSubCategoria
                idSubCategoria
                nombre
                descripcion
            }
        }
    `,

    // SOLICITUDES
    GET_SOLICITUDES: `
        query {
            findSolicitudes {
                idSolicitud
                codigoSolicitud
                solicitante
                observaciones
                motivo
                fechaRegistro
                usuarioRegistro
                idBodegaSolicitada
                idBodegaSolicitante
                idTipoSolicitud
                estadoSolicitud {
                    estados {
                        nombreEstado
                    }
                }
            }
        }
    `,
    GET_SOLICITUDES_COMBOBOX: `
        query GetSolicitudesByEstado($idEstado: Int!) {
            findSolicitudByState(idEstado: $idEstado) {
                idSolicitud
                codigoSolicitud
                solicitante
                estadoSolicitud {
                    estados {
                        nombreEstado
                    }
                }
                orden {
                    idOrden
                    codigoOrden
                }
            }
        }
    `,
    GET_SOLICITUDES_BY_ID: `
        query GetSolicitudById($idSolicitud: Int!) {
            findSolicitudById(idSolicitud: $idSolicitud) {
                idSolicitud
                codigoSolicitud
                solicitante
                observaciones
                motivo
                fechaRegistro
                usuarioRegistro
                idBodegaSolicitada
                idBodegaSolicitante
                idTipoSolicitud
                estadoSolicitud {
                    estados {
                        nombreEstado
                    }
                }
                bodegaSolicitante {
                    idBodega
                    codigoBodega
                    nombreBodega
                    descripcion
                    ubicacion {
                        idUbicacion
                        codigoUbicacion
                        nombreUbicacion
                    }
                }
                bodegaSolicitada {
                    idBodega
                    codigoBodega
                    nombreBodega
                    descripcion
                    ubicacion {
                        idUbicacion
                        codigoUbicacion
                        nombreUbicacion
                    }
                }
                detalleSolicitud {
                    idDetalleSolicitud
                    observaciones
                    cantidad
                    precioUnitario
                    idSolicitud
                    idProducto
                    producto {
                        codigoProducto
                        nombreProducto
                    }
                }
            }
        }
    `,
    GET_TIPO_SOLICITUD_COMBOBOX: `
        query {
            findTipoSolicitud {
                idTipoSolicitud
                nombre
                descripcion
                estado
                fechaRegistro
            }
        }
    `,
    GET_TIPOSOLICITUD_BY_ID: `
        query GetTipoSol($idTipoSolicitud: Int!) {
            findTipoSolicitudById(idTipoSolicitud: $idTipoSolicitud) {
                idTipoSolicitud
                nombre
                descripcion
                fechaRegistro
            }
        }
    `,


    // ORDENES
    GET_ORDENES: `
        query {
            findAllOrdenes {
                idOrden
                codigoOrden
                noReferencia
                observaciones
                idSolicitud
                idTipoOrden
                fechaEmision
                usuarioRegistro
                fechaRegistro
                tipoOrden {
                    idTipoOrden
                    nombre
                }
                solicitudes {
                    codigoSolicitud
                }
                estadoOrden {
                    estados {
                        idEstado
                        codigoEstado
                        nombreEstado
                    }
                }
            }
        }
    `,
    GET_ORDEN_BY_ID: `
        query GetOrdenById($idOrden: Int!) {
            findOrdenById(idOrden: $idOrden) {
                idOrden
                codigoOrden
                noReferencia
                observaciones
                idSolicitud
                idTipoOrden
                fechaEmision
                usuarioRegistro
                fechaRegistro
                tipoOrden {
                    idTipoOrden
                    nombre
                }
                detalleOrdens {
                    idDetalleOrden
                    observaciones
                    cantidad
                    precioUnitario
                    idOrden
                    idProducto
                    producto {
                        codigoProducto
                        nombreProducto
                    }
                }
                estadoOrden {
                    estados {
                        idEstado
                        codigoEstado
                        nombreEstado
                    }
                }
                solicitudes {
                    codigoSolicitud
                    solicitante
                    estadoSolicitud {
                        estados {
                            nombreEstado
                        }
                    }
                }
            }
        }
    `,
    GET_TIPO_ORDEN_COMBOBOX: `
        query {
            findAllTipoOrdenes {
                idTipoOrden
                nombre
                estado
                descripcion
                fechaRegistro
                usuarioRegistro
            }
        }
    `,
}