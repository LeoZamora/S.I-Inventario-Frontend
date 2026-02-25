import {
    Box, List, styled,
    Drawer, ListItem, Divider,
    ListItemButton, ListItemIcon,
    alpha, Tooltip, Toolbar
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useInventarioContext } from "../context/Inventario.context";
import type { SvgIconComponent } from "@mui/icons-material";

type MenuItem = {
    icon: SvgIconComponent,
    title: string,
    path: string,
}

type Props = {
    open: boolean,
    show: boolean,
    items: MenuItem[],
    inventory?: MenuItem[] | null
    onClose: () => void
}

const DrawerHeader = styled(Toolbar)(() => ({}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    margin: theme.spacing(0, 0),
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
        '& .MuiListItemText-primary': {
            fontWeight: 600,
        }
    }
}));

export default function MiniAppDrawer({ open, show, items, inventory, onClose }: Props) {
    const drawerWidth = 50;
    const [itemsState] = React.useState(items)
    const [inventoriesModule] = React.useState(inventory)
    const { selected, setSelected } = useInventarioContext()

    return (
        <Box sx={{
            display: show ? 'block' : 'none'
        }}>
            <Drawer
                variant="persistent"
                anchor="right"
                open={open}
                onClose={onClose}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        backgroundColor: 'transparent',
                        // backgroundColor: '#F5F5F5',
                        boxSizing: 'border-box',
                        display: open ? 'flex' : 'none',
                        border: 0
                    },
                    transition: (t) => t.transitions.create('width', {
                        duration: t.transitions.duration.shortest,
                    }),
                }}
            >
                <DrawerHeader variant="dense" />
                <List dense>
                    {itemsState.map((item, i) => (
                        <Link key={i}
                            to={item.path}
                            onClick={() => setSelected({ title: item.title, path: item.path })}
                        >
                            <Tooltip key={i} title={item.title} arrow placement="left"
                                >
                                <ListItem disablePadding dense>
                                    <StyledListItemButton selected={selected?.path === item.path}>
                                        <ListItemIcon sx={[{
                                                minWidth: 0,
                                                justifyContent: 'center',
                                                mr: 'auto'
                                            }]
                                        }>
                                            <item.icon></item.icon>
                                        </ListItemIcon>
                                    </StyledListItemButton>
                                </ListItem>
                            </Tooltip>
                            <Divider sx={{ mx: 1 }}/>
                        </Link>
                    ))}
                </List>

                <Box sx={{ flexGrow: 1 }} />

                <List dense>
                    {inventoriesModule?.map((item, i) => (
                        <Link key={i}
                            to={item.path}
                            onClick={() => setSelected({ title: item.title, path: item.path })}
                        >
                            <Tooltip key={i} title={item.title} arrow placement="left"
                                >
                                <ListItem disablePadding dense>
                                    <StyledListItemButton selected={selected?.path === item.path}>
                                        <ListItemIcon sx={[{
                                                minWidth: 0,
                                                justifyContent: 'center',
                                                mr: 'auto'
                                            }]
                                        }>
                                            <item.icon></item.icon>
                                        </ListItemIcon>
                                    </StyledListItemButton>
                                </ListItem>
                            </Tooltip>
                            <Divider sx={{ mx: 1 }}/>
                        </Link>
                    ))}
                </List>
            </Drawer>
        </Box>
    )
}