import { useCallback, useEffect, useMemo, useState } from 'react';
import  { formateDate } from '../../helpers/helpers.tsx';
import
    {type  GridColDef }
from '@mui/x-data-grid'
import {
    Box, Tooltip, Fade,
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
import { useInventarioContext } from '../../context/Inventario.context';
import { useNavigate } from 'react-router-dom';
import ViewOrden from './ordenes_conponents/ViewOrden';
import { RemoveRedEyeRounded } from '@mui/icons-material'


type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };

const requestGraph = new RequestGraph()

type OrdenesRow = {
    idOrden: number;
    codigoOrden: string;
    noReferencia: string | null;
    observaciones: string;
    idSolicitud: number;
    idTipoOrden: number;
    fechaEmision: string | Date;
    fechaRegistro: string | Date;
    usuarioRegistro: string;
    tipoOrden: {
        nombre: string
    }
    solicitudes: {
        codigoSolicitud: string
    }
    estadoOrden: {
        estados: {
            nombreEstado: string
        }
    }[]
}

export default function Ordenes() {
    const location = useLocation()
    const navigate = useNavigate()
    const apiRef = useGridApiRef()

    const isRootPath = location.pathname === '/ordenes'

    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [idOrden, setIdOrden] = useState<number | null>(0)
    const {setSelected} = useInventarioContext()

    const headersColumns: GridColDef[] = useMemo(() => [{
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
                const estados = [
                    {
                        estado: "GENERADA",
                        color: 'blue'
                    },
                    {
                        estado: "REVISADA",
                        color: 'orange'
                    },
                    {
                        estado: "AUTORIZADA",
                        color: 'green'
                    },
                    {
                        estado: "RECHAZADA",
                        color: 'red'
                    }
                ]

                const estadoActual = estados.find(item => item.estado === params.row.estado)

                const borderColor = `4px solid ${estadoActual?.color}`

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
                                    navigate(`${params.row.idOrden}`)
                                }}
                            />

                            <GridActionsCellItem
                                icon={<RemoveRedEyeRounded />}
                                label="Ver Detalles"
                                showInMenu
                                onClick={() => {
                                    setOpenDialog(true)
                                    setIdOrden(params.row.idOrden)
                                }}
                            />
                        </GridActionsCell>
                    </Box>
                )
            }
        }, {
            field: 'codigoOrden',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Código Orden',
        },
        {
            field: 'noReferencia',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'No. Referencia',
        }, {
            field: 'solicitudes',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Código Solicitud',
        }, {
            field: 'fechaEmision',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Fecha Emisión',
            renderCell: (params: GridCellParams) => {
                return (
                    <span>
                        { formateDate(String(params.value), true) }
                    </span>
                )
            }
        }, {
            field: 'fechaRegistro',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Fecha Registro',
            renderCell: (params: GridCellParams) => {
                return (
                    <span>
                        { formateDate(String(params.value), true) }
                    </span>
                )
            }
        }, {
            field: 'observaciones',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Observaciones',
        }, {
            field: 'usuarioRegistro',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Usuario Registro',
        }, {
            field: 'estado',
            headerAlign: 'center',
            flex: 1,
            headerClassName: 'classname--header',
            minWidth: 150,
            align: 'center',
            resizable: true,
            headerName: 'Estado',
        },
    ], [navigate])

    const getOrdenes = useCallback(async() => {
        setLoading(true)
        const result = await requestGraph.queryGraph(queries.GET_ORDENES)
        setLoading(false)

        const data = result?.findAllOrdenes.map((item: OrdenesRow) => {
            return {
                ...item,
                solicitudes: item.solicitudes.codigoSolicitud,
                noReferencia: item.noReferencia || 'N/A',
                estado: item.estadoOrden.reverse()[0].estados.nombreEstado
            }
        })

        const mappedRows: AnyRow[] = data.map((item: GridColDef, i: number) => {
            item.align = 'center'
            item.headerAlign = 'center'
            item.flex = 1
            item.resizable = true

            return {
                ...item,
                id: i
            }
        })

        setRows(mappedRows)
        setColumns(headersColumns)

    }, [headersColumns])

    const load = useCallback(async (alive: boolean) => {
        try {
            setLoading(true)
            getOrdenes()
            setLoading(false)
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false)
        } finally {
            if (alive) setLoading(false);
        }
    }, [getOrdenes])

    useEffect(() => {
        let alive = true


        setSelected({
            title: 'Ordenes',
            path: '/ordenes'
        })

        load(alive)
        return () => {
            alive = false
        }
    }, [rows.length, setSelected, load])

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
                        </Box>
                        <Box sx={{ height: 500 }}>
                            <DataGridPremium
                                apiRef={apiRef}
                                rows={rows}
                                columns={columns}
                                density="compact"
                                loading={loading}
                                autosizeOnMount
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                                }
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
                                        title: 'REGISTROS DE ORDENES',
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
                                    },
                                    '& .MuiDataGrid-row.even': {
                                        backgroundColor: '#ffffff',
                                    },
                                    '& .MuiDataGrid-row.odd': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                            />
                        </Box>
                        <GridChartsRendererProxy id='main' renderer={ChartsRenderer}/>
                        <ViewOrden open={openDialog} onClose={() => {
                            setOpenDialog(false)
                        }} id={idOrden} />
                    </GridChartsIntegrationContextProvider>
                    : <Box sx={{ width: '100%', height: '100%' }}>
                        <Outlet />
                    </Box> }
                </Box>
            </Fade>
        </Box>
    );
}