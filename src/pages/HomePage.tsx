import { Typography, Button, Box, Stack, Paper } from "@mui/material";
import logo from "../assets/logo.png";

interface HomePageProps {
    userName?: string;
    systemName?: string;
    onStart?: () => void;
}

export default function HomePage({
    userName = "Juan Pérez",
    systemName = "S.I GESTION DE INVENTARIO",
    onStart,
}: HomePageProps) {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    borderRadius: 3,
                    maxWidth: 600,
                    width: "100%",
                }}
            >
                <Stack spacing={4} alignItems="center">
                    {/* Header */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        alignItems="center"
                        textAlign={{ xs: "center", sm: "left" }}
                    >
                        {/* Logo */}
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo del sistema"
                            sx={{
                                width: 90,
                                height: 90,
                                objectFit: "contain",
                            }}
                        />

                        {/* Textos */}
                        <Box>
                            <Typography variant="h4" fontWeight={700} color="primary">
                                Bienvenido,  {userName}
                            </Typography>

                            <Typography variant="h6" color="text.secondary" textAlign="center">
                                {systemName}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Botón */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onStart}
                        sx={{
                            px: 6,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                        }}
                    >
                        Comenzar
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}