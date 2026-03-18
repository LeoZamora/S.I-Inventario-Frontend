import { useCallback, useEffect, useMemo, useState } from 'react';
import RequestHttp from '../../services/requestHttp';
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
import { endPoints, queries } from '../../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'
import RequestGraph from '../../services/requestGraph';
import CustomToolbar from '../../reusable/ToolbarGrid';
import { useInventarioContext } from '../../context/Inventario.context';
import { useNavigate } from 'react-router-dom';

const requstHttp = new RequestHttp

type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };

const requestGraph = new RequestGraph()

type SolicitudRow = {
    idSolicitud: number;
    codigoSolicitud: string;
    solicitante: string;
    observaciones: string;
    motivo: string;
    fechaRegistro: string | Date;
    usuarioRegistro: string;
    estadoSolicitud: {
        estados: {
            nombreEstado: string
        }
    }[]
}

export default function InventarioProductos() {
    const location = useLocation()
    const navigate = useNavigate()
    const apiRef = useGridApiRef()

    const isRootPath = location.pathname === '/solicitudes'

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
                                    navigate(`${params.row.idSolicitud}`)
                                }}
                            />
                        </GridActionsCell>
                    </Box>
                )
            }
        }, {
            field: 'codigoSolicitud',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Código Solicitud',
        },
        {
            field: 'solicitante',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Solicitante',
        }, {
            field: 'observaciones',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Observaciones',
        }, {
            field: 'motivo',
            headerAlign: 'center',
            flex: 1,
            minWidth: 150,
            align: 'center',
            resizable: false,
            headerName: 'Motivo',
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
        },
    ], [navigate])

    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [loading, setLoading] = useState(false);
    const {setSelected} = useInventarioContext()

    const getSolicitudes = useCallback(async() => {
        setLoading(true)
        const result = await requestGraph.queryGraph(queries.GET_SOLICITUDES)
        setLoading(false)

        const data = result?.findSolicitudes.map((item: SolicitudRow) => {
            return {
                ...item,
                estado: item.estadoSolicitud.reverse()[0].estados.nombreEstado
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
        getSolicitudes()

        try {
            setLoading(true)
            const result = await requstHttp.getData(endPoints.getProductos)
            setLoading(false)

            if (result.data?.code === 200) {
                if (!alive) return
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false)
        } finally {
            if (alive) setLoading(false);
        }
    }, [getSolicitudes])

    useEffect(() => {
        let alive = true


        setSelected({
            title: 'Solicitudes',
            path: '/solicitudes'
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
                        <Fade in>
                            <DataGridPremium
                                apiRef={apiRef}
                                rows={rows}
                                columns={columns}
                                density="compact"
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
                                        title: 'SOLICITUDES',
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