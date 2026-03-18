
export function inventarioModuleConfig() {
    return {
        subModuleInventario: [
            { icon: "inventory", title: 'Inventarios',
                path: '/inventario/inventarios'
            },
            { icon: "category", title: 'Categorias y SubCategorias',
                path: '/inventario/categorias'
            },
            { icon: "tipoProducto" , title: 'Tipos de Productos',
                path: '/inventario/tipos-productos'
            },
            { icon: "proveedores", title: 'Proveedores',
                path: '/inventario/proveedores'
            },
            { icon: "logistica" , title: 'Bodegas y Ubicaciones',
                path: '/inventario/bodegas-ubicaciones'
            },
        ],

        inventarios: [
            {
                icon: "inventory",
                title: 'Inventario de Productos',
                path: '/inventario/productos'
            },
        ],

        miniDrawerInv: [
            '/inventario/inventarios',
            '/inventario/productos',
            '/inventario/categorias',
            '/inventario/proveedores',
            '/inventario/armas',
            '/inventario/tipos-productos',
            '/inventario/bodegas-ubicaciones',
        ]
    }
}

export function solicitudesModuleConfig() {
    return {
        subModulosSolicitud: [
            { icon: "tipoSolicitud", title: 'Tipos de Solicitudes',
                path: '/solicitudes/tipo-solicitud'
            },
        ],
    }
}
