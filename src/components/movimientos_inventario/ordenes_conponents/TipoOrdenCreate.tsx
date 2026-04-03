import {
    Box, TextField, DialogContent,
    Dialog, DialogActions, DialogTitle,
    Button, Grid,
    Fade
} from "@mui/material";

import { shake } from "../../../assets/keyFframes";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validationSchema } from '../../../config/schema.validation';
import { z } from "zod";
import RequestGraph from "../../../services/requestGraph";
import RequestHttp from "../../../services/requestHttp";
import { useEffect, useState } from "react";
import type { TipoGeneric } from "../../../helpers/interfaces";
import { queries } from "../../../services/endPoints";
import { IOSSwitch } from "../../../reusable/Switch";
import { Typography, Tooltip } from '@mui/material';
import { formateDate } from "../../../helpers/helpers.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
    idTipoOrden: number | null,
    onClick: (code: number, msg: string) => void
}

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph

type FormProps = z.infer<typeof validationSchema.tipoSolicitudSchema>

const usuarioRegistro = 'dba'

export default function TipoOrdenCreate({ open = false, isEdit, onClose, onClick, idTipoOrden }: Props) {
    const {
        control, handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.tipoSolicitudSchema),
        defaultValues: { nombre: '', descripcion: '', usuarioRegistro: usuarioRegistro },
    })

    const [estadoTipoProducto, setEstado] = useState(false)
    const [fechaRegistro, setFecha] = useState("")
    const [shakeDialog, setShakeDialog] = useState(false)
    const title = isEdit ? 'Editar Tipo Órden' : 'Nuevo Tipo Órden'

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: TipoGeneric = {
                nombre: data.nombre,
                descripcion: data?.descripcion,
                usuarioRegistro: usuarioRegistro
            }

            const result = await requestHttp.postTipoOrden(dataForm)

            onClick(result?.code, result?.msg)

            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getTipoProdById(id: number | null) {
            if (!id) return

            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_TIPOSOLICITUD_BY_ID,
                    { idTipoOrden: id }
                )

                const tipoSolicitud = result?.findTipoSolicitudById

                if (tipoSolicitud) {
                    if (tipoSolicitud.estado === 1) {
                        setEstado(true)
                    } else {
                        setEstado(false)
                    }

                    setFecha(tipoSolicitud.fechaRegistro)

                    reset({
                        nombre: tipoSolicitud.nombre,
                        usuarioRegistro: tipoSolicitud.usuarioRegistro,
                        descripcion: tipoSolicitud.descripcion
                    })
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (isEdit) {
            getTipoProdById(idTipoOrden)
        } else {
            reset({
                nombre: '',
                descripcion: '',
                usuarioRegistro: usuarioRegistro
            })
        }
    }, [idTipoOrden, isEdit, reset])


    return (
        <Dialog open={open} onClose={(_, reason) => {
            if (reason === 'backdropClick' || reason === "escapeKeyDown") {
                setShakeDialog(true)

                setTimeout(() => {
                    setShakeDialog(false)
                }, 400);

                return;
            }

            onClose?.()

            reset({
                nombre: '',
                descripcion: '',
                usuarioRegistro: usuarioRegistro
            })
        }}
            disableRestoreFocus
            disableEscapeKeyDown
            autoFocus
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
                        <IOSSwitch sx={{ m: 1 }} checked={estadoTipoProducto} />
                    </Tooltip>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    pt: 2,
                    "&.MuiDialogContent-root": {
                        pt: 2
                    }
                }}
            >
                <Box component="form"
                    id="subscription-form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        width: '100%',
                        gap: 2
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="nombre"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="nombre"
                                        type="text"
                                        size="small"
                                        label="Nombre Tipo Órden"
                                        placeholder="Ingrese el nombre"
                                        error={!!errors.nombre}
                                        // required
                                        helperText={errors.nombre?.message}
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
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="descripcion"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="descripcion"
                                        type="text"
                                        size="small"
                                        label="Descripcion"
                                        placeholder="Ingrese una breve descripcion"
                                        helperText={errors.descripcion?.message}
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={4}
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
                            >
                            </Controller>
                        </Grid>
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
                    setEstado(false)
                    reset({
                        nombre: '',
                        descripcion: '',
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
                <Button type="submit" form="subscription-form"
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
    );
}