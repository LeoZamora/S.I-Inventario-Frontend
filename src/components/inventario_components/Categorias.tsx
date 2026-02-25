import { useEffect, useState } from 'react';
import  { formateDate } from '../../helpers/helpers';
import
    {
type  GridColDef }
from '@mui/x-data-grid'

import {
    Tooltip,
    Chip, Box, Container,
    Fade
} from '@mui/material';
import {
    AddRounded, DeleteOutlined, EditNoteOutlined,
    RemoveRedEyeOutlined
} from '@mui/icons-material'
import {
    DataGridPremium,
    ToolbarButton, GridActionsCellItem,
    GridActionsCell
} from '@mui/x-data-grid-premium'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { type GridCellParams } from '@mui/x-data-grid-premium'
import { queries } from '../../services/endPoints';
import CustomToolbar from '../ToolbarGrid';
import CategoriaCreate from './categorias_components/CategoriaCreate';
import RequestGraph from '../../services/requestGraph';

const requestGraph = new RequestGraph

type AnyRow = Record<string, unknown> & { id: string | number }

const paginationModel = { page: 0, pageSize: 5 };

async function getCategorias() {
    try {
        const result = await requestGraph.queryGraph(
            queries.GET_CATEGORIAS,
        )

        return result.findAllCategories

    } catch (error) {
        console.error("Hubo un fallo", error);
    }
}

export default function Categorias() {
    const [idCategoria, setIdCategoria] = useState(null)
    const [isEdit, setEdit] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const isRootPath = location.pathname === '/inventario/categorias'
    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = async (alive: boolean) => {
        try {
            setLoading(true);
            const result = await getCategorias()
            setLoading(false);

            // if (result.data?.code === 200) {
                const data = result
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

                setRows(mappedRows.reverse())
                setColumns(headersColumns)
            // }
        } catch (error) {
            console.error("Error cargando categorias:", error);
        } finally {
            if (alive) setLoading(false);
        }
    }

    useEffect(() => {
        let alive = true

        load(alive)
        return () => {
            alive = false
        }
    }, [])

    // useEffect(() => {
    //     if (!rows.length) return;
    //     apiRef.current?.autosizeColumns({
    //         includeHeaders: true,
    //         includeOutliers: true,
    //         expand: true,
    //     })
    // }, [rows, apiRef, setLoading])

    const headersColumns: GridColDef[] = [{
        field: 'opc',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        disableExport: true,
        resizable: true,
        flex: 0.5,
        headerName: '',
        headerClassName:'header-classname',
        renderCell: (params) => (
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
                        setEdit(true)
                        setIdCategoria(params.row.idCategoria)
                        setOpenCreate(true)
                    }}
                />
                <GridActionsCellItem
                    icon={<RemoveRedEyeOutlined/>}
                    label="Ver detalles"
                    showInMenu
                    onClick={() => {
                        navigate(`${params.row.idCategoria}`)
                    }}
                />
            </GridActionsCell>
        ),
    }, {
        field: 'nombreCategoria',
        headerAlign: 'center',
        align: 'center',
        resizable: true,
        flex: 1,
        headerName: 'Nombre Categoria',
    }, {
        field: 'codigoSubCategoria',
        headerAlign: 'center',
        align: 'center',
        resizable: true,
        flex: 1,
        headerName: 'Código para SubCat',
    }, {
        field: 'fechaRegistro',
        headerAlign: 'center',
        align: 'center',
        resizable: true,
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
        resizable: true,
        flex: 1,
        headerName: 'Usuario Registro',
    }, {
        field: 'estado',
        headerAlign: 'center',
        align: 'center',
        resizable: true,
        flex: 1,
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

    return (
        <>
            <Box sx={{ width: '100%', height: '100vh' }}>
                <Fade in>
                    <Container style={{  width: '100%', height: '100%'}} sx={{
                        "&.MuiContainer-root": {
                            p: 0,
                            minWidth: "100%"
                        }
                    }}>
                        { isRootPath ? <>
                            <Fade in>
                                <Box sx={{
                                        height: 520,
                                        width: '100%',
                                    }}
                                >
                                    <DataGridPremium
                                        rows={rows}
                                        density="compact"
                                        rowSpacingType="border"
                                        columns={columns}
                                        loading={loading}
                                        initialState={{pagination: { paginationModel } }}
                                        pageSizeOptions={[5, 10]}
                                        showToolbar
                                        slots={{
                                            toolbar: CustomToolbar,
                                        }}
                                        slotProps={{
                                            loadingOverlay: {
                                                variant: 'skeleton',
                                                noRowsVariant: 'skeleton',
                                            },
                                            toolbar: {
                                                title: 'CATEGORIAS Y SUBCATEGORIAS',
                                                addButton: (
                                                    <Tooltip title="Nueva Categoria">
                                                        <ToolbarButton onClick={() => {
                                                            setOpenCreate(true)
                                                            setEdit(false)
                                                        }}>
                                                            <AddRounded/>
                                                        </ToolbarButton>
                                                    </Tooltip>
                                                )
                                            },
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
                                        }}
                                    />
                                </Box>
                            </Fade>
                            <CategoriaCreate open={openCreate} onClose={() => {
                                setOpenCreate(false);
                                setEdit(false)
                                load(true)
                            }} idCategoria={idCategoria} isEdit={isEdit} />
                        </> : <>
                            <Fade in>
                                <Box sx={{ width: '100%', height: '100%' }}>
                                    <Outlet />
                                </Box>
                            </Fade>
                        </>}
                    </Container>
                </Fade>
            </Box>

        </>
    );
}