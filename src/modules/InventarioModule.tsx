import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box
    , Card, CardActionArea, CardContent, Skeleton, Typography,
    Stack
} from "@mui/material";
import { Inventory2Rounded, ArrowForwardRounded } from "@mui/icons-material";
import { useInventarioContext } from "../context/Inventario.context";
import { Grid, Fade } from '@mui/material';
import { inventariosSlice } from "../appStore/slices/slices";
import RequestGraph from "../services/requestGraph";
import { queries } from "../services/endPoints";
import { useAppDispatch, useAppSelector } from "../appStore/hooks/hook";
import type { InventarioQL } from "../helpers/interfaces";

const requestQl = new RequestGraph
async function getInventarios() {
    return (await requestQl.queryGraph(queries.GET_INVENTARIO)).findInventarios
}

function SkeletonCard() {
    return (
        <Card sx={{
            // width: "400px",
        }}>
            <Stack spacing={2} sx={{
                p: 4
            }}>
                <Skeleton variant="circular" width={60} height={60} sx={{
                    "&.MuiSkeleton-root": {},
                }} />

                <Stack>
                    <Skeleton variant="text" width="100%"/>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="80%" />
                </Stack>
                <Skeleton variant="rounded" width="50%" height={40} />
            </Stack>
        </Card>
    )
}

export default function InventarioLayout() {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const inventariosState = useAppSelector(state => state.inventario.inventarios)
    const inventarios = inventariosState.map((item: InventarioQL) => {
        return{
            route: item.pathRoute,
            name: item.nombreInventario,
            description: item.observaciones,
            icon: 'https://cdn-icons-png.flaticon.com/512/1086/1086933.png'
        }
    })

    const { setInventarios } = inventariosSlice.actions

    const location = useLocation();
    const isRootRoute = location.pathname === "/inventario";
    const navigate = useNavigate();
    const {setSelected} = useInventarioContext()

    const handleClick = (route: string, title: string) => {
        setSelected({
            path: `/inventario/${route}`,
            title: title
        })
    }

    useEffect(() => {
        // Si ya tenemos datos en Redux, no hacemos nada
        if (inventariosState.length > 0) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getInventarios();
                dispatch(setInventarios(data));
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [dispatch, setInventarios, inventariosState.length])

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', 
            flexDirection: 'column'
        }}>
            <Box sx={{ width: '100%', height: '100%' }}>
                { isRootRoute ? <>
                    <Fade in timeout={600}>
                        <Box sx={{ p: 4 }}>
                            <Typography variant="h4" fontWeight="800" sx={{ color: '#1a1a1a', mb: 1 }}>
                                Inventarios
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>
                                Gestione y visualice el stock de sus diferentes almacenes.
                            </Typography>


                            <Grid container spacing={3}>
                                {inventarios.map((inv) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={inv.route}>
                                        {loading ? (
                                            <SkeletonCard />
                                        ) : (
                                            <Card elevation={0}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    minHeight: '100%',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                                                        borderColor: 'primary.light',
                                                        '& .icon-container': {
                                                            bgcolor: 'primary.main',
                                                            color: 'white',
                                                        },
                                                        '& .arrow-icon': {
                                                            transform: 'translateX(4px)',
                                                            opacity: 1
                                                        }
                                                    }
                                                }}
                                            >
                                                <CardActionArea
                                                    onClick={() => {
                                                        handleClick(inv.route, inv.name);
                                                        navigate(`/inventario/${inv.route}`);
                                                    }}
                                                    sx={{ p: 1 }}
                                                >
                                                    <CardContent sx={{ textAlign: 'left', p: 3 }}>
                                                        <Box
                                                            className="icon-container"
                                                            sx={{
                                                                display: 'inline-flex',
                                                                p: 2,
                                                                borderRadius: 4,
                                                                bgcolor: 'primary.50',
                                                                color: 'primary.main',
                                                                mb: 3,
                                                                transition: '0.3s'
                                                            }}
                                                        >
                                                            <Inventory2Rounded sx={{ fontSize: 32 }} />
                                                        </Box>

                                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#2d3436' }}>
                                                            {inv.name}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                mb: 3,
                                                                lineHeight: 1.6,
                                                                minHeight: '3.2em'
                                                            }}
                                                        >
                                                            {inv.description || "Sin descripción disponible para este inventario."}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                                Explorar recursos
                                                            </Typography>
                                                            <ArrowForwardRounded
                                                                className="arrow-icon"
                                                                sx={{ fontSize: 18, ml: 1, opacity: 0.5, transition: '0.3s' }} 
                                                            />
                                                        </Box>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Fade>
                </> : <>
                    <Fade in>
                        <Box sx={{
                            width: '100%',
                            flex: 1,
                            overflow: 'hidden'
                        }}>
                            <Outlet/>
                        </Box>
                    </Fade>
                </>}
            </Box>

            {/* <Box>
            </Box> */}
        </Box>
    );
}