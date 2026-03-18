import {
    Container, Box, Typography, Tooltip,
    Button, Grid, Fade, Divider,
    Autocomplete, TextField, CircularProgress,
    FormControlLabel, Paper, Skeleton, IconButton,
} from "@mui/material";
import {
    ArrowBackRounded, ImageSearchRounded,
    FilePresentRounded, AddRounded
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateSolicitud() {
    const navigate = useNavigate()
    const { id } = useParams()
    const idProducto = Number(id)
    const isEdit = idProducto >= 0 ? true : false

    return (
        <Fade in>
            <Container
                sx={{
                    pb: 2
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" fontWeight={600}>
                        { isEdit ? 'Editar Producto' : 'Nueva Solicitud' }
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Tooltip title="Volver">
                        <IconButton onClick={() => {
                            navigate(-1)
                        }}>
                            <ArrowBackRounded />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{
                        width: '100%',
                        height: '100%'
                    }}
                    component="form"
                    id="subscription-form"
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                border: "1px solid",
                                borderColor: 'divider',
                                p: 1,
                                borderRadius: .5,
                            }}>
                                {/* DATOS GENERALES */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Datos Generales
                                </Typography>

                                <Divider />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                border: "1px solid",
                                borderColor: 'divider',
                                p: 1,
                                borderRadius: .5,
                            }}>
                                {/* Detalles de la solicitud */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Detalles de la Solicitud
                                </Typography>

                                <Divider />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Fade>
    )
}