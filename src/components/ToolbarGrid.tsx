import React from 'react';

import {
    Typography, Tooltip, Badge, Divider,
    MenuItem, Menu, InputAdornment,
    styled, TextField,
    List, ListItem, ListItemIcon, ListSubheader,
    Box
} from '@mui/material';
import {
    FilterListRounded, ViewColumnRounded,
    FileDownloadRounded, Search,
    Cancel, BarChartRounded
} from '@mui/icons-material'
import {
    Toolbar, ColumnsPanelTrigger,
    ToolbarButton, FilterPanelTrigger,
    ExportCsv, ExportExcel, ExportPrint,
    QuickFilter, QuickFilterControl,
    QuickFilterTrigger, type GridToolbarProps,
    ChartsPanelTrigger,
} from '@mui/x-data-grid-premium'


// TYPES
type OwnerState = {
    expanded: boolean
}

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


declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        title: string;
        addButton?: React.ReactNode;
    }
}


export default function CustomToolbar(
    props: GridToolbarProps & { title?: string, addButton?: React.ReactNode }
) {
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
                { props.title }
            </Typography>

            {/* <Tooltip title="Nuevo Producto">
                <ToolbarButton>
                    <AddRounded />
                </ToolbarButton>
            </Tooltip> */}

            { props.addButton ? <Box>
                { props.addButton }
            </Box> : null}

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

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title='Estadisticas'>
                <ChartsPanelTrigger render={(props) => (
                    <ToolbarButton {...props} color='default'>
                        <BarChartRounded />
                    </ToolbarButton>
                )}>

                </ChartsPanelTrigger>
            </Tooltip>

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