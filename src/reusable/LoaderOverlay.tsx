import { Backdrop, CircularProgress, Typography, Stack } from '@mui/material';

type LoadingOverlayProps = {
    isLoading: boolean;
    message?: string;
}

export default function LoadingOverlay({ isLoading, message = "Cargando..." }: LoadingOverlayProps) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 101,
                flexDirection: 'column',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            open={isLoading}
            >
            <Stack alignItems="center" spacing={2}>
                <CircularProgress color="inherit" size={60} thickness={4} />
                {message && (
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 500, letterSpacing: 1 }}
                    >
                        {message}
                    </Typography>
                )}
            </Stack>
        </Backdrop>
    );
};