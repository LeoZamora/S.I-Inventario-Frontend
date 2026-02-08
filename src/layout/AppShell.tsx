import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box, Toolbar, Breadcrumbs, Typography
} from "@mui/material";
import AppDrawer from "./Drawer";
import AppBarLayout from "./AppBar";
import KeepAliveRouteOutlet from 'keepalive-for-react-router'
import logo from '../assets/Logos Grupo ENE/emprovisa.svg'
import MiniAppDrawer from "../components/inventario_components/MiniDrawer";
import {
    CategoryRounded, Inventory2Rounded,
    InventoryRounded,
    PeopleOutlineRounded
} from '@mui/icons-material'
import { InventarioContext, NavigationContext, type optionNavigation } from "../context/Inventario.context";
import { type optionSelected } from "../context/Inventario.context";

type Props = {
    drawerWidth?: number;
};


export default function AppShell({drawerWidth = 230}: Props) {
    const [open, setOpen] = React.useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const [opcNavigation, setOpcNavigation] = useState<optionNavigation | null>(null)
    const [selected, setSelected] = useState<optionSelected | null>(null)

    const value = useMemo(() => ({ selected, setSelected }), [selected])
    const valueNavigation = useMemo(() => ({ opcNavigation, setOpcNavigation}), [opcNavigation])

    const MiniItemsDrawer = [
        { icon: <Inventory2Rounded />, title: 'Productos',
            path: '/inventario/productos'
        },
        { icon: <InventoryRounded />, title: 'Inventarios',
            path: '/inventario/inventarios'
        },
        { icon: <CategoryRounded />, title: 'Categorias y SubCategorias',
            path: '/inventario/categorias'
        },
        { icon: <PeopleOutlineRounded />, title: 'Proveedores',
            path: '/inventario/categorias'
        },
    ]

    const miniDrawerInv = [
        '/inventario/inventarios',
        '/inventario/productos',
        '/inventario/categorias',
    ]
    const showMiniDrawer = miniDrawerInv.includes(location.pathname) || location.pathname === '/inventario'

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/home', { replace: true })
        }


    }, [location.pathname, navigate])


    return (
        <NavigationContext.Provider value={valueNavigation}>
            <InventarioContext.Provider value={value} >
                <Toolbar variant="dense"/>
                <Box sx={{ display: 'flex', height: '80vh' }}>
                    <AppBarLayout
                        open={open}
                        drawerWidth={drawerWidth}
                        onToggleDrawer={() => setOpen((prev) => !prev)}
                        logo={logo}
                    />

                    <AppDrawer
                        open={open}
                        drawerWidth={drawerWidth}
                        onClose={() => setOpen(false)}
                    />

                    <Box
                        component='main'
                        sx={{
                            flexGrow: 1,
                            overflow: "scroll",
                            height: `92vh`,
                            boxShadow: (t) => t.shadows[5],
                            transition: theme =>
                            theme.transitions.create(['margin', 'width'], {
                                easing: theme.transitions.easing.easeIn,
                                duration: theme.transitions.duration.shortest,
                            }),
                            "&::-webkit-scrollbar": {
                                width: "5px",
                                display: 'none'
                            },
                            "&::-webkit-scrollbar-track": {
                                borderRadius: "50%",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: 'transparent',
                                borderRadius: "10px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "transparent",
                            },
                            borderRadius: 1,
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb" sx={{
                            p: 1, backgroundColor: 'white'
                        }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                { opcNavigation?.title ?? "" }
                            </Typography>

                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                { selected?.title ?? "" }
                            </Typography>
                        </Breadcrumbs>
                        <Box>
                            <KeepAliveRouteOutlet transition viewTransition duration={0}/>
                        </Box>
                        {/* <Toolbar variant="dense"/> */}
                    </Box>

                    { showMiniDrawer && (
                        <MiniAppDrawer
                            open={open}
                            items={MiniItemsDrawer}
                            onClose={() => setOpen(false)}
                        />
                    )}
                </Box>
            </InventarioContext.Provider>
        </NavigationContext.Provider>
    );
}