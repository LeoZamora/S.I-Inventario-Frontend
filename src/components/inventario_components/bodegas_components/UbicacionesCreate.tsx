import {
    Box, TextField, DialogContent,
    Dialog, DialogActions, DialogTitle,
    Button, Grid, Tooltip, Fade,
    Typography
    // useMediaQuery
} from "@mui/material";

import { useEffect, useState } from "react";
import { shake } from "../../../assets/keyFframes";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validationSchema } from "../../../config/schema.validation";
import { z } from 'zod'
import type { Ubicacion } from "../../../helpers/interfaces";
import RequestHttp from "../../../services/requestHttp";
import RequestGraph from "../../../services/requestGraph";
import { queries } from "../../../services/endPoints";
import { IOSSwitch } from "../../../reusable/Switch";
import { formateDate } from "../../../helpers/helpers.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
    idUbicacion: number | null
}

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph

type FormProps = z.infer<typeof validationSchema.ubicacionSchema>


export default function UbicacionCreate({ open = false, onClose, isEdit, idUbicacion }: Props) {
    const usuarioRegistro: string = 'dba'
    const {
        control, handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.ubicacionSchema),
        defaultValues: {
            nombreUbicacion: '',
            codigoUbicacion: '',
            direccion: '',
            usuarioRegistro: usuarioRegistro
        }
    })
    const [shakeDialog, setShakeDialog] = useState(false)
    const [estadoUbicacion, setEstado] = useState(false)
    const [codigoUbicacion, setCodigo] = useState(null)
    const [fechaRegistro, setFecha] = useState("")
    const title = isEdit ? 'Editar Ubicación' : 'Nueva Ubicación'

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: Ubicacion = {
                codigoUbicacion: data.codigoUbicacion,
                nombreUbicacion: data.nombreUbicacion,
                direccion: data.direccion ?? null,
                usuarioRegistro: data.usuarioRegistro
            }

            const result = await requestHttp.postUbicacion(dataForm)
            if (result?.code === 200) {
                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getCodigo() {
            setCodigo(await requestHttp.getCodigoLogistica('ubicacion'))
        }

        if (!isEdit) {
            getCodigo()
            reset({
                nombreUbicacion: '',
                codigoUbicacion: codigoUbicacion ?? '',
                direccion: '',
                usuarioRegistro: usuarioRegistro
            });
            return;
        }

        if (!idUbicacion) return;

        const loadData = async () => {
            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_UBICACION_BY_ID,
                    { idUbicacion }
                );

                const ubicacion = result?.findUbicacionById;

                if (ubicacion) {
                    setEstado(!!ubicacion.estado);
                    setFecha(ubicacion.fechaRegistro)
                    reset({
                        nombreUbicacion: ubicacion.nombreUbicacion,
                        codigoUbicacion: ubicacion.codigoUbicacion,
                        direccion: ubicacion.direccion ?? null,
                        usuarioRegistro: ubicacion.usuarioRegistro
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadData();
    }, [isEdit, idUbicacion, reset, codigoUbicacion, usuarioRegistro]);

    return (
        <Dialog open={open} onClose={(event, reason) => {
            if (reason === "backdropClick" || reason === 'escapeKeyDown') {
                setShakeDialog(true);

                setTimeout(() => {
                    setShakeDialog(false);
                }, 400);

                return;
            }

            onClose?.()

            reset({
                nombreUbicacion: '',
                codigoUbicacion: codigoUbicacion ?? '',
                direccion: '',
                usuarioRegistro: ''
            })
        }}
            disableRestoreFocus
            disableEscapeKeyDown
            autoFocus
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 1,
                    width: '400px',
                    animation: shakeDialog ? `${shake} 0.4s ease` : "none",
                },
            }}
        >

            <DialogTitle sx={{
                "&.MuiDialogTitle-root": {
                    paddingBottom: 0
                },
                "&.MuiDialogContent-root": {
                    pt: 2
                },
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center'
            }}
            >
                <Box>
                    {title}
                </Box>
                <Box>
                    <Tooltip title="Estado" placement="top"
                        slots={{
                            transition: Fade
                        }}
                        slotProps={{
                            tooltip: {
                                sx: {
                                    ml: 1,
                                    borderRadius: .5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    backgroundColor: 'white',
                                    color: 'grey'
                                }
                            },
                        }}
                    >
                        <IOSSwitch sx={{ m: 1 }} checked={estadoUbicacion} />
                    </Tooltip>
                </Box>
            </DialogTitle>

            <DialogContent sx={{
                    pt: 2,
                    "&.MuiDialogContent-root": {
                        paddingTop: 2
                    },
                }}
            >
                <Box component="form"
                    id="ubication-form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        width: '100%',
                        gap: 2,
                    }}
                >

                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                        <Controller
                            name="codigoUbicacion"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id="codigoUbicacion"
                                    label="Código de Ubicación"
                                    type="text"
                                    size="small"
                                    placeholder="Ingrese el código para esta ubicación"
                                    error={!!errors.codigoUbicacion}
                                    // required
                                    helperText={errors.codigoUbicacion?.message}
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                        input: {
                                            readOnly: isEdit ? true : false
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

                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                        <Controller
                            name="nombreUbicacion"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id="nombreUbicacion"
                                    type="text"
                                    size="small"
                                    label="Nombre de Ubicación"
                                    placeholder="Ingrese el nombre de la ubicación"
                                    error={!!errors.nombreUbicacion}
                                    // required
                                    helperText={errors.nombreUbicacion?.message}
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{
                                        // Matener un placeholder activo
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

                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                        <Controller
                            name="direccion"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id="direccion"
                                    type="text"
                                    size="small"
                                    multiline
                                    maxRows={4}
                                    label="Dirección de la Ubicación"
                                    placeholder="Ingrese la dirección de la ubicación"
                                    fullWidth
                                    variant="outlined"
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
                </Box>

                { isEdit && (
                        <Box>
                            <Typography variant="body1" component="small" fontSize={12}
                                color="text.secondary"
                                sx={{
                                    pt: 1
                                }}
                            >
                                Fecha Registro: { formateDate(fechaRegistro, true) }
                            </Typography>
                        </Box>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    onClose()
                    reset({
                        nombreUbicacion: '',
                        codigoUbicacion: codigoUbicacion ?? '',
                        direccion: '',
                        usuarioRegistro: ''
                    })
                }} color="secondary"
                    sx={{
                        "&.MuiButtonBase-root": {
                            borderRadius: .5
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button type="submit" form="ubication-form"
                    variant="contained"
                    sx={{
                        "&.MuiButtonBase-root": {
                            borderRadius: .5
                        }
                    }}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}