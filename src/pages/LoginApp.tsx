import {
    Container, Box, Card, Typography,
    CardContent, Grid, CardActions,
    TextField, Button
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { loginSchema } from "../config/schema.validation";
import RequestHttp from "../services/requestHttp";
import { useAppDispatch } from "../appStore/hooks/hook";
import { authSlice } from "../appStore/slices/slices";
import IconButton from '@mui/material/IconButton';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const requestHttp = new RequestHttp

type FormsLogin = z.infer<typeof loginSchema>

export default function LoginApp() {
    const {
        control, formState: { errors },
        handleSubmit
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            usuario: '',
            password: '',
        }
    })
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false)
    const { setToken } = authSlice.actions

    async function onSubmit(data:  FormsLogin) {
        const result = await requestHttp.postLogin(data)

        if (result?.code === 200 || result?.code === 201) {
            const token = result.msg
            dispatch(setToken(token))
            navigate('/')
        }
    }

    return (
        <Container sx={{
            width: '100%',
            height: '100dvh'
        }}>
            <Box sx={{
                p: 2,
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Card elevation={4}
                        sx={{
                        width: 350,
                        height: '50dvh',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                >
                    <Container sx={{
                        p: 2,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography fontWeight="bold">
                            INICION DE SESION
                        </Typography>
                    </Container>

                    <CardContent>
                        <Box
                            component='form'
                            id="subscription-form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 12, lg: 12, md: 12 }}>
                                    <Controller
                                        name="usuario"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="usuario"
                                                label="Usuario"
                                                fullWidth
                                                error={!!errors.usuario}
                                                helperText={errors.usuario?.message}
                                                placeholder="Ingrese su usuario"
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true
                                                    }
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 0.5
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, lg: 12, md: 12 }}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="password"
                                                label="Contraseña"
                                                fullWidth
                                                type={showPass ? 'text' : 'password'}
                                                error={!!errors.usuario}
                                                helperText={errors.usuario?.message}
                                                placeholder="Ingrese su contraseña"
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true
                                                    },
                                                    input: {
                                                        endAdornment: (
                                                            <IconButton onClick={() => {
                                                                setShowPass(!showPass)
                                                            }}>
                                                                { showPass ? <VisibilityOffOutlined />
                                                                    : <VisibilityOutlined />
                                                                }
                                                            </IconButton>
                                                        )
                                                    }
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 0.5
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>

                    {/* <Box sx={{ flexGrow: 1 }} /> */}

                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button type="submit" form="subscription-form"
                            variant="contained"
                            sx={{
                                "&.MuiButtonBase-root": {
                                    borderRadius: .5
                                }
                            }}
                        >
                            Acceder
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Container>
    )
}