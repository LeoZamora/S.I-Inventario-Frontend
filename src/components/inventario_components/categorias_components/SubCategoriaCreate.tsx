import {
    Box, TextField, DialogContent,
    Dialog, DialogActions, DialogTitle,
    Button, Grid, MenuItem,
    Select, InputLabel, Fade,
    FormControl, FormHelperText, Tooltip
    // useMediaQuery
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validationSchema } from "../../../config/schema.validation";
import { z } from 'zod'
import type { SubCategoria } from "../../../helpers/interfaces";
import RequestHttp from "../../../services/requestHttp";
import RequestGraph from "../../../services/requestGraph";
import { queries } from "../../../services/endPoints";
import { keyframes } from "@mui/system";
import { IOSSwitch } from "../../../reusable/Switch";

type Props = {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
    idSubCategoria: number | null
    idCategoria: number | null
}

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph

type FormProps = z.infer<typeof validationSchema.subCategoriasSchema>

const shake = keyframes`
    0% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
    100% { transform: translateX(0); }
`;

const usuarioRegistro: string = 'dba'

export default function SubCategoriaCreate({
    open = false,
    onClose,
    isEdit,
    idSubCategoria,
    idCategoria
}: Props) {
    const {
        control, handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.subCategoriasSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            idCategoria: 0,
            codigoProducto: ''
        }
    })
    const [categorias, setCategoria] = useState([])
    const [codigoSubCat, setCodigo] = useState(null)
    const [shakeDialog, setShakeDialog] = useState(false)
    const [estadoSubCat, setEstado] = useState(false)
    const title = isEdit ? 'Editar SubCategoria' : 'Nueva SubCategoría'

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: SubCategoria = {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                idCategoria: data.idCategoria,
                codigoSubCategoria: data.codigo,
                codigoProducto:  data.codigoProducto,
                usuarioRegistro: usuarioRegistro
            }

            const dataEdit: SubCategoria = {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                idCategoria: data.idCategoria,
                codigoProducto:  data.codigoProducto,
            }

            let result;

            if (!isEdit) {
                result = await requestHttp.postSubCategoria(dataForm)
            } else {
                result = await requestHttp.putSubCategoria(Number(idSubCategoria), dataEdit)
            }

            if (result?.code === 200) {
                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        async function getSubCategoriasById(id: number | null) {
            if (!id) return

            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_SUBCATEGORIA_BY_ID,
                    { idSubCategoria: id }
                )

                const subCategoria = result?.finSubCategoryById

                if (subCategoria) {
                    if (subCategoria.estado === 1) {
                        setEstado(true)
                    } else {
                        setEstado(false)
                    }
                    reset({
                        nombre: subCategoria.nombre,
                        codigo: subCategoria.codigoSubCategoria,
                        idCategoria: subCategoria.idCategoria,
                        codigoProducto: subCategoria.codigoProducto,
                        descripcion: subCategoria.descripcion
                    })
                }

            } catch (error) {
                console.log(error);
            }
        }
        async function getCategorias() {
            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_CATEGORIA_COMBOBOX,
                )

                const code = await requestHttp.getCodigoSubCategoria(Number(idCategoria))
                setCodigo(code?.code)

                const categoria = result?.findAllCategories

                if (categoria) {
                    setCategoria(categoria)
                }
            } catch (error) {
                console.log(error);
            }
        }

        getCategorias()

        if (isEdit) {
            getSubCategoriasById(idSubCategoria)
        } else {
            reset({
                nombre: '',
                codigo: codigoSubCat ?? '',
                codigoProducto: '',
                idCategoria: Number(idCategoria),
                descripcion: ''
            })
        }

    }, [isEdit, idSubCategoria, reset, codigoSubCat, idCategoria])

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
                nombre: '',
                codigo: codigoSubCat ?? '',
                codigoProducto: '',
                idCategoria: Number(idCategoria),
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
                        <IOSSwitch sx={{ m: 1 }} checked={estadoSubCat} />
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
                    id="subscription-form"
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
                                name="codigo"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="codigo"
                                        type="text"
                                        size="small"
                                        label="Código de la SubCategoría"
                                        placeholder="Ingrese el código de la subcategoría"
                                        error={!!errors.codigo}
                                        helperText={errors.codigo?.message}
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
                                name="nombre"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="nombre"
                                        type="text"
                                        size="small"
                                        label="Nombre de la Categoría"
                                        placeholder="Ingrese el nombre de la categoría"
                                        error={!!errors.nombre}
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
                                name="codigoProducto"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="codigoProducto"
                                        type="text"
                                        size="small"
                                        label="Código para Productos"
                                        placeholder="Ingrese el código para los productos"
                                        error={!!errors.codigoProducto}
                                        helperText={errors.codigoProducto?.message}
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
                                name="idCategoria"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.idCategoria}>
                                        <InputLabel>Categorias</InputLabel>
                                        <Select
                                            {...field}
                                            id="idCategoria"
                                            label="Categorias"
                                            size="small"
                                            error={!!errors.idCategoria}
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
                                                <em>Elija una categoria</em>
                                            </MenuItem>
                                            {categorias?.map((item: {
                                                idCategoria: number,
                                                nombreCategoria: string,
                                                descripcion: string
                                            }) => (
                                                <MenuItem defaultValue={1} value={item.idCategoria}>
                                                    { item.nombreCategoria }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.idCategoria?.message}
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
                                        label="Descripción de la Categoría"
                                        placeholder="Ingrese la descripción de la categoría"
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
                        codigo: codigoSubCat ?? '',
                        codigoProducto: '',
                        idCategoria: Number(idCategoria),
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
    )
}