import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
    Box,Toolbar, Breadcrumbs, Typography,
} from "@mui/material";
import AppDrawer from "./Drawer";
import AppBarLayout from "./AppBar";
import logo from '../assets/logo.png'
import MiniAppDrawer from "./MiniDrawer";
import {
    InventarioContext,
    NavigationContext,
    type optionNavigation,
    type optionSelected,
} from "../context/Inventario.context";
import { inventarioModuleConfig, ordenesModuleConfig, solicitudesModuleConfig } from "../config/miDraweConfig";
import { useAppDispatch, useAppSelector } from "../appStore/hooks/hook";
import type { MenuItem } from '../helpers/types'
import { inventariosSlice } from '../appStore/slices/slices';
import type { JwtPayload } from 'jwt-decode'
import VerifySession from '../reusable/VerifySession';
import JWTDecoder from "../helpers/jwtDecoder";

type Props = {
    drawerWidth?: number;
};

export default function AppShell({drawerWidth = 230}: Props) {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const subModulesStore: MenuItem[] = useAppSelector(state => state.inventario.subModulesDrawer)
    const { setSubMudulesDrawer } = inventariosSlice.actions
    const token = useAppSelector(state => state.auth.token)

    const [open, setOpen] = useState(true)
    const [openVerify, setOpenVerify] = useState(false)
    const [opcNavigation, setOpcNavigation] = useState<optionNavigation | null>(null)
    const [selected, setSelected] = useState<optionSelected | null>(null)
    const [modulesMiniDrawer, setModules] = useState<MenuItem[]>([])
    const [subModulesMiniDrawer, setSubModules] = useState<MenuItem[]>([])

    const { subModuleInventario, inventarios } = inventarioModuleConfig()
    const { subModulosSolicitud } = solicitudesModuleConfig()
    const { subModulosOrdenes } = ordenesModuleConfig()


    const value = useMemo(() => ({ selected, setSelected }), [selected])
    const valueNavigation = useMemo(() => ({ opcNavigation, setOpcNavigation}), [opcNavigation])

    const showMiniDrawer =
        location.pathname.includes('/inventario') ||
        location.pathname.includes('/solicitudes') ||
        location.pathname.includes('/ordenes')

    const verifySession = useCallback(async () => {
        const decodeToken: JwtPayload | null = new JWTDecoder(token).decodeToken()
        const now =  Date.now()

        if (!decodeToken) return
        const expiryInMs = Number(decodeToken.exp) * 1000;

        if (now >= expiryInMs) {
            setTimeout(() => {
                setOpenVerify(true)
            }, 0)
        }
    }, [token])

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/home', { replace: true })
        }

    }, [location.pathname, navigate, token])

    useEffect(() => {
        verifySession()

        // FUNCION PARA VERIFICAR USUARIO EN LA PESTAÑA ACTUAL
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                verifySession()
            }
        }

        // VERIFICAR EL VOLVER A ENTRAR
        window.addEventListener("focus", verifySession)
        document.addEventListener("visibilitychange", handleVisibilityChange)


        return () => {
            window.removeEventListener('focus', verifySession);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [verifySession])

    const layoutRef = useRef<HTMLDivElement>(null)


    return (
        <NavigationContext.Provider value={valueNavigation}>
            <InventarioContext.Provider value={value} >
                <Toolbar variant="dense"/>
                <Box
                    ref={layoutRef}
                    sx={{
                        display: "flex",
                        height: '100%'
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
                        onClick={(opc) => {
                            dispatch(setSubMudulesDrawer([]))
                            switch (opc) {
                                case "inv":
                                    dispatch(setSubMudulesDrawer(subModuleInventario))
                                    setSubModules(subModuleInventario)
                                    setModules(inventarios)
                                    break;
                                case "sol":
                                    dispatch(setSubMudulesDrawer(subModulosSolicitud))
                                    setSubModules(subModulosSolicitud)
                                    setModules([])
                                    break;
                                case "ord":
                                    dispatch(setSubMudulesDrawer(subModulosOrdenes))
                                    setSubModules(subModulosOrdenes)
                                    setModules([])
                                    break;
                                default:
                                    break;
                            }
                        }}
                        onClose={() => setOpen(false)}
                    />

                    <Box
                        component='main'
                        sx={{
                            flexGrow: 1,
                            overflow: "scroll",
                            height: `100%`,
                            width: '100%',
                            backgroundColor: 'white',
                            transition: theme =>
                            theme.transitions.create(['margin', 'width'], {
                                easing: theme.transitions.easing.easeIn,
                                duration: theme.transitions.duration.shortest,
                            }),
                            "& .MuiBox-root": {
                                backgroundColor: 'white'
                            },
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

                        <Outlet />
                    </Box>

                    <MiniAppDrawer
                        open={open}
                        show={showMiniDrawer}
                        subModules={subModulesStore ?? subModulesMiniDrawer}
                        modules={modulesMiniDrawer}
                        onClose={() => setOpen(false)}
                    />
                </Box>

                <VerifySession open={openVerify} onClose={() => {
                    setOpenVerify(false)
                }}/>
            </InventarioContext.Provider>
        </NavigationContext.Provider>
    );
}