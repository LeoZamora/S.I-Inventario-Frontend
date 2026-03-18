import { useCallback, useEffect, useMemo, useState } from 'react';
import  { formateDate } from '../../helpers/helpers.tsx';
import
    {type  GridColDef }
from '@mui/x-data-grid'

import {
    Box, Tooltip, Chip, Fade
} from '@mui/material';
import {
    AddRounded, DeleteOutlined, EditNoteOutlined,
    RemoveRedEyeOutlined
} from '@mui/icons-material'
import {
    DataGridPremium, useGridApiRef,
    ToolbarButton,
    GridChartsIntegrationContextProvider,
    GridChartsRendererProxy, GridChartsPanel,
    GridActionsCellItem, GridActionsCell
} from '@mui/x-data-grid-premium'
import { type GridCellParams } from '@mui/x-data-grid-premium'
import CustomToolbar from '../../reusable/ToolbarGrid';
import RequestGraph from '../../services/requestGraph';
import { queries } from '../../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'
import UbicacionCreate from './bodegas_components/UbicacionesCreate';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };

const requestGraph = new RequestGraph

export default function BodegasUbicaciones() {
    const navigate = useNavigate()
    const location = useLocation()
    const isRootPath = location.pathname === '/inventario/bodegas-ubicaciones'
    const [openCreate, setOpen] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const [idUbicacion, setIdUbicacion] = useState(null)
    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [loading, setLoading] = useState(false);
    const apiRef = useGridApiRef()

    const headersColumns: GridColDef[] = useMemo(() => [{
            field: 'opc',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            disableExport: true,
            flex: 1,
            headerName: '',
            headerClassName:'header-classname',
            renderCell: (params) => {
                return (
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
                                setOpen(true)
                                setEdit(true)
                                setIdUbicacion(params.row.idUbicacion)
                            }}
                        />
                        <GridActionsCellItem
                            icon={<RemoveRedEyeOutlined/>}
                            label="Ver detalles"
                            showInMenu
                            onClick={() => {
                                navigate(`${params.row.idUbicacion}`)
                            }}
                        />
                    </GridActionsCell>
                )
            }
        }, {
            field: 'codigoUbicacion',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            headerName: 'Código Ubicación',
        }, {
            field: 'nombreUbicacion',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            headerName: 'Nombre Ubicación',
        }, {
            field: 'direccion',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            headerName: 'Dirección',
        }, {
            field: 'fechaRegistro',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
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
            align: 'center',
            flex: 1,
            headerName: 'Usuario Registro',
        }, {
            field: 'estado',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            headerName: 'Estado',
            renderCell: (params: GridCellParams) => {
                return (
                    <Chip label={params.value === 1 ? 'Activo' : 'Inactivo'}
                        color={params.value === 1 ? 'success' : 'error'}
                        variant="outlined"
                    />
                )
            }
        },
    ], [navigate])

    async function getUbicaciones() {
        try {
            const result = await requestGraph.queryGraph(queries.GET_UBICACIONES)

            return result.findAllUbicaciones.map((item: GridColDef, i: number) => {
                item.align = 'center'
                item.headerAlign = 'center'
                item.resizable = true

                return {
                    ...item,
                    id: i,
                }
            })
        } catch (error) {
            console.error("Hubo un fallo", error);
        }
    }

    const load = useCallback(async (alive: boolean) => {
        try {
            setLoading(true);
            const result = await getUbicaciones()
            setLoading(false);

            if (result) {
                const data = result
                if (!alive) return

                setRows(data)
                setColumns(headersColumns)
            }
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            if (alive) setLoading(false);
        }
    }, [headersColumns])

    useEffect(() => {
        let alive = true

        load(alive)
        return () => {
            alive = false
        }
    }, [load])

    return (
        <div>
            <Box sx={{
                    height: '100%',
                    width: '100%',
                }}
            >
                {isRootPath ? <Fade in>
                    <Box sx={{ width: '100%', minHeight: 500 }}>
                        <GridChartsIntegrationContextProvider>
                            <DataGridPremium
                                apiRef={apiRef}
                                rows={rows}
                                density="compact"
                                rowSpacingType="border"
                                columns={columns}
                                loading={loading}
                                initialState={{ pagination: { paginationModel } }}
                                pageSizeOptions={[5, 10]}
                                lazyLoading
                                showToolbar
                                chartsIntegration
                                slots={{
                                    toolbar: CustomToolbar,
                                    chartsPanel: GridChartsPanel
                                }}
                                slotProps={{
                                    loadingOverlay: {
                                        variant: 'skeleton',
                                        noRowsVariant: 'skeleton',
                                    },
                                    toolbar: {
                                        title: 'BODEGAS Y UBICACIONES',
                                        addButton: (
                                            <Tooltip title="Nueva Bodega o Ubicación">
                                                <ToolbarButton onClick={() => {
                                                    setOpen(true)
                                                }}>
                                                    <AddRounded />
                                                </ToolbarButton>
                                            </Tooltip>
                                        )
                                    },
                                    chartsPanel: {
                                        schema: configurationOptions
                                    }
                                }}
                                experimentalFeatures={{
                                    charts: true
                                }}
                                sx={{
                                    borderRadius: 0,
                                    borderLeft: 0,
                                    borderRight: 0,
                                    flexGrow: 1,
                                    "&::-webkit-scrollbar": {
                                        width: "5px",
                                        display: 'none'
                                    },
                                }}
                            />
                            <GridChartsRendererProxy id='main' renderer={ChartsRenderer}/>
                        </GridChartsIntegrationContextProvider>
                        <UbicacionCreate
                            open={openCreate}
                            onClose={() => {
                                setOpen(false)
                                setEdit(false)
                                getUbicaciones()
                                load(true)
                            }}
                            isEdit={isEdit}
                            idUbicacion={idUbicacion}
                        />
                    </Box>
                </Fade> : <>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Outlet />
                    </Box>
                </>}
            </Box>

        </div>
    );
}