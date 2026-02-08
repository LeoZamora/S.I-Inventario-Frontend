import React, { useEffect, useState } from 'react';
import RequestHttp from '../services/requestHttp';
import  { formateDate, formatCurrency } from '../helpers/helpers';
import
    {type  GridColDef, type GridRenderCellParams }
from '@mui/x-data-grid'
import {
    Paper, Typography,
    Tooltip, Badge, Divider,
    MenuItem, Menu, InputAdornment,
    styled, TextField, Chip,IconButton,
    List, ListItem, ListItemIcon, ListSubheader,
    Box
} from '@mui/material';
import {
    FilterListRounded, ViewColumnRounded,
    FileDownloadRounded, Search, BarChartOutlined,
    Cancel, AddRounded, MoreVertRounded
} from '@mui/icons-material'
import {
    DataGridPremium, useGridApiRef,
    Toolbar, ColumnsPanelTrigger,
    ToolbarButton, FilterPanelTrigger,
    ExportCsv, ExportExcel, ExportPrint,
    QuickFilter, QuickFilterControl,
    QuickFilterTrigger, GridChartsPanel,
    GridChartsIntegrationContextProvider,
    GridChartsRendererProxy, ChartsPanelTrigger,
    GridSidebarValue
} from '@mui/x-data-grid-premium'
import { type GridCellParams } from '@mui/x-data-grid-premium'
import { endPoints } from '../services/endPoints';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium'

const requstHttp = new RequestHttp

// TYPES
type OwnerState = {
    expanded: boolean
}
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
        headerClassName: 'classname--header',
        cellClassName: 'classname--cell',
        renderCell: (params: GridRenderCellParams) => {
            const stockMin = Number(params.row.stockMin)
            const stock = Number(params.row.stock)

            const borderColor = stock > stockMin ? '4px solid green' :
                stock === stockMin ? '4px solid orange' : '4px solid red'

            return (
                <Box sx={{
                    borderLeft:  borderColor
                }}>
                    <IconButton sx={{
                        height: '100%',
                    }}>
                        <MoreVertRounded />
                    </IconButton>
                </Box>
            )
        }
    }, {
        field: 'codigoProducto',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Codigo Prod',
    }, {
        field: 'inventario',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Inventario',
    }, {
        field: 'subCategoria',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'SubCategoria',
    }, {
        field: 'categoria',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Categoria',
    }, {
        field: 'tipoProducto',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Tipo Producto',
    }, {
        field: 'nombreProducto',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Producto',
    }, {
        field: 'precio',
        headerAlign: 'center',
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
        align: 'center',
        resizable: false,
        editable: true,
        headerName: 'Stock Actual',
    }, {
        field: 'stockMin',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Stock Min',
    }, {
        field: 'stockMax',
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        headerName: 'Stock Max',
    }, {
        field: 'fechaRegistro',
        headerAlign: 'center',
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
        align: 'center',
        resizable: false,
        headerName: 'Usuario Registro',
    }, {
        field: 'estado',
        headerAlign: 'center',
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


// COMPONENTS FOR TOOLBAR DATAGRID
const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center'
})

const StyledToolbarButton = styled(ToolbarButton)<{ownerState: OwnerState}>(
    ({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        width: 'min-content',
        height: 'min-content',
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? 'none' : 'auto',
        transition: theme.transitions.create(['opacity']),
    })
)

const StyledTextField = styled(TextField)<{
    ownerState: OwnerState
}>(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflow: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
}))

function CustomToolbar() {
    const [exportMenuOpen, setExportMenuOpen] = React.useState(false)
    const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null)
    const [exportAnchorEl, setExportAchorEl] = React.useState<null | HTMLElement>(null)

    const openMenu = () => {
        setExportAchorEl(exportMenuTriggerRef.current);
        setExportMenuOpen(true)
    }

    const closeMenu = () => {
        setExportAchorEl(null);
        setExportMenuOpen(false)
    }

    return (
        <Toolbar>
            <Typography fontWeight="bold" sx={{ flex: 1, mx: 0.5, }}>
                INVENTARIO DE PRODUCTOS
            </Typography>

            <Tooltip title="Nuevo Producto">
                <ToolbarButton>
                    <AddRounded />
                </ToolbarButton>
            </Tooltip>

            <Tooltip title="Columnas">
                <ColumnsPanelTrigger render={<ToolbarButton />}>
                    <ViewColumnRounded />
                </ColumnsPanelTrigger>
            </Tooltip>

            <Tooltip title='Filtros'>
                <FilterPanelTrigger render={(props, state) => (
                    <ToolbarButton {...props} color='default'>
                        <Badge badgeContent={state.filterCount} color='info'
                            variant='dot'>
                                <FilterListRounded />
                        </Badge>
                    </ToolbarButton>
                )} />
            </Tooltip>

            <Tooltip title='Estadisticas'>
                <ChartsPanelTrigger render={(props) => (
                    <ToolbarButton {...props} color='default'>
                        <BarChartOutlined />
                    </ToolbarButton>
                )}>

                </ChartsPanelTrigger>
            </Tooltip>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title="Exportar">
                <ToolbarButton
                    ref={exportMenuTriggerRef}
                    id='export-menu-trigger'
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    aria-expanded={ exportMenuOpen ? 'true' : undefined }
                    onClick={openMenu}
                >
                    <FileDownloadRounded />
                </ToolbarButton>
            </Tooltip>

            <Menu
                id='export-menu'
                anchorEl={exportAnchorEl}
                open={exportMenuOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    list: {
                        'aria-labelledby': 'export-menu-trigger'
                    }
                }}
            >
                <List dense subheader={
                    <ListSubheader>
                        Opciones de descarga
                    </ListSubheader>
                }>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <ExportPrint render={<MenuItem/>}
                            onClick={() => setExportMenuOpen(false)}
                        >
                            Imprimir
                        </ExportPrint>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <ExportCsv render={<MenuItem />}
                            onClick={() => setExportMenuOpen(false)}
                        >
                            Exportar CSV
                        </ExportCsv>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <ExportExcel render={<MenuItem />}
                            onClick={() => setExportMenuOpen(false)}
                        >
                            Exportar Excel
                        </ExportExcel>
                    </ListItem>
                </List>
            </Menu>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <StyledQuickFilter>
                <QuickFilterTrigger
                    render={(triggerProps, state) => (
                        <Tooltip title="Buscar" enterDelay={0}>
                            <StyledToolbarButton
                                {...triggerProps}
                                ownerState={{ expanded: state.expanded }}
                                color='default'
                                aria-disabled={ state.expanded }
                            >
                                <Search fontSize='small'/>
                            </StyledToolbarButton>
                        </Tooltip>
                    )}
                />

                <QuickFilterControl
                    render={({ref, ...controlProps}, state) => (
                        <StyledTextField
                            {...controlProps}
                            ownerState={{ expanded: state.expanded }}
                            inputRef={ref}
                            aria-label="Buscar"
                            placeholder="Buscar..."
                            size='small'
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Search fontSize='small'/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: state.value ? (
                                        <InputAdornment position='end'>
                                            <Cancel fontSize='small'/>
                                        </InputAdornment>
                                    ) : null,
                                    ...controlProps.slotProps?.input,
                                },
                                ...controlProps.slotProps,
                            }}
                        >
                        </StyledTextField>
                    )}
                />
            </StyledQuickFilter>
        </Toolbar>
    )
}

export default function DataTable() {
    const [rows, setRows] = useState<AnyRow[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [loading, setLoading] = useState(false);
    const apiRef = useGridApiRef()

    // function buildColumns(data: Record<string, unknown>[]): GridColDef[] {
    //     if (!data.length) return []

    //     return Object.keys(data[0]).map((key) => ({
    //         field: key,
    //         headerName: key
    //             .replace(/([A-Z])/g, " $1")
    //             .replace(/^./, (str) => str.toUpperCase()),
    //         flex: 1
    //     }))
    // }

    useEffect(() => {
        let alive = true

        const load = async () => {
            try {
                setLoading(true)
                const result = await requstHttp.getData(endPoints.getProductos)
                setLoading(false)
                if (result.data?.code === 200) {
                    const data = result.data?.data
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

        const t = setTimeout(() => {
            apiRef.current?.autosizeColumns({
                includeHeaders: true,
                includeOutliers: true,
                expand: true
            })
        }, 0)

        return () => clearTimeout(t)
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
                        columns={columns}
                        density="compact"
                        label="INVENTARIO DE PRODUCTOS"
                        rowSpacingType="border"
                        loading={loading}
                        initialState={{ 
                            pagination: { paginationModel },
                            sidebar: {
                                open: false,
                                value: GridSidebarValue.Charts
                            },
                            // chartsIntegration: {
                            //     charts: {
                            //         main: {
                            //             dimensions: ['nombreProducto'],
                            //             values: ['precio'],
                            //             chartType: "column"
                            //         }
                            //     }
                            // }
                        }}
                        pageSizeOptions={[5, 10]}
                        // lazyLoading
                        chartsIntegration
                        showToolbar
                        slots={{
                            toolbar: CustomToolbar,
                            chartsPanel: GridChartsPanel
                        }}
                        experimentalFeatures={{
                            charts: true,
                        }}
                        slotProps={{
                            chartsPanel: {
                                schema: configurationOptions
                            }
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
            </Paper>
        </div>
    );
}