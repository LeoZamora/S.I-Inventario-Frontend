import React,{
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,Toolbar, Breadcrumbs, Typography,
    Fade
} from "@mui/material";
import AppDrawer from "./Drawer";
import AppBarLayout from "./AppBar";
import KeepAliveRouteOutlet from 'keepalive-for-react-router'
import logo from '../assets/Logos Grupo ENE/emprovisa.svg'
import MiniAppDrawer from "../components/MiniDrawer";
import {
    InventarioContext,
    NavigationContext,
    type optionNavigation,
    type optionSelected,
} from "../context/Inventario.context";
import { inventarioModuleConfig } from "../config/miDraweConfig";

type Props = {
    drawerWidth?: number;
};


export default function AppShell({drawerWidth = 230}: Props) {
    const [open, setOpen] = React.useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const [opcNavigation, setOpcNavigation] = useState<optionNavigation | null>(null)
    const [selected, setSelected] = useState<optionSelected | null>(null)

    const { subModuleInventario, inventarios, miniDrawerInv } = inventarioModuleConfig()

    const value = useMemo(() => ({ selected, setSelected }), [selected])
    const valueNavigation = useMemo(() => ({ opcNavigation, setOpcNavigation}), [opcNavigation])

    const showMiniDrawer = miniDrawerInv.includes(location.pathname) || location.pathname === '/inventario'

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/home', { replace: true })
        }

    }, [location.pathname, navigate])

    const layoutRef = useRef<HTMLDivElement>(null)


    return (
        <NavigationContext.Provider value={valueNavigation}>
            <InventarioContext.Provider value={value} >
                <Toolbar variant="dense"/>
                <Box
                    ref={layoutRef}
                    sx={{
                        display: 'flex',
                        height: '80vh'
                    }}
                >
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
                            // border: '1px solid #e0e0e0',
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

                        <Fade in>
                            <Box>
                                <KeepAliveRouteOutlet transition viewTransition duration={100}/>
                            </Box>
                        </Fade>
                    </Box>

                    { showMiniDrawer && (
                        <MiniAppDrawer
                            open={open}
                            items={subModuleInventario}
                            inventory={inventarios}
                            onClose={() => setOpen(false)}
                        />
                    )}
                </Box>
            </InventarioContext.Provider>
        </NavigationContext.Provider>
    );
}