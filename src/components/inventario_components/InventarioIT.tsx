import { useEffect, useState } from 'react';
import RequestHttp from '../../services/requestHttp';
import  { formateDate, formatCurrency } from '../../helpers/helpers';
import
    {type  GridColDef }
from '@mui/x-data-grid'
import {
    Box, Chip, Tooltip, Container
} from '@mui/material';
import {
    DeleteOutlined, AddRounded, EditNoteOutlined
} from '@mui/icons-material'
import {
    DataGridPremium, useGridApiRef,
    GridChartsPanel, ToolbarButton,
    GridChartsIntegrationContextProvider,
    GridChartsRendererProxy,
    GridSidebarValue, GridActionsCellItem, GridActionsCell
} from '@mui/x-data-grid-premium'
import { type GridCellParams } from '@mui/x-data-grid-premium'
import { endPoints, queries } from '../../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'
import RequestGraph from '../../services/requestGraph';
import CustomToolbar from '../ToolbarGrid';
import type { ProductoGQL } from '../../helpers/interfaces';
import { useInventarioContext } from '../../context/Inventario.context';

const requstHttp = new RequestHttp

type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };
const headersColumns: GridColDef[] = [{
        field: 'opc',
        // headerAlign: 'center',
        align: 'center',
        sortable: false,
        disableExport: true,
        resizable: false,
        headerName: '',
        headerClassName: 'classname--header',
        cellClassName: 'classname--cell',
        renderCell: (params) => {
            const stockMin = Number(params.row.stockMin)
            const stock = Number(params.row.stock)

            const borderColor = stock > stockMin ? '4px solid green' :
                stock === stockMin ? '4px solid orange' : '4px solid red';

            return (
                <Box sx={{ borderLeft: borderColor }}>
                    <GridActionsCell {...params}>
                        <GridActionsCellItem
                            icon={<DeleteOutlined />}
                            label="Eliminar"
                            showInMenu
                        />
                        <GridActionsCellItem
                            icon={<EditNoteOutlined />}
                            label="Editar"
                            showInMenu
                        />
                    </GridActionsCell>
                </Box>
            )
        }
    }, {
        field: 'codigoProducto',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Código Prod',
    },
    // {
    //     field: 'inventario',
    //     headerAlign: 'center',
    //     flex: 1,
    //     align: 'center',
    //     resizable: false,
    //     headerName: 'Inventario',
    // },
    {
        field: 'subCategoria',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'SubCategoria',
    }, {
        field: 'categoria',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Categoria',
    }, {
        field: 'tipoProducto',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Tipo Producto',
    }, {
        field: 'nombreProducto',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Producto',
    }, {
        field: 'precio',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Precio',
        type: 'number',
        chartable: true,
        renderCell: (params: GridCellParams) => {
            return (
                <span>
                    { formatCurrency(Number(params.value), 'NIO') }
                </span>
            )
        }
    }, {
        field: 'stock',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        editable: true,
        headerName: 'Stock Actual',
    }, {
        field: 'stockMin',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Stock Min',
    }, {
        field: 'stockMax',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Stock Max',
    }, {
        field: 'fechaRegistro',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Fecha Registro',
        renderCell: (params: GridCellParams) => {
            return (
                <span>
                    { formateDate(String(params.value), true) }
                </span>
            )
        }
    }, {
        field: 'usuarioRegistro',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Usuario Registro',
    }, {
        field: 'estado',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        resizable: false,
        headerName: 'Estado',
        renderCell: (params: GridCellParams) => {
            return (
                <Chip label={params.value ? 'Activo' : 'Inactivo'}
                    color={params.value ? 'success' : 'error'}
                    variant="outlined"
                />
            )
        }
    },
]

const requestGraph = new RequestGraph()

async function getProductos() {
    try {
        const result = await requestGraph.queryGraph(
            queries.GET_PRODUCTS,
            { id: 1 }
        )

        return result.findProductos.map((prod: ProductoGQL) => {
            return {
                ...prod,
                categoria: prod.subCategoria.categoria.nombreCategoria,
                subCategoria: prod.subCategoria.nombre,
                tipoProducto: prod.tipoProducto.nombre,
                stock: prod.inventarioProductos[0].stock || 0,
                stockMin: prod.inventarioProductos[0].stockMin || 0,
                stockMax: prod.inventarioProductos[0].stockMax || 0,
            }
        })
    } catch (error) {
        console.error("Hubo un fallo", error);
    }
}

export default function InventarioIT() {
    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [loading, setLoading] = useState(false);
    const {setSelected} = useInventarioContext()
    const apiRef = useGridApiRef()

    const load = async (alive: boolean) => {
        try {
            setLoading(true)
            const result = await requstHttp.getData(endPoints.getProductos)
            const response =  await getProductos()
            setLoading(false)

            if (result.data?.code === 200) {
                const data = response
                if (!alive) return

                const mappedRows: AnyRow[] = data.map((item: GridColDef, i: number) => {
                    item.align = 'center'
                    item.headerAlign = 'center'
                    item.resizable = true

                    return {
                        ...item,
                        id: i
                    }
                })

                setRows(mappedRows)
                setColumns(headersColumns)
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false)
        } finally {
            if (alive) setLoading(false);
        }
    }

    useEffect(() => {
        let alive = true


        setSelected({
            title: 'Inventario IT',
            path: '/inventario/informatica'
        })

        load(alive)
        return () => {
            alive = false
        }
    }, [rows.length, setSelected])

    useEffect(() => {
        if (!rows.length) return;

        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
            expand: true
        })
    }, [rows, apiRef])

    return (
        <Container style={{  width: '100%', height: '100%'}} sx={{
            "&.MuiContainer-root": {
                p: 0,
                minWidth: "100%"
            }
        }}>
            <Box sx={{
                    height: '100vh',
                    width: '100%',
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <GridChartsIntegrationContextProvider>
                    <DataGridPremium
                        // apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        density="compact"
                        rowSpacingType="border"
                        loading={loading}
                        autosizeOnMount
                        initialState={{
                            pagination: { paginationModel },
                            sidebar: {
                                open: false,
                                value: GridSidebarValue.Charts
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        chartsIntegration
                        showToolbar
                        slots={{
                            toolbar: CustomToolbar,
                            chartsPanel: GridChartsPanel,
                        }}
                        experimentalFeatures={{
                            charts: true,
                        }}
                        slotProps={{
                            chartsPanel: {
                                schema: configurationOptions
                            },
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                            toolbar: {
                                title: 'INVENTARIO IT',
                                addButton: (
                                    <Tooltip title="Nueva Producto">
                                        <ToolbarButton>
                                            <AddRounded />
                                        </ToolbarButton>
                                    </Tooltip>
                                )
                            }
                        }}
                        sx={{
                            borderRadius: 0,
                            borderLeft: 0,
                            borderRight: 0,
                            flexGrow: 1,
                            width: '100%',
                            "& .MuiDataGrid-main": { width: '100%' },
                            "&::-webkit-scrollbar": {
                                width: "5px",
                                display: 'none'
                            },
                            '& .classname--header': {
                                p: 0,
                            },
                            '& .classname--cell': {
                                p: 0,
                            }
                        }}
                    />
                    <GridChartsRendererProxy id='main' renderer={ChartsRenderer}/>
                </GridChartsIntegrationContextProvider>
            </Box>
        </Container>
    );
}