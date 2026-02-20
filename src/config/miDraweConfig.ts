import {
    CategoryRounded,
    InventoryRounded,
    PeopleOutlineRounded,
    DevicesRounded,
    MilitaryTechRounded,
    ChairRounded,
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
                icon: DevicesRounded,
                title: 'Inventario de IT',
                path: '/inventario/informatica'
            },
            {
                icon: MilitaryTechRounded,
                title: 'Inventario de Armas',
                path: '/inventario/armas'
            },
            {
                icon: ChairRounded,
                title: 'Mobiliario',
                path: '/inventario/categorias'
            },
        ],

        miniDrawerInv: [
            '/inventario/inventarios',
            '/inventario/informatica',
            '/inventario/categorias',
            '/inventario/proveedores',
            '/inventario/armas',
            '/inventario/tipos-productos',
            '/inventario/bodegas-ubicaciones',
        ]
    }
}
