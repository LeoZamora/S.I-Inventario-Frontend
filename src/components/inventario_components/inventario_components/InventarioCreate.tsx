import {
    Box, TextField, DialogContent,
    Dialog, DialogActions, DialogTitle,
    Button, Grid, FormControl, FormHelperText,
    Fade, Select, InputLabel, MenuItem
} from "@mui/material";

import { shake } from "../../../assets/keyFframes";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validationSchema } from '../../../config/schema.validation';
import { z } from "zod";
import RequestGraph from "../../../services/requestGraph";
import RequestHttp from "../../../services/requestHttp";
import { useEffect, useState } from "react";
import type { InventarioQL } from "../../../helpers/interfaces";
import { queries } from "../../../services/endPoints";
import { IOSSwitch } from "../../../reusable/Switch";
import { Typography, Tooltip } from '@mui/material';
import { formateDate, generatePath } from "../../../helpers/helpers";

type Props = {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
    idInventario: number | null
}

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph

type FormProps = z.infer<typeof validationSchema.inventarioSchema>

export default function InventarioCreate({ open = false, isEdit, onClose, idInventario }: Props) {
    const usuarioRegistro = 'dba'
    const [estadoInventario, setEstado] = useState(false)
    const [ubicaciones, setUbicacion] = useState([])
    const [bodegas, setBodegas] = useState([])
    const [departamentos, setDepartamentos] = useState([])
    const [codigoInvent, setCodigo] = useState(null)
    const [fechaRegistro, setFecha] = useState("")
    const [shakeDialog, setShakeDialog] = useState(false)
    const title = isEdit ? 'Editar Inventario' : 'Nuevo Inventario'

    const {
        control, handleSubmit,
        reset, setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.inventarioSchema),
        defaultValues: {
            codigoInventario: codigoInvent ?? '',
            nombreInventario: '',
            pathRoute: '',
            observaciones: '',
            usuarioRegistro: usuarioRegistro,
            idBodega: 0,
            idUbicacion: 0,
            idDepartamento: 0
        },
    })

    async function getBodegas(id: number) {
        try {
            const bodegas = await requestGraph.queryGraph(
                queries.GET_BODEGAS_COMBOBOX,
                { idUbicacion: id }
            )

            if (bodegas.findAllBodegasCombobox) {
                setBodegas(bodegas.findAllBodegasCombobox)
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: InventarioQL = {
                codigoInventario: data.codigoInventario,
                nombreInventario: data.nombreInventario,
                pathRoute: data.pathRoute,
                observaciones: data.observaciones,
                usuarioRegistro: usuarioRegistro,
                idBodega: data.idBodega,
                idDepartamento: data.idDepartamento
            }

            const result = await requestHttp.postInventarios(dataForm)
            if (result?.code === 200) {
                console.log(result);
                onClose()
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getInventarioById(id: number | null) {
            if (!id) return

            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_INVENTAIRO_BY_ID,
                    { idInventario: id }
                )

                const inventario = result?.findInventarioById

                console.log(inventario);

                if (inventario) {
                    getBodegas(inventario?.bodegas?.ubicacion.idUbicacion)
                    if (inventario.estado === 1) {
                        setEstado(true)
                    } else {
                        setEstado(false)
                    }

                    setFecha(inventario.fechaRegistro)

                    reset({
                        codigoInventario: inventario.codigoInventario,
                        nombreInventario: inventario.nombreInventario,
                        pathRoute: inventario.pathRoute,
                        observaciones: inventario.observaciones,
                        usuarioRegistro: inventario.observaciones,
                        idBodega: inventario.idBodega,
                        idUbicacion: inventario?.bodegas?.ubicacion.idUbicacion,
                        idDepartamento: inventario.idDepartamento
                    })
                }

            } catch (error) {
                console.log(error);
            }
        }

        async function getCombobox() {
            try {
                const ubicaciones = await requestGraph.queryGraph(
                    queries.GET_UBICACIONES_COMBOBOX,
                )

                const departamentos = await requestGraph.queryGraph(
                    queries.GET_DEPARTAMENTOS_COMBOBOX,
                )

                const code = await requestHttp.getCodigoInventario()
                setCodigo(code?.code)

                if (ubicaciones.findAllUbicaciones) {
                    setUbicacion(ubicaciones.findAllUbicaciones)
                    setDepartamentos(departamentos.findDepartamentos)
                }
            } catch (error) {
                console.log(error);
            }
        }


        getCombobox()

        if (isEdit) {
            getInventarioById(idInventario)
        } else {
            reset({
                codigoInventario: codigoInvent ?? '',
                nombreInventario: '',
                pathRoute: '',
                observaciones: '',
                usuarioRegistro: usuarioRegistro,
                idBodega: 0,
                idUbicacion: 0,
                idDepartamento: 0
            })
        }
    }, [idInventario, isEdit, reset, codigoInvent])


    return (
        <Dialog open={open} onClose={(event, reason) => {
            if (reason === 'backdropClick' || reason === "escapeKeyDown") {
                setShakeDialog(true)

                setTimeout(() => {
                    setShakeDialog(false)
                }, 400);

                return;
            }

            onClose?.()

            reset({
                codigoInventario: codigoInvent ?? '',
                nombreInventario: '',
                pathRoute: '',
                observaciones: '',
                usuarioRegistro: usuarioRegistro,
                idBodega: 0,
                idUbicacion: 0,
                idDepartamento: 0
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
                    width: '500px',
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
                {isEdit && (
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
                            <IOSSwitch sx={{ m: 1 }} checked={estadoInventario} />
                        </Tooltip>
                    </Box>
                )}
            </DialogTitle>

            <DialogContent
                sx={{
                    pt: 2,
                    maxHeight: 400,
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
                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Controller
                                name="codigoInventario"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="codigoInventario"
                                        type="text"
                                        size="small"
                                        label="Código de Inventario"
                                        placeholder="Ingrese el código de inventario"
                                        error={!!errors.codigoInventario}
                                        // required
                                        helperText={errors.codigoInventario?.message}
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
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Controller
                                name="pathRoute"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="pathRoute"
                                        type="text"
                                        size="small"
                                        label="Ruta de acceso"
                                        placeholder="Acceso directo a la ruta"
                                        // error={!!errors.pathRoute}
                                        // helperText={errors.pathRoute?.message}
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
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="nombreInventario"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="nombreInventario"
                                        type="text"
                                        size="small"
                                        label="Nombre de Inventario"
                                        placeholder="Ingrese el nombre del inventario"
                                        error={!!errors.nombreInventario}
                                        helperText={errors.nombreInventario?.message}
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
                                        onChange={(e) => {
                                            const value = e.target.value
                                            field.onChange(value)

                                            if (!isEdit) {
                                                setValue("pathRoute", generatePath(value), {
                                                    shouldValidate: true
                                                })
                                            }
                                        }}
                                    />
                                )}
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="idUbicacion"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.idUbicacion}>
                                        <InputLabel>Ubicación</InputLabel>
                                        <Select
                                            {...field}
                                            id="idUbicacion"
                                            label="Ubicacion"
                                            size="small"
                                            error={!!errors.idUbicacion}
                                            sx={{
                                                "&.MuiOutlinedInput-root": {
                                                    borderRadius: 0.5
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    readOnly: false
                                                }
                                            }}
                                            onChange={(e) => {
                                                field.onChange(e)

                                                const ubicacionSeleccinada = Number(e.target.value)

                                                if (ubicacionSeleccinada !== 0) {
                                                    getBodegas(ubicacionSeleccinada)
                                                }
                                            }}
                                        >
                                            <MenuItem value={0}>
                                                <em>Elija una categoria</em>
                                            </MenuItem>
                                            {ubicaciones?.map((item: {
                                                idUbicacion: number,
                                                nombreUbicacion: string,
                                                direccion: string
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
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="idBodega"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.idBodega}>
                                        <InputLabel>Bodegas</InputLabel>
                                        <Select
                                            {...field}
                                            id="idBodega"
                                            label="Bodegas"
                                            size="small"
                                            error={!!errors.idBodega}
                                            sx={{
                                                "&.MuiOutlinedInput-root": {
                                                    borderRadius: 0.5
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    readOnly: false
                                                }
                                            }}
                                        >
                                            <MenuItem value={0}>
                                                <em>Elija una bodega</em>
                                            </MenuItem>
                                            {bodegas?.map((item: {
                                                idBodega: number,
                                                codigoBodega: string,
                                                nombreBodega: string,
                                                descripcion: string
                                            }) => (
                                                <MenuItem defaultValue={1} value={item.idBodega}>
                                                    { `${item.codigoBodega} - ${item.nombreBodega}` }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.idBodega?.message}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="idDepartamento"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.idDepartamento}>
                                        <InputLabel>Departamentos</InputLabel>
                                        <Select
                                            {...field}
                                            id="idCategoria"
                                            label="Categorias"
                                            size="small"
                                            error={!!errors.idDepartamento}
                                            sx={{
                                                "&.MuiOutlinedInput-root": {
                                                    borderRadius: 0.5
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    readOnly: false
                                                }
                                            }}
                                        >
                                            <MenuItem value={0}>
                                                <em>Elija un departamento</em>
                                            </MenuItem>
                                            {departamentos?.map((item: {
                                                idDepartamento: number,
                                                codigoDepartamento: string,
                                                nombreDepartamento: string,
                                                descripcion: string
                                            }) => (
                                                <MenuItem defaultValue={1} value={item.idDepartamento}>
                                                    { `${item.codigoDepartamento} - ${item.nombreDepartamento}` }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.idDepartamento?.message}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            >
                            </Controller>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            <Controller
                                name="observaciones"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="observaciones"
                                        type="text"
                                        size="small"
                                        label="Descripcion"
                                        placeholder="Ingrese una breve descripcion"
                                        helperText={errors.observaciones?.message}
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
                        codigoInventario: codigoInvent ?? '',
                        nombreInventario: '',
                        pathRoute: '',
                        observaciones: '',
                        usuarioRegistro: usuarioRegistro,
                        idBodega: 0,
                        idUbicacion: 0,
                        idDepartamento: 0
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