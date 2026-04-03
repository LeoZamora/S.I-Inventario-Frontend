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
import type { Categoria } from "../../../helpers/interfaces";
import RequestHttp from "../../../services/requestHttp";
import RequestGraph from "../../../services/requestGraph";
import { queries } from "../../../services/endPoints";

type Props = {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
    idCategoria: number | null
}

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph

type FormProps = z.infer<typeof validationSchema.categoriasSchema>

const usuarioRegistro: string = 'dba'

export default function CategoriaCreate({ open = false, onClose, isEdit, idCategoria }: Props) {
    const {
        control, handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema.categoriasSchema),
        defaultValues: { nombre: '', codigo: ''}
    })
    const [shakeDialog, setShakeDialog] = useState(false)
    const title = isEdit ? 'Editar Categoría' : 'Nueva Categoría'

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: Categoria = {
                nombreCategoria: data.nombre,
                codigoSubCategoria: data.codigo,
                descripcion: data.descripcion ?? null,
                usuarioRegistro: usuarioRegistro
            }

            const result = await requestHttp.postCategoria(dataForm)
            if (result?.code === 200) {
                onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        async function getCategoriaById(id: number | null) {
            if (!id) return

            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_CATEGORIA_BY_ID,
                    { idCategoria: id }
                )

                const categoria = result?.finCategoryById

                if (categoria) {
                    reset({
                        nombre: categoria.nombreCategoria,
                        codigo: categoria.codigoSubCategoria,
                        descripcion: categoria.descripcion
                    })
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (isEdit) {
            getCategoriaById(idCategoria)
        } else {
            reset({
                nombre: '',
                codigo: '',
                descripcion: ''
            })
        }

    }, [isEdit, idCategoria, reset])

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
                codigo: '',
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
                                        // required
                                        helperText={errors.nombre?.message}
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
                                name="codigo"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="codigo"
                                        label="Código para SubCategorías"
                                        type="text"
                                        size="small"
                                        placeholder="Ingrese el código para las subcategorías"
                                        error={!!errors.codigo}
                                        // required
                                        helperText={errors.codigo?.message}
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
                                        // error={!!errors.descripcion}
                                        // required
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
                        codigo: '',
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