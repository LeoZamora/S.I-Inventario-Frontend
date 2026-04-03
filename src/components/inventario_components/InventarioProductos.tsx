import { useCallback, useEffect, useMemo, useState } from 'react';
import  { formateDate, formatCurrency } from '../../helpers/helpers.tsx';
import
    {type  GridColDef }
from '@mui/x-data-grid'
import {
    Box, Chip, Tooltip, Fade,
    Autocomplete, TextField,
    Grid
} from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
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
import { queries } from '../../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'
import RequestGraph from '../../services/requestGraph';
import CustomToolbar from '../../reusable/ToolbarGrid';
import type { ProductoGQL } from '../../helpers/interfaces';
// import { useInventarioContext } from '../../context/Inventario.context';
import { useAppDispatch, useAppSelector } from '../../appStore/hooks/hook';
import { useNavigate } from 'react-router-dom';
import { inventariosSlice } from '../../appStore/slices/slices';

type AnyRow = Record<string, unknown> & { id: string | number }

type InventarioCombobox = {
    idInventario: number
    nombreInventario: string
    codigoInventario: string
}

type ListOption = {
    id: number
    label: string
    description?: string
    codigo?: string
}


const paginationModel = { page: 0, pageSize: 5 };

const requestGraph = new RequestGraph()

export default function InventarioProductos() {
    const location = useLocation()
    const navigate = useNavigate()
    const apiRef = useGridApiRef()
    const dispatch = useAppDispatch()

    const isRootPath = location.pathname === '/inventario/productos'

    const headersColumns: GridColDef[] = useMemo(() => [{
            field: 'opc',
            headerAlign: 'center',
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
                                onClick={() => {
                                    navigate(`${params.row.idProducto}`)
                                }}
                            />
                        </GridActionsCell>
                    </Box>
                )
            }
        }, {
            field: 'codigoProducto',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Código Prod',
        },
        {
            field: 'subCategoria',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'SubCategoria',
        }, {
            field: 'categoria',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Categoria',
        }, {
            field: 'tipoProducto',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Tipo Producto',
        }, {
            field: 'nombreProducto',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Producto',
        }, {
            field: 'precio',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
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
            minWidth: 100,
            align: 'center',
            resizable: false,
            editable: true,
            headerName: 'Stock Actual',
        }, {
            field: 'stockMin',
            headerAlign: 'center',
            flex: 1,
            minWidth: 100,
            align: 'center',
            resizable: false,
            headerName: 'Stock Min',
        }, {
            field: 'stockMax',
            headerAlign: 'center',
            flex: 1,
            minWidth: 100,
            align: 'center',
            resizable: false,
            headerName: 'Stock Max',
        }, {
            field: 'fechaRegistro',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
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
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Usuario Registro',
        }, {
            field: 'estado',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
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
    ], [navigate])

    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [inventarios, setInventarios] = useState<ListOption[]>([])
    const [loading, setLoading] = useState(false);
    const [precioInventario, setPrecio] = useState<number>(0)
    // const {setSelected} = useInventarioContext()

    const idInventarioSelected = useAppSelector(state => state.inventario.idInventario)
    const selectedOption = inventarios.find(inv => inv.id === idInventarioSelected) || null;
    const { setInvetarioSelected } = inventariosSlice.actions

    const getProductos = useCallback(async (id: number) => {
        dispatch(setInvetarioSelected(id))
        let countPrecio: number = 0
        try {
            setLoading(true)
            const result = await requestGraph.queryGraph(
                queries.GET_PRODUCTS,
                { id: id }
            )
            setLoading(false)

            const data = result.findProductos.map((prod: ProductoGQL) => {
                countPrecio += Number(prod.precio)
                return {
                    ...prod,
                    categoria: prod.subCategoria?.categoria?.nombreCategoria,
                    subCategoria: prod.subCategoria.nombre,
                    tipoProducto: prod.tipoProducto.nombre,
                    stock: prod.inventarioProductos[0].stock || 0,
                    stockMin: prod.inventarioProductos[0].stockMin || 0,
                    stockMax: prod.inventarioProductos[0].stockMax || 0,
                }
            })

            setPrecio(countPrecio)

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
        } catch (error) {
            console.error("Hubo un fallo", error);
        }
    }, [dispatch, setInvetarioSelected, headersColumns])

    const load = useCallback(async (alive: boolean) => {
        if (idInventarioSelected) {
            getProductos(idInventarioSelected)
        }

        try {
            setLoading(true)
            const result2 = await requestGraph.queryGraph(
                queries.GET_INVENTARIO_COMBOBOX,
            )
            setLoading(false)

            if (!alive) return

            if (result2.findInventarios) {
                const foundInventarios = result2.findInventarios
                setInventarios(foundInventarios.map((item: InventarioCombobox) => {
                    return {
                        label: `${item.codigoInventario} - ${item.nombreInventario}`,
                        id: Number(item.idInventario),
                    }
                }))
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false)
        } finally {
            if (alive) setLoading(false);
        }
    }, [getProductos, idInventarioSelected])

    useEffect(() => {
        let alive = true


        // setSelected({
        //     title: 'Inventario de Productos',
        //     path: '/inventario/productos'
        // })

        load(alive)
        return () => {
            alive = false
        }

        // setSelected
    }, [rows.length, load])

    return (
        <Box style={{  width: '100%', height: '100%'}}>
            <Fade in>
                <Box sx={{
                        // minHeight: 500,
                        height: '100%',
                        width: '100%',
                    }}
                >
                    { isRootPath ? <GridChartsIntegrationContextProvider>
                        <Box
                            sx={{
                                p: 1,
                                width: '100%',
                                height: "100%",
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Box width="100%">
                                <Grid container size={{ xs: 6, lg: 6, md: 6 }} spacing={2}>
                                    <Grid size={{ xs: 9, lg: 8, sm: 9 }}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}
                                        >
                                            <Chip label={`V. Inventario:
                                                ${formatCurrency(Number(precioInventario), 'NIO')}`
                                            }
                                                variant='outlined'
                                                color='success'
                                                sx={{
                                                    fontWeight: "bold",
                                                    borderRadius: .5
                                                }}
                                            />
                                            <Chip label={`T. Producto: ${rows.length}`}
                                                variant='outlined'
                                                color='primary'
                                                sx={{
                                                    fontWeight: "bold",
                                                    borderRadius: .5
                                                }}
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, lg: 4, sm: 3 }}>
                                        <Autocomplete
                                            id="inventarios"
                                            fullWidth
                                            size="small"
                                            value={selectedOption}
                                            options={inventarios}
                                            onChange={(_, data) => {
                                                const id = data?.id

                                                getProductos(id ?? 0)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Inventarios"
                                                    placeholder="Elija un inventario"
                                                    slotProps={{
                                                        inputLabel: {
                                                            shrink: true
                                                        },
                                                    }}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 0.5
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Fade in>
                            <Box sx={{
                                height: 500
                            }}>
                                <DataGridPremium
                                    apiRef={apiRef}
                                    rows={rows}
                                    columns={columns}
                                    density="compact"
                                    // rowSpacingType="border"
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
                                            title: 'INVENTARIO DE PRODUCTOS',
                                            addButton: (
                                                <Tooltip title="Nueva Producto">
                                                    <ToolbarButton onClick={() => {
                                                        navigate('new')
                                                    }}>
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
                                        minHeight: "100%",
                                        "& .MuiDataGrid-main": {
                                            width: '100%'
                                        },
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
                            </Box>
                        </Fade>
                        <GridChartsRendererProxy id='main' renderer={ChartsRenderer}/>
                    </GridChartsIntegrationContextProvider>
                    : <Box sx={{ width: '100%', height: '100%' }}>
                        <Outlet />
                    </Box> }
                </Box>
            </Fade>
        </Box>
    );
}