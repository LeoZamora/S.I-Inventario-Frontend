import {
    Box, TextField, DialogContent,
    Dialog, DialogActions, DialogTitle,
    Button, Grid,
    // useMediaQuery
} from "@mui/material";

import { useEffect, useState } from "react";
import { shake } from "../../../assets/keyFframes";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validationSchema } from "../../../config/schema.validation";
import { z } from 'zod'
import RequestHttp from "../../../services/requestHttp";
// import RequestGraph from "../../../services/requestGraph";
import type { ItemCombobox } from "../../../helpers/types";
import {
    endPoints,
    // queries
} from "../../../services/endPoints";

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: (code: number, msg: string) => void;
    isEdit?: boolean | null;
    tipo: string
}

const requestHttp = new RequestHttp
const usuarioRegistro = 'dba'
type FormProps = z.infer<typeof validationSchema.itemComboboxSchema>

export default function ItemComboboxCreate({ open = false, onClose, isEdit, tipo, onSuccess }: Props) {
    const {
        control, handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.itemComboboxSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            usuarioRegistro: usuarioRegistro
        }
    })
    const [shakeDialog, setShakeDialog] = useState(false)
    const title = isEdit ? 'Editar Registro' : 'Nueva Registro'

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: ItemCombobox = {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                usuarioRegistro: usuarioRegistro
            }

            let result;

            switch (tipo) {
                case 'tdis':
                    result = await requestHttp.postItem(dataForm, endPoints.postTipoDispositivo)
                    break;

                case 'talm':
                    result = await requestHttp.postItem(dataForm, endPoints.postTipoAlm)
                    break;

                case 'tcal':
                    result = await requestHttp.postItem(dataForm, endPoints.postTipoCalibre)
                    break;

                case 'tarm':
                    result = await requestHttp.postItem(dataForm, endPoints.postTipoArma)
                    break;

                case 'sd':
                    result = await requestHttp.postItem(dataForm, endPoints.posSistemaDisparo)
                    break;

                default:
                    break;
            }

            onSuccess(result?.code, result?.msg)
            onClose()
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        reset({
            nombre: '',
            descripcion: '',
            usuarioRegistro: usuarioRegistro
        })
    }, [reset, tipo])

    return (
        // fullScreen={fullScreen}
        <Dialog open={open} onClose={(_, reason) => {
            if (reason === "backdropClick" || reason === 'escapeKeyDown') {
                setShakeDialog(true);

                setTimeout(() => {
                    setShakeDialog(false);
                }, 400);

                return;
            }

            onClose?.()

            reset({
                nombre: '',
                descripcion: ''
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
                        paddingTop: 2
                    }
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent sx={{
                    pt: 2,
                    "&.MuiDialogContent-root": {
                        paddingTop: 2
                    },
                }}
            >
                <Box component="form"
                    id="item-form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        width: '100%',
                        gap: 2,
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
                                        label="Nombre"
                                        placeholder="Ingrese el nombre del registro"
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

                            />
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
                                        multiline
                                        rows={4}
                                        label="Descripción "
                                        placeholder="Ingrese una descripcion"
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
                    </Grid>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    onClose()
                    reset({
                        nombre: '',
                        descripcion: '',
                        usuarioRegistro: usuarioRegistro
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
                <Button type="submit" form="item-form"
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