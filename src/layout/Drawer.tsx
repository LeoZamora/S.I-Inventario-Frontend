import {
    Box, List,
    Drawer, Divider, ListItem,
    ListItemButton, ListItemIcon,
    ListItemText, Typography,
    styled, Avatar,
    alpha, Collapse,
    useTheme,
    ListSubheader,
} from "@mui/material";

import {
    Logout as LogoutIcon,
    HomeRounded, ExpandLessRounded, ExpandMoreRounded,
    InventoryRounded, PendingActions,
    CompareArrowsRounded, ReceiptLong,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavigationContext, useInventarioContext } from "../context/Inventario.context";
import { authSlice } from "../appStore/slices/slices";
import { useAppDispatch } from "../appStore/hooks/hook";

type Props = {
    open: boolean,
    drawerWidth: number,
    onClick: (opc: string) => void
    onClose: () => void
}

// Estilos para los items del menú
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 5,
    margin: theme.spacing(0.5, 1),
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
            transition: 'color 0.3s ease'
        },
        '& .MuiListItemText-primary': {
            fontWeight: 600,
        },
        '::before': {
            transform: 'scaleY(1)',
            opacity: 1
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '15%',
        height: '70%',
        width: '4px',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '0 4px 4px 0',
        transform: 'scaleY(0)',
        opacity: 0,
        transition: 'transform 0.3s ease-in-out, opacity 0.2s ease-in-out',
    },
}));

const StyledListItemIcon = styled(ListItemIcon)(() => ({
    minWidth: 40,
    color: "black",
}));

export default function AppDrawer({ open, drawerWidth, onClose, onClick }: Props) {
    const dispatch = useAppDispatch()
    const { logout } = authSlice.actions
    const theme = useTheme();
    const navigate = useNavigate()
    const { opcNavigation, setOpcNavigation } = useNavigationContext()
    const { setSelected } = useInventarioContext()
    const [selectedOption, setSelectedOpc] = useState(opcNavigation?.title)
    const [openOption, setOpenOpc] = useState(false)

    const mainMenuItems = [
        { text: 'Inicio', icon: <HomeRounded />,
            selected: true, route: '/home', expand: false,
            type: 'ini'
        },
        { text: 'Inventario', icon: <InventoryRounded />,
            selected: false, route: '/inventario', subRoute: '/inventario',
            expand: false, type: 'inv'
        },
        { text: 'Mov. Inventario', icon: <CompareArrowsRounded />,
            selected: false, route: '/movimientos-inventario', subRoute: null,
            subItems: [
                { text: 'Solicitudes', icon: <PendingActions />, type: 'sol',
                    selected: false, route: '/solicitudes', subRoute: '/solicitudes'
                },
                { text: 'Órdenes', icon: <ReceiptLong />, type: 'ord',
                    selected: false, route: '/ordenes', subRoute: '/ordenes'
                },
            ],
            expand: true
        },
    ];

    const userMenuItems = [
        { text: 'Cerrar Sesion', icon: <LogoutIcon /> },
    ]

    useEffect(() => {
        const lastOption = localStorage.getItem('lastOption');

        if (opcNavigation?.title === lastOption) return;
        const finalValue = lastOption ?? '';

        setOpcNavigation({
            title: finalValue,
            path: '',
        });

        return () => setSelectedOpc(finalValue);

    }, [opcNavigation?.title, setOpcNavigation, setSelectedOpc]);

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        color: "inherit",
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxSizing: 'border-box',
                        display: open ? 'flex' : 'none',
                        transition: (t) => t.transitions.create('width', {
                            duration: t.transitions.duration.shortest,
                        }),
                    },
                    transition: (t) => t.transitions.create('width', {
                        easing: t.transitions.easing.easeOut,
                        duration: t.transitions.duration.shortest,
                    }),
                }}
            >
                {/* Perfil del usuario */}
                <Box sx={{ p: 1, textAlign: 'center', color: 'black'}}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            margin: '0 auto 16px',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            boxShadow: theme.shadows[3]
                        }}
                        src="https://sistemas.emprovisa.com.ni:9304/services/siaf/api/empleados/008085/foto"
                    />
                    <Typography variant="h6" fontWeight={600} sx={{
                        color: 'inherit'
                    }}>
                        Leonardo Zamora
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            mb: 1
                        }}
                    >
                        Administrator
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block'
                        }}
                        >
                        last login: Today, 14:30
                    </Typography>
                </Box>

                <Divider sx={{ my: 2, mx: 3 }} />

                {/* Menú principal */}
                <List sx={{ px: 1, color: 'inherit' }} dense component='nav'
                    subheader={
                        <ListSubheader component={'div'} sx={{
                            backgroundColor: 'transparent',
                            color: 'gray',
                            lineHeight: '15px'
                        }}>
                            Gestion General
                        </ListSubheader>
                    }>
                    {mainMenuItems.map((item, i) => (
                        !item.expand ?
                            <Link to={item.route}
                                key={i} onClick={() => {
                                    setOpcNavigation({
                                        title: item.text,
                                        path: item.route,
                                    })
                                    localStorage.setItem('lastOption', item.text)
                                    setSelected({
                                        title: '',
                                        path: null
                                    })
                                }}
                            >
                                <ListItem disablePadding
                                    secondaryAction={
                                        item.expand ? (openOption ? <ExpandLessRounded /> : <ExpandMoreRounded />) : null
                                    }
                                >
                                    <StyledListItemButton selected={selectedOption === item.text}
                                        onClick={() => {
                                            onClick(item.type ?? "")
                                            setSelectedOpc(item.text)
                                            if (item.expand) {
                                                setOpenOpc(!openOption)
                                            }
                                        }}>
                                        <StyledListItemIcon>
                                            {item.icon}
                                        </StyledListItemIcon>
                                        <ListItemText>
                                            {item.text}
                                        </ListItemText>
                                    </StyledListItemButton>
                                </ListItem>
                            </Link>
                            : <>
                                <ListItem disablePadding
                                    key={i}
                                    secondaryAction={
                                        item.expand ? (openOption ? <ExpandLessRounded /> : <ExpandMoreRounded />) : null
                                    }
                                >
                                    <StyledListItemButton selected={selectedOption === item.text}
                                        onClick={() => {
                                            setSelectedOpc(item.text)
                                            if (item.expand) {
                                                setOpenOpc(!openOption)
                                            }
                                        }}
                                    >
                                        <StyledListItemIcon>
                                            {item.icon}
                                        </StyledListItemIcon>
                                        <ListItemText>
                                            {item.text}
                                        </ListItemText>
                                    </StyledListItemButton>
                                </ListItem>
                                {item.subItems && item.subItems.map((subItem, j) => (
                                        <Collapse in={openOption} timeout="auto" unmountOnExit
                                            sx={{
                                                mx: 1
                                            }}
                                        >
                                            <Link to={subItem.route} key={j}>
                                                <ListItem component="div" disablePadding
                                                    onClick={() => {
                                                        onClick(subItem.type)
                                                        localStorage.setItem('lastOption', subItem.text)
                                                    }}
                                                >
                                                    <StyledListItemButton selected={selectedOption === subItem.text}
                                                        onClick={() => {
                                                            setSelectedOpc(subItem.text)
                                                        }}>
                                                        <StyledListItemIcon sx={{ ml: 2 }}>
                                                            {subItem.icon}
                                                        </StyledListItemIcon>
                                                        <ListItemText>
                                                            {subItem.text}
                                                        </ListItemText>
                                                    </StyledListItemButton>
                                                </ListItem>
                                            </Link>
                                        </Collapse>
                                    ))
                                }
                            </>
                    ))}
                </List>

                {/* Espacio flexible para empujar el logout hacia abajo */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Logout en la parte inferior */}
                <List sx={{ px: 1, color: 'black'}} dense>
                    {userMenuItems.map((item, i) => (
                        <ListItem key={i} disablePadding>
                            <StyledListItemButton onClick={() => {
                                dispatch(logout())
                                navigate('/login', { replace: true })
                            }}
                                sx={{
                                    borderRadius: 10,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                                    }
                                }}
                            >
                            <StyledListItemIcon sx={{ color: theme.palette.error.main }}>
                                {item.icon}
                            </StyledListItemIcon>
                            <ListItemText
                                primary={item.text}
                            />
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Footer del Drawer */}
                <Box sx={{
                    px: 2,
                    textAlign: 'center',
                    marginX: '4px',
                    borderTop: `1px solid #E0E0E0`
                }}>
                    <Typography variant="caption"
                        sx={{
                            color: "grey",
                        }}>
                        © 2025 <Typography component={'span'} sx={{
                                color: 'indigo',
                                fontWeight: "bold",
                                fontSize: "10px"
                            }}>
                            EMPROVISA
                        </Typography>
                    </Typography>
                    <Typography variant="caption" sx={{
                            color: "grey",
                            display: 'block',
                            fontSize: '0.7rem'
                        }}>
                        All rights reserved
                    </Typography>
                </Box>
            </Drawer>
        </>
    );
}