import { Box, Typography, Button, Container } from "@mui/material";

export default function HomePage() {
    return (
        <Container maxWidth="md" sx={{ backgroundColor: 'white', }}>
            <Box
                sx={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: 'white',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 2,
                }}
            >
                <Typography variant="h2" fontWeight="bold">
                    Bienvenido 👋
                </Typography>

                <Typography variant="h6" color="text.secondary">
                    Esta es la página principal de la aplicación
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 2, px: 4 }}
                >
                    Comenzar
                </Button>
            </Box>
        </Container>
    );
}
