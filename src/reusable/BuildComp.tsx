
import { Box, Typography, Container, Paper } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';

const UnderConstruction = ({
    title = "Module under construction",
    message = "I'm working on developing this page. Give me time."
}) => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                <EngineeringIcon
                    sx={{
                        fontSize: 80,
                        color: 'text.secondary',
                        mb: 2,
                        animation: 'pulse 2s infinite ease-in-out',
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                            '100%': { transform: 'scale(1)', opacity: 1 },
                        }
                    }}
                />

                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        {title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        {message}
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default UnderConstruction;