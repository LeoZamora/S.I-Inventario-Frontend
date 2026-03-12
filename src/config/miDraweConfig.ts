import {
    CategoryRounded,
    InventoryRounded,
    PeopleOutlineRounded,
    Inventory2Rounded,
    WarehouseRounded,
    LabelOutlined
} from '@mui/icons-material'

export function inventarioModuleConfig() {
    return {
        subModuleInventario: [
            { icon: InventoryRounded, title: 'Inventarios',
                path: '/inventario/inventarios'
            },
            { icon: CategoryRounded, title: 'Categorias y SubCategorias',
                path: '/inventario/categorias'
            },
            { icon: LabelOutlined , title: 'Tipos de Productos',
                path: '/inventario/tipos-productos'
            },
            { icon: PeopleOutlineRounded, title: 'Proveedores',
                path: '/inventario/proveedores'
            },
            { icon: WarehouseRounded , title: 'Bodegas y Ubicaciones',
                path: '/inventario/bodegas-ubicaciones'
            },
        ],

        inventarios: [
            {
                icon: Inventory2Rounded,
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
