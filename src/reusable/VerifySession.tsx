import {
    Dialog, DialogActions, DialogContent, Typography,
    DialogTitle, Button, Box, Grid, TextField,
    IconButton
} from "@mui/material";
import { Logout, ReplayOutlined } from "@mui/icons-material";
import { shake } from "../assets/keyFframes";
import { useState } from "react";
import RequestHttp from "../services/requestHttp";
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { loginSchema } from "../config/schema.validation";
import { useAppDispatch } from "../appStore/hooks/hook";
import { authSlice } from "../appStore/slices/slices";
import LoadingOverlay from "./LoaderOverlay";
import AlertComp from "./AlertComp";

type FormsLogin = z.infer<typeof loginSchema>

type Props = {
    open: boolean,
    onClose: () => void
}

const requestHttp = new RequestHttp

export default function VerifySession({ open, onClose }: Props) {
    const [shakeDialog, setShakeDialog] = useState(false)
    const [restarSesion, setRestarSesion] = useState(false)
    const [openOverlay, setOpenOverlay] = useState(false)

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
    const [showPass, setShowPass] = useState(false)
    const { setToken } = authSlice.actions


    // ALERT
    const [msgAlert, setMsg] = useState("Registro creado correctamente")
    const [openAlert, setOpenAlert] = useState(false)
    const [severityAlert, setSeverity] = useState<"success" | "warning" | "info" | "error">("success")

    // ALERT FUNCTIONS
    const handleCreateItem = (code: number, msg: string) => {
        if (code === 200 || code === 201) {
            setSeverity("success")
        } else if (code === 500) {
            setSeverity("error")
        } else {
            setSeverity("warning")
        }

        setMsg(msg)
        setOpenAlert(true)

        setTimeout(() => {
            setOpenAlert(false)
        }, 2500)
    }

    async function onSubmit(data:  FormsLogin) {
        setOpenOverlay(true)
        const result = await requestHttp.postLogin(data)
        setOpenOverlay(false)

        if (result?.code === 200 || result?.code === 201) {
            const token = result.msg
            dispatch(setToken(token))
            onClose?.()
            // navigate('/')
        } else {
            handleCreateItem(Number(result?.code), result?.msg)
        }
    }

    return (
        <Dialog open={open}
            onClose={(_, reason) => {
                if (reason === 'backdropClick' || reason === "escapeKeyDown") {
                setShakeDialog(true)

                setTimeout(() => {
                    setShakeDialog(false)
                }, 400);

                return;
            }

            onClose?.()
            }}
            disableAutoFocus
            disableEscapeKeyDown
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    width: '400px',
                    animation: shakeDialog ? `${shake} 0.4s ease` : "none",
                },
            }}
        >
            {!restarSesion ? (
                <>
                    <DialogTitle sx={{
                        alignContent: 'center',
                        alignItems: 'center'
                    }}
                    >
                        Sesión Expirada
                    </DialogTitle>

                    <DialogContent>
                        <Typography variant="subtitle1" textAlign="center">
                            Su sesión ha caducado. ¿Desea restablecerla para continuar trabajando?
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => {
                            onClose()
                        }} color="secondary"
                            sx={{
                                "&.MuiButtonBase-root": {
                                    borderRadius: .5
                                }
                            }}
                            startIcon={<Logout />}
                        >
                            Cerrar Sesion
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                "&.MuiButtonBase-root": {
                                    borderRadius: .5
                                }
                            }}
                            startIcon={<ReplayOutlined />}
                            onClick={() => {
                                setRestarSesion(true)
                            }}
                        >
                            Restablecer
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <>
                    <DialogTitle sx={{
                        "&.MuiDialogTitle-root": {
                            paddingBottom: 0
                        },
                    }}>
                        INICION DE SESION
                    </DialogTitle>

                    <DialogContent>
                        <Box
                            sx={{
                                pt: 2
                            }}
                            component='form'
                            id="form-login"
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
                    </DialogContent>

                    <DialogActions>
                        <Button type="submit" form="form-login"
                            variant="contained"
                            sx={{
                                "&.MuiButtonBase-root": {
                                    borderRadius: .5
                                }
                            }}
                        >
                            Acceder
                        </Button>
                    </DialogActions>
                </>
            )}

            <LoadingOverlay isLoading={openOverlay} />

            {openAlert && (
                <AlertComp severity={severityAlert} message={msgAlert}/>
            )}
        </Dialog>
    );
}