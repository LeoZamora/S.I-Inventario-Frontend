import {
    Box, TextField, DialogContent,
    Dialog, DialogActions, DialogTitle,
    Button, Grid, MenuItem,
    Select, InputLabel, Fade,
    FormControl, FormHelperText, Tooltip
} from "@mui/material";
import { keyframes } from "@mui/system";
import { IOSSwitch } from "../../../reusable/Switch";
import { useEffect, useState } from "react";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validationSchema } from "../../../config/schema.validation";
import { z } from 'zod'
import type { Bodegas } from "../../../helpers/interfaces";
import RequestHttp from "../../../services/requestHttp";
import RequestGraph from "../../../services/requestGraph";
import { queries } from "../../../services/endPoints";

type Props = {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
    idBodega: number | null
    idUbicacion: number
}

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph

type FormProps = z.infer<typeof validationSchema.bodegasSchema>

const shake = keyframes`
    0% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
    100% { transform: translateX(0); }
`;


export default function BodegaCreate({
    open = false,
    onClose,
    isEdit,
    idBodega,
    idUbicacion
}: Props) {
    const usuarioRegistro: string = 'dba'
    const {
        control, handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.bodegasSchema),
        defaultValues: {
            nombreBodega: '',
            usuarioRegistro: usuarioRegistro,
            descripcion: '',
            idUbicacion: Number(idUbicacion)
        }
    })

    const [ubicacion, setUbicacion] = useState([])
    const [codigoBodega, setCodigo] = useState(null)
    const [shakeDialog, setShakeDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [estadoBodega, setEstado] = useState(false)
    const title = isEdit ? 'Editar Bodega' : 'Nueva Bodega'

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: Bodegas = {
                codigoBodega: data.codigoBodega,
                nombreBodega: data.nombreBodega,
                descripcion: data.descripcion ?? null,
                idUbicacion: data.idUbicacion,
                usuarioRegistro: data.usuarioRegistro
            }

            setLoading(true)
            const result = await requestHttp.postBodega(dataForm)
            setLoading(false)

            if (result?.code === 200) {
                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        async function getBodegaById(id: number | null) {
            if (!id) return

            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_BODEGA_BY_ID,
                    { idBodega: id }
                )

                const bodega = result?.findBodegaById

                if (bodega) {
                    if (bodega.estado === 1) {
                        setEstado(true)
                    } else {
                        setEstado(false)
                    }
                    reset({
                        nombreBodega: bodega.nombreBodega,
                        codigoBodega: bodega.codigoBodega,
                        idUbicacion: bodega.idUbicacion,
                        usuarioRegistro: bodega.usuarioRegistro,
                        descripcion: bodega.descripcion
                    })
                }

            } catch (error) {
                console.log(error);
            }
        }

        async function getUbicaciones() {
            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_UBICACIONES_COMBOBOX,
                )

                const code = await requestHttp.getCodigoLogistica('bodega')
                setCodigo(code)

                const ubicaciones = result?.findAllUbicaciones

                if (ubicaciones) {
                    setUbicacion(ubicaciones)
                }
            } catch (error) {
                console.log(error);
            }
        }

        getUbicaciones()

        if (isEdit) {
            getBodegaById(idBodega)
        } else {
            reset({
                nombreBodega: '',
                codigoBodega: codigoBodega ?? '',
                idUbicacion: Number(idUbicacion),
                usuarioRegistro: usuarioRegistro,
                descripcion: ''
            })
        }

    }, [isEdit, reset, idBodega, codigoBodega, idUbicacion])

    return (
        // fullScreen={fullScreen}
        <Dialog open={open} onClose={(_, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                setShakeDialog(true);

                setTimeout(() => {
                    setShakeDialog(false);
                }, 400);

                return;
            }

            onClose?.()

            reset({
                nombreBodega: '',
                codigoBodega: codigoBodega ?? '',
                usuarioRegistro: usuarioRegistro,
                idUbicacion: Number(idUbicacion),
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
                        <IOSSwitch sx={{ m: 1 }} checked={estadoBodega} />
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
                    id="bodega-form"
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
                                name="codigoBodega"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="codigoBodega"
                                        type="text"
                                        size="small"
                                        label="Código de la Bodega"
                                        placeholder="Ingrese el código de la bodega"
                                        error={!!errors.codigoBodega}
                                        helperText={errors.codigoBodega?.message}
                                        fullWidth
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            },
                                            input: {
                                                readOnly: true
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
                                name="nombreBodega"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="nombreBodega"
                                        type="text"
                                        size="small"
                                        label="Nombre de la Bodega"
                                        placeholder="Ingrese el nombre de la bodega"
                                        error={!!errors.nombreBodega}
                                        helperText={errors.nombreBodega?.message}
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
                                name="idUbicacion"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.idUbicacion}>
                                        <InputLabel>Ubicaciones</InputLabel>
                                        <Select
                                            {...field}
                                            id="idUbicacion"
                                            label="Ubicaciones"
                                            size="small"
                                            error={!!errors.idUbicacion}
                                            sx={{
                                                "&.MuiOutlinedInput-root": {
                                                    borderRadius: 0.5
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    readOnly: true
                                                }
                                            }}
                                        >
                                            <MenuItem value={0}>
                                                <em>Elija una ubicación</em>
                                            </MenuItem>
                                            {ubicacion?.map((item: {
                                                idUbicacion: number,
                                                nombreUbicacion: string,
                                                codigoUbicacion: string
                                            }) => (
                                                <MenuItem defaultValue={1} value={item.idUbicacion}>
                                                    { item.nombreUbicacion }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.idUbicacion?.message}
                                        </FormHelperText>
                                    </FormControl>
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
                                        maxRows={4}
                                        error={!!errors.descripcion}
                                        helperText={errors.descripcion?.message}
                                        label="Descripción de la bodega"
                                        placeholder="Ingrese la descripción de la bodega"
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
                        nombreBodega: '',
                        usuarioRegistro: usuarioRegistro,
                        codigoBodega: codigoBodega ?? '',
                        idUbicacion: Number(idUbicacion),
                        descripcion: ''
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
                <Button type="submit" form="bodega-form"
                    variant="contained"
                    disabled={loading}
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