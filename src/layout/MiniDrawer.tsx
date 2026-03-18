import {
    Box, List, styled,
    Drawer, ListItem, Divider,
    ListItemButton, ListItemIcon,
    alpha, Tooltip, Toolbar
} from "@mui/material";
// import { useState } from "react";
import { Link } from "react-router-dom";
import { useInventarioContext } from "../context/Inventario.context";
import { type MenuItem } from '../helpers/types'
import { iconMap } from '../helpers/helpers.tsx';


type Props = {
    open: boolean,
    show: boolean,
    subModules: MenuItem[],
    modules?: MenuItem[] | null
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

export default function MiniAppDrawer({ open, show, subModules, modules, onClose }: Props) {
    const drawerWidth = 50;
    // const [itemsState] = useState(subModules)
    // const [module] = useState(modules)
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
                        boxSizing: 'border-box',
                        display: open ? 'flex' : 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                    },
                    transition: (t) => t.transitions.create('width', {
                        duration: t.transitions.duration.shortest,
                    }),
                }}
            >
                <DrawerHeader variant="dense" />
                <List dense>
                    {subModules.map((item, i) => {
                        const IconComponent = iconMap[item.icon];
                        return (
                            <Link key={i}
                                to={item.path}
                                onClick={() => setSelected({ title: item.title, path: item.path })}
                            >
                                <Tooltip key={i} title={item.title} arrow placement="left"
                                    slotProps={{
                                        tooltip: {
                                            sx: {
                                                borderRadius: 0.5
                                            }
                                        }
                                    }}
                                >
                                    <ListItem disablePadding dense>
                                        <StyledListItemButton selected={selected?.path === item.path}>
                                            <ListItemIcon sx={[{
                                                    minWidth: 0,
                                                    justifyContent: 'center',
                                                    mr: 'auto'
                                                }]
                                            }>
                                                {IconComponent}
                                            </ListItemIcon>
                                        </StyledListItemButton>
                                    </ListItem>
                                </Tooltip>
                                <Divider sx={{ mx: 1 }}/>
                            </Link>
                        )
                    })}
                </List>

                <Box sx={{ flexGrow: 1 }} />

                <List dense>
                    {modules?.map((item, i) => {
                        const IconComponent = iconMap[item.icon];
                        return (
                            <Link key={i}
                                to={item.path}
                                onClick={() => setSelected({ title: item.title, path: item.path })}
                            >
                                <Tooltip key={i} title={item.title} arrow placement="left"
                                    slotProps={{
                                        tooltip: {
                                            sx: {
                                                borderRadius: 0.5
                                            }
                                        }
                                    }}
                                >
                                    <ListItem disablePadding dense>
                                        <StyledListItemButton selected={selected?.path === item.path}>
                                            <ListItemIcon sx={[{
                                                    minWidth: 0,
                                                    justifyContent: 'center',
                                                    mr: 'auto'
                                                }]
                                            }>
                                                {IconComponent}
                                            </ListItemIcon>
                                        </StyledListItemButton>
                                    </ListItem>
                                </Tooltip>
                                <Divider sx={{ mx: 1 }}/>
                            </Link>
                        )
                    })}
                </List>
            </Drawer>
        </Box>
    )
}