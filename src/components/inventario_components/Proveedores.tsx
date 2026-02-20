import { useEffect, useState } from 'react';
import  { formateDate } from '../../helpers/helpers';
import
    {type  GridColDef }
from '@mui/x-data-grid'

import {
    Paper, Tooltip, Chip
} from '@mui/material';
import {
    AddRounded, DeleteOutlined, EditNoteOutlined
} from '@mui/icons-material'
import {
    DataGridPremium, useGridApiRef,
    ToolbarButton,
    GridChartsIntegrationContextProvider,
    GridChartsRendererProxy, GridChartsPanel,
    GridActionsCellItem, GridActionsCell
} from '@mui/x-data-grid-premium'
import { type GridCellParams } from '@mui/x-data-grid-premium'
import CustomToolbar from '../ToolbarGrid';
import RequestGraph from '../../services/requestGraph';
import { queries } from '../../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'

type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };
const headersColumns: GridColDef[] = [{
        field: 'opc',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        disableExport: true,
        resizable: false,
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
                    />
                </GridActionsCell>
            )
        }
    }, {
        field: 'codigoProveedor',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        flex: 1,
        headerName: 'Código Proveedor',
    }, {
        field: 'nombreProveedor',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        flex: 1,
        headerName: 'Nombre Proveedor',
    }, {
        field: 'ruc',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        flex: 1,
        headerName: 'RUC',
    }, {
        field: 'telefono',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        flex: 1,
        headerName: 'Teléfono',
    }, {
        field: 'fechaRegistro',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
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
        resizable: false,
        flex: 1,
        headerName: 'Usuario Registro',
    }, {
        field: 'estado',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
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
]

const requestGraph = new RequestGraph

async function getProveedores() {
    try {
        return (await requestGraph.queryGraph(queries.GET_PROVIDERS))
    } catch (error) {
        console.error("Hubo un fallo", error);
    }
}


export default function Proveedores() {
    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);

    const [loading, setLoading] = useState(false);
    const apiRef = useGridApiRef()

    useEffect(() => {
        let alive = true

        const load = async () => {
            try {
                const result = await getProveedores()
                if (result.findAllProveedores) {
                    const data = result.findAllProveedores
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
            } finally {
                if (alive) setLoading(false);
            }
        }

        load()
        return () => {
            alive = false
        }
    }, [])

    useEffect(() => {
        if (!rows.length) return;

apiRef.current?.autosizeColumns({
                includeHeaders: true,
                includeOutliers: true,
                expand: true
            })

        
    }, [rows, apiRef])

    return (
        <div>
            <Paper elevation={0} sx={{
                    height: '100vh',
                    width: '100%',
                    display: "flex",
                    flexDirection: "column",
                }}
            >
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
                                title: 'PROVEEDORES',
                                addButton: (
                                    <Tooltip title="Nueva Categoria">
                                        <ToolbarButton>
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
            </Paper>
        </div>
    );
}