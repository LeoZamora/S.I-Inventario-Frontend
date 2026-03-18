import { useCallback, useEffect, useMemo, useState } from 'react';
import  { formateDate } from '../../helpers/helpers.tsx';
import
    {type  GridColDef }
from '@mui/x-data-grid'

import { Box, Tooltip, Chip, Fade } from '@mui/material';
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
import CustomToolbar from '../../reusable/ToolbarGrid';
import RequestGraph from '../../services/requestGraph';
import { queries } from '../../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'
import TipoProductoCreate from './tipoProducto_components/TipoProductoCreate';

type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };

const requestGraph = new RequestGraph

async function getTipoProductos() {
    try {
        const result = await requestGraph.queryGraph(queries.GET_TIPO_PRODUCTOS)

        return result
    } catch (error) {
        console.error("Hubo un fallo", error);
    }
}


export default function TiposProductos() {
    const [idTipoProducto, setIdTipoProd] = useState(null)
    const [openCreate, setOpenCreate] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const headersColumns: GridColDef[] = useMemo(() => [{
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
                            onClick={() => {
                                setIdTipoProd(params.row.idTipoProducto)
                                setOpenCreate(true)
                                setEdit(true)
                            }}
                        />
                    </GridActionsCell>
                )
            }
        }, {
            field: 'nombre',
            headerAlign: 'center',
            align: 'center',
            resizable: false,
            flex: 1,
            headerName: 'Nombre Tipo Producto',
        }, {
            field: 'descripcion',
            headerAlign: 'center',
            align: 'center',
            resizable: false,
            flex: 1,
            headerName: 'Descripción',
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
    ], [])

    const [loading, setLoading] = useState(false);
    const apiRef = useGridApiRef()

    const load = useCallback(async (alive: boolean) => {
        try {
            setLoading(true);
            const result = await getTipoProductos()
            setLoading(false);
            if (result.findTipoProducto) {
                const data = result.findTipoProducto
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
    }, [headersColumns])

    useEffect(() => {
        let alive = true

        load(alive)
        return () => {
            alive = false
        }
    }, [load])

    return (
        <Box sx={{
                height: '100%',
                width: '100%',
            }}
        >
            <GridChartsIntegrationContextProvider>
                <Fade in>
                    <Box sx={{
                            minHeight: 500,
                            width: '100%',
                        }}
                    >
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
                                    title: 'TIPO DE PRODUCTOS',
                                    addButton: (
                                        <Tooltip title="Nuevo Tipo de Producto">
                                            <ToolbarButton onClick={() => setOpenCreate(true)}>
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

                        <TipoProductoCreate open={openCreate} onClose={() => {
                            setOpenCreate(false)
                            setEdit(false)
                            load(true)
                        }} isEdit={isEdit}  idTipoProducto={idTipoProducto}/>
                    </Box>
                </Fade>
                <GridChartsRendererProxy id='main' renderer={ChartsRenderer}/>
            </GridChartsIntegrationContextProvider>
        </Box>
    );
}