export const endPoints = {
    // Inventario
    getProductos: 'inventario/productos',
    getCategorias: 'categoria',
    getSubCategoria: 'categoria/sub-categorias',
    postCatgoria: 'categoria'
}

export const queries = {
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
    GET_TIPOPRODUCTOS: `
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
    GET_UBICACIONES: `
        query {
            findAllUbicaciones {
                idUbicacion
                codigoUbicacion
                nombreUbicacion
                direccion
                fechaRegistro
                usuarioRegistro
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
            }
        }
    `
}