import {
    Container, Box, Typography, Tooltip,
    IconButton, Grid, Fade, Divider,
    Autocomplete, TextField, CircularProgress,
    FormControlLabel, Paper
} from "@mui/material";
import {
    ArrowBackRounded, ImageSearchRounded,
    FilePresentRounded
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSchema } from "../../../config/schema.validation";
import RequestGraph from "../../../services/requestGraph";
import RequestHttp from "../../../services/requestHttp";
import { queries } from "../../../services/endPoints";
import React, { useEffect, useState } from "react";
import NumberField from "../../../reusable/NumberField";
import { NumericFormat } from "react-number-format"
import { IOSSwitch } from "../../../reusable/Switch";
import { Button } from '@mui/material';
import type { Producto } from "../../../helpers/interfaces";

// TYPES
type CategoriasCombobox = {
    descripcion?: string | null
    nombreCategoria: string
    codigoSubCategoria: string
    idCategoria: number
}

type ListOption = {
    id: number
    label: string
    description?: string
    codigo?: string
}

type SubCategoriaCombobox = {
    codigoSubCategoria: string
    idSubCategoria: number
    nombre: string
    descripcion?: string | null
}

type InventarioCombobox = {
    idInventario: number
    nombreInventario: string
    codigoInventario: string
}

type TipoProductoCombobox = {
    idTipoProducto: number
    nombre: string
    descripcion?: string | null
}

type FormProps = z.infer<typeof validationSchema.productoSchema>

// CONSTANST
const requestHttp = new RequestHttp
const requestGraph = new RequestGraph
const codigosValidos = ["EC", "ARM", "MOB", "IMP"] as const;
const usuarioRegistro = 'dba'

// COMPONENTS

const LoaderScreen = () => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: "60vh"
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <FilePresentRounded
                        sx={{
                            fontSize: 80,
                            color: 'text.secondary',
                            mb: 2,
                            animation: 'pulse 2s infinite ease-in-out',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)', opacity: 1 },
                                '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                                '100%': { transform: 'scale(1)', opacity: 1 },
                            }
                        }}
                    />
                    <Typography variant="body1" color="text.secondary">
                        Datos Especificos del Producto
                    </Typography>
                </Paper>
            </Box>
        </Container>
    )
}

export default function ProductoCreate() {
    const navigate = useNavigate()
    const {
        control, handleSubmit,
        formState: { errors }, setValue,
        getValues
    } = useForm({
        resolver: zodResolver(validationSchema.productoSchema),
        defaultValues: {
            idCategoria: 0,
            idSubCategoria: 0,
            idInventario: 0,
            idTipoProducto: 0,

            codigoProducto: "",
            nombreProducto: "",
            marca: "",
            modelo: "",
            observaciones: "",
            caracteristicasEspeciales: "",
            imagen: "",

            stock: 0,
            stockMin: 0,
            stockMax: 0,
            precio: 0.00,
            precioDolares: 0.00,
            total: 0.00,

            usuarioRegistro: usuarioRegistro,
            detallesEspecificos: {}
        }
    })

    const [categorias, setCategorias] = useState<ListOption[]>([])
    const [subCategorias, setSubCat] = useState<ListOption[]>([])
    const [tipoProducto, setTipoProducto] = useState<ListOption[]>([])
    const [inventarios, setInventarios] = useState<ListOption[]>([])
    const [codigoSeleccionado, setCodigo] = useState("")
    const [loading, setLoading] = useState(false)

    async function onSubmit(data: FormProps) {
        try {
            const dataForm: Producto = {
                codigoProducto: data.codigoProducto,
                nombreProducto: data.nombreProducto,
                marca: data.marca,
                modelo: data.modelo,
                observaciones: data.observaciones,
                imagen: data.imagen,
                caracteristicasEspeciales: data.caracteristicasEspeciales,
                precio: data.precio,
                stock: data.stock,
                stockMin: data.stockMin,
                stockMax: data.stockMax,
                usuarioRegistro: usuarioRegistro,
                idSubCategoria: data.idSubCategoria,
                idCategoria: data.idCategoria,
                idTipoProducto: data.idTipoProducto,
                idInventario: data.idInventario,
                detallesEspecificos: null
            }

            const result = await requestHttp.postProducto(dataForm)

            if (result?.code === 200) {
                console.log(result.msg);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getSubCategorias(id: number) {
        try {
            setLoading(true)
            const result = await requestGraph.queryGraph(
                queries.GET_SUBCATEGORIA_COMBOBOX,
                { idCategoria: id }
            )
            setLoading(false)

            const subCategoria = result?.finSubCategoryByCategory

            if (subCategoria) {
                setSubCat(subCategoria.map((item: SubCategoriaCombobox) => {
                    return {
                        label: `${item.codigoSubCategoria} - ${item.nombre}`,
                        id: Number(item.idSubCategoria),
                        description: item.descripcion,
                        codigo: item.codigoSubCategoria
                    }
                }))
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getCodigoProducto(id: number): Promise<string> {
        const result = await requestHttp.getCodigoProducto(id)

        if (typeof result?.code === "string") {
            return result.code
        }

        return 'failed'
    }

    useEffect(() => {
        async function getData() {
            try {
                const result = await requestGraph.queryGraph(
                    queries.GET_CATEGORIA_COMBOBOX,
                )
                const categoria = result?.findAllCategories

                const result2 = await requestGraph.queryGraph(
                    queries.GET_TIPO_PRODUCTOS_COMBOBOX,
                )
                const tipoProductos = result2?.findTipoProducto

                const result3 = await requestGraph.queryGraph(
                    queries.GET_INVENTARIO_COMBOBOX,
                )
                const inventarios = result3?.findInventarios

                if (categoria) {
                    setCategorias(categoria.map((item: CategoriasCombobox) => {
                        return {
                            label: `${item.codigoSubCategoria} - ${item.nombreCategoria}`,
                            id: Number(item.idCategoria),
                            description: item.descripcion,
                            codigo: item.codigoSubCategoria
                        }
                    }))

                    setTipoProducto(tipoProductos.map((item: TipoProductoCombobox) => {
                        return {
                            label: item.nombre,
                            id: Number(item.idTipoProducto),
                            description: item.descripcion
                        }
                    }))

                    setInventarios(inventarios.map((item: InventarioCombobox) => {
                        return {
                            label: `${item.codigoInventario} - ${item.nombreInventario}`,
                            id: Number(item.idInventario),
                        }
                    }))
                }
            } catch (error) {
                console.log(error);
            }
        }

        getData()
    }, [])

    return (
        <Fade in>
            <Container sx={{
                pb: 2
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" fontWeight={600}>
                        Nuevo Producto
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
                    onSubmit={handleSubmit(onSubmit)}
                    id="subscription-form"
                >
                    <Grid container spacing={2}>
                        <Grid  size={{ xs: 12, md: 12, lg: 8 }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                border: "1px solid",
                                borderColor: 'divider',
                                p: 1,
                                borderRadius: .5,
                            }}>

                                {/* CLASIFICIACION */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Clasificación del Producto
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} sx={{ py: 1 }}>
                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="idCategoria"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={categorias}
                                                    id="idCategoria"
                                                    size="small"
                                                    fullWidth
                                                    value={categorias.find(c => c.id === field.value) || null}
                                                    getOptionLabel={(option) => option?.label ?? ""}
                                                    onChange={(_, data) => {
                                                        field.onChange(data?.id || 0)
                                                        const value = data?.id || 0
                                                        getSubCategorias(value)

                                                        if (data?.codigo && codigosValidos.includes(data.codigo as any)) {
                                                            setCodigo(data.codigo)
                                                            setValue(
                                                                "detallesEspecificos.codigoSubCategoria",
                                                                data.codigo as typeof codigosValidos[number]
                                                            )
                                                        }
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Categorias"
                                                            placeholder="Elija una categoria"
                                                            error={!!errors.idCategoria}
                                                            helperText={errors.idCategoria?.message}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: 0.5
                                                                }
                                                            }}
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="idSubCategoria"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={subCategorias}
                                                    value={subCategorias.find((s) => s.id === field.value) || null}
                                                    getOptionLabel={(option) => option.label ?? ""}
                                                    id="idSubCategoria"
                                                    size="small"
                                                    fullWidth
                                                    onChange={async (_, data) => {
                                                        field.onChange(data?.id || 0)

                                                        if (data?.id) {
                                                            setValue(
                                                                "codigoProducto",
                                                                await getCodigoProducto(data.id)
                                                            )
                                                        }
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="SubCategorias"
                                                            placeholder="Elija una subcategoria"
                                                            error={!!errors.idSubCategoria}
                                                            helperText={errors.idSubCategoria?.message}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: 0.5
                                                                }
                                                            }}
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true
                                                                },
                                                                input: {
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <React.Fragment>
                                                                            { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                        </React.Fragment>
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="idTipoProducto"
                                            control={control}
                                            render={({ field}) => (
                                                <Autocomplete
                                                    options={tipoProducto}
                                                    id="idTipoProducto"
                                                    size="small"
                                                    fullWidth
                                                    value={tipoProducto.find(t => t.id === field.value) || null}
                                                    getOptionLabel={(option) => option?.label ?? ""}
                                                    onChange={(_, data) => {
                                                        field.onChange(data?.id || 0)
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Tipo de Producto"
                                                            placeholder="Elija un tipo de producto"
                                                            error={!!errors.idTipoProducto}
                                                            helperText={errors.idTipoProducto?.message}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: 0.5
                                                                }
                                                            }}
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="idInventario"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    value={inventarios.find((i) => i.id === field.value) || null}
                                                    getOptionLabel={(option) => option.label ?? ""}
                                                    options={inventarios}
                                                    onChange={(_, data) => {
                                                        field.onChange(data?.id || 0)
                                                    }}
                                                    id="idInventario"
                                                    size="small"
                                                    fullWidth
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Inventarios"
                                                            placeholder="Elija un inventario para asignar"
                                                            error={!!errors.idInventario}
                                                            helperText={errors.idInventario?.message}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: 0.5
                                                                }
                                                            }}
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true
                                                                },
                                                            }}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>


                                {/* DATOS GENERALES */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        component="h6"
                                        variant="body1"
                                    >
                                        Datos Generales del Producto
                                    </Typography>

                                    <Tooltip title="Agregar imagen"
                                        placement="top" arrow
                                        slotProps={{
                                            tooltip: {
                                                sx: {
                                                    borderRadius: .5
                                                }
                                            }
                                        }}
                                    >
                                        <IconButton color="primary">
                                            <ImageSearchRounded />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Divider />

                                <Grid container spacing={2} sx={{ py: 1 }}>
                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="codigoProducto"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="codigoProducto"
                                                    type="text"
                                                    size="small"
                                                    label="Codigo de Producto"
                                                    placeholder="Codigo del producto"
                                                    error={!!errors.codigoProducto}
                                                    helperText={errors.codigoProducto?.message}
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

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="nombreProducto"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="nombreProducto"
                                                    type="text"
                                                    size="small"
                                                    label="Nombre de Producto"
                                                    placeholder="Ingrese el nombre del producto"
                                                    error={!!errors.nombreProducto}
                                                    helperText={errors.nombreProducto?.message}
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

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="marca"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="marca"
                                                    type="text"
                                                    size="small"
                                                    label="Marca del Producto"
                                                    error={!!errors.marca}
                                                    helperText={errors.marca?.message}
                                                    placeholder="Ingrese la marca del producto"
                                                    fullWidth
                                                    variant="outlined"
                                                    slotProps={{
                                                        inputLabel: {
                                                            shrink: true
                                                        },
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

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="modelo"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="modelo"
                                                    type="text"
                                                    size="small"
                                                    label="Modelo de Producto"
                                                    placeholder="Ingrese el modelo del producto"
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

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="observaciones"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="observaciones"
                                                    type="text"
                                                    size="small"
                                                    label="Observaciones"
                                                    placeholder="Ingrese algunas observaciones"
                                                    fullWidth
                                                    multiline
                                                    rows={4}
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

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="caracteristicasEspeciales"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="caracteristicasEspeciales"
                                                    type="text"
                                                    size="small"
                                                    label="Caracteristicas Especiales"
                                                    placeholder="Ingrese algunas caracteristicas particulares del producto"
                                                    fullWidth
                                                    multiline
                                                    rows={4}
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

                                {/* CONTROL DE INVENTARIO */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Control de Inventario
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} sx={{ py: 1 }}>
                                    <Grid container size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
                                        sx={{
                                            p: 1,
                                            borderRadius: .5,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <Controller
                                                name="stockMin"
                                                control={control}
                                                render={({ field }) => (
                                                    <NumberField
                                                        {...field}
                                                        id="stockMin"
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                        }}
                                                        label="Stock Min"
                                                        min={1} max={1000}
                                                        size="small"
                                                        error={!!errors.stockMin}
                                                        style={{
                                                            borderRadius: .5
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <Controller
                                                name="stockMax"
                                                control={control}
                                                render={({ field }) => (
                                                    <NumberField
                                                        {...field}
                                                        id="stockMax"
                                                        label="Stock Max"
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                        }}
                                                        min={1} max={1000}
                                                        size="small"
                                                        error={!!errors.stockMin}
                                                        style={{
                                                            borderRadius: .5
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <Controller
                                                name="stock"
                                                control={control}
                                                render={({ field }) => (
                                                    <NumberField
                                                        {...field}
                                                        id="stock"
                                                        label="Stock"
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                            const precio: number = Number(
                                                                String(getValues("precio")).replace(/[^\d.-]/g, "")
                                                            )
                                                            setValue("total", Number(value) * Number(precio))
                                                        }}
                                                        min={1} max={1000}
                                                        size="small"
                                                        error={!!errors.stockMin}
                                                        style={{
                                                            borderRadius: .5
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
                                        sx={{
                                            p: 1,
                                            borderRadius: .5,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <Controller
                                                name="precio"
                                                control={control}
                                                render={({ field: { onChange, value }}) => (
                                                    <NumericFormat
                                                        id="precio"
                                                        thousandSeparator
                                                        valueIsNumericString={false}
                                                        prefix="C$"
                                                        value={value}
                                                        onValueChange={(e) => {
                                                            const newVal = e.floatValue || 0
                                                            onChange(newVal)

                                                            const stock: number = Number(getValues("stock"))

                                                            setValue(
                                                                "precioDolares",
                                                                Number(Number(newVal / 36.6243).toFixed(4))
                                                            )

                                                            setValue(
                                                                "total",
                                                                stock * newVal
                                                            )
                                                        }}
                                                        fullWidth
                                                        error={!!errors.precio}
                                                        helperText={errors.precio?.message}
                                                        placeholder="Ingrese el precio unitario"
                                                        label="Precio unitario"
                                                        size="small"
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                borderRadius: 0.5
                                                            }
                                                        }}
                                                        slotProps={{
                                                            inputLabel: {
                                                                shrink: true,
                                                            },
                                                        }}
                                                        customInput={TextField}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <Controller
                                                name="precioDolares"
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <NumericFormat
                                                        id="precioDolares"
                                                        thousandSeparator
                                                        valueIsNumericString={false}
                                                        prefix="$"
                                                        value={value}
                                                        fullWidth
                                                        error={!!errors.precio}
                                                        helperText={errors.precio?.message}
                                                        placeholder="Ingrese el precio unitario"
                                                        label="Precio en dolares"
                                                        size="small"
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                borderRadius: 0.5
                                                            }
                                                        }}
                                                        slotProps={{
                                                            inputLabel: {
                                                                shrink: true,
                                                            },
                                                            input: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        customInput={TextField}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <Controller
                                                name="total"
                                                control={control}
                                                render={({ field }) => (
                                                    <NumericFormat
                                                        {...field}
                                                        id="total"
                                                        thousandSeparator
                                                        valueIsNumericString
                                                        prefix="C$"
                                                        fullWidth
                                                        error={!!errors.precio}
                                                        helperText={errors.precio?.message}
                                                        placeholder="Ingrese el precio unitario"
                                                        label="Total"
                                                        size="small"
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                borderRadius: 0.5
                                                            }
                                                        }}
                                                        slotProps={{
                                                            inputLabel: {
                                                                shrink: true,
                                                            },
                                                            input: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        customInput={TextField}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12, lg: 4 }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                border: "1px solid",
                                borderColor: 'divider',
                                p: 1,
                                borderRadius: .5,
                            }}>
                                {/* DETALLES ESPECIFICOS */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Detalles Específicos
                                </Typography>

                                <Divider />

                                <Grid container size={{ xs: 12, md: 12, lg: 12 }} spacing={2}
                                    sx={{
                                        py: 1
                                    }}
                                >
                                    {/* DISPOSTIVOS ELECTRONICOS */}
                                    {codigoSeleccionado === "EC" && (
                                        <Grid container size={{ xs: 12, md: 12, lg: 12 }}>
                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idTipoDispositivo"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            options={categorias}
                                                            id="idTipoDispositivo"
                                                            size="small"
                                                            fullWidth
                                                            value={categorias.find(c => c.id === field.value) || null}
                                                            getOptionLabel={(option) => option?.label ?? ""}
                                                            onChange={(_, data) => {
                                                                field.onChange(data?.id || 0)
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField {...params} label="Tipos de Dispositivos"
                                                                    placeholder="Elija un tipo de dispositivo"
                                                                    error={!!errors.detallesEspecificos?.idTipoDispositivo}
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: 0.5
                                                                        }
                                                                    }}
                                                                    slotProps={{
                                                                        inputLabel: {
                                                                            shrink: true
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idTipoAlmacenamiento"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            options={categorias}
                                                            id="idTipoAlmacenamiento"
                                                            size="small"
                                                            fullWidth
                                                            value={categorias.find(c => c.id === field.value) || null}
                                                            getOptionLabel={(option) => option?.label ?? ""}
                                                            onChange={(_, data) => {
                                                                field.onChange(data?.id || 0)
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField {...params} label="Tipo de Almacenamiento"
                                                                    placeholder="Elija un tipo de almacenamiento"
                                                                    error={!!errors.detallesEspecificos?.idTipoAlmacenamiento}
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: 0.5
                                                                        }
                                                                    }}
                                                                    slotProps={{
                                                                        inputLabel: {
                                                                            shrink: true
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.procesador"
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <TextField
                                                            id="procesador"
                                                            value={value ?? null}
                                                            type="text"
                                                            size="small"
                                                            label="Procesador"
                                                            placeholder="Ingrese el procesador del dispositivo"
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

                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.ramGB"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="ramGB"
                                                            label="Cantidad Memoria Ram"
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                            min={1} max={1000}
                                                            size="small"
                                                            error={!!errors.detallesEspecificos?.ramGB}
                                                            style={{
                                                                borderRadius: .5
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.cantidadAlm"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="cantidadAlm"
                                                            label="Capacidad de almacenamiento"
                                                            error={!!errors.detallesEspecificos?.cantidadAlm}
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                            min={1} max={1000}
                                                            size="small"
                                                            style={{
                                                                borderRadius: .5
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}

                                    {/* ARMAS */}
                                    {codigoSeleccionado === "ARM" && (
                                        <Grid container size={{ xs: 12, md: 12, lg: 12 }}>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.licencia"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel
                                                            id="licencia"
                                                            label="Licencia vigente"
                                                            labelPlacement="start"
                                                            {...field}
                                                            control={
                                                                <IOSSwitch
                                                                    sx={{ ml: 10 }}
                                                                    checked={!!field.value}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        field.onChange(isChecked);
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idCalibre"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            options={categorias}
                                                            id="idCalibre"
                                                            size="small"
                                                            fullWidth
                                                            value={categorias.find(c => c.id === field.value) || null}
                                                            getOptionLabel={(option) => option?.label ?? ""}
                                                            onChange={(_, data) => {
                                                                field.onChange(data?.id || 0)
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField {...params} label="Tipo de Calibre"
                                                                    placeholder="Elija un tipo de calibre"
                                                                    error={!!errors.detallesEspecificos?.idCalibre}
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: 0.5
                                                                        }
                                                                    }}
                                                                    slotProps={{
                                                                        inputLabel: {
                                                                            shrink: true
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idTipoArma"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            options={categorias}
                                                            id="idTipoArma"
                                                            size="small"
                                                            fullWidth
                                                            value={categorias.find(c => c.id === field.value) || null}
                                                            getOptionLabel={(option) => option?.label ?? ""}
                                                            onChange={(_, data) => {
                                                                field.onChange(data?.id || 0)
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField {...params} label="Tipo de Arma"
                                                                    placeholder="Elija un tipo de arma"
                                                                    error={!!errors.detallesEspecificos?.idTipoArma}
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: 0.5
                                                                        }
                                                                    }}
                                                                    slotProps={{
                                                                        inputLabel: {
                                                                            shrink: true
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idSistemaDisparo"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            options={categorias}
                                                            id="idSistemaDisparo"
                                                            size="small"
                                                            fullWidth
                                                            value={categorias.find(c => c.id === field.value) || null}
                                                            getOptionLabel={(option) => option?.label ?? ""}
                                                            onChange={(_, data) => {
                                                                field.onChange(data?.id || 0)
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField {...params} label="Sistema de Disparo"
                                                                    placeholder="Elija el sistema de disparo del arma"
                                                                    error={!!errors.detallesEspecificos?.idSistemaDisparo}
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: 0.5
                                                                        }
                                                                    }}
                                                                    slotProps={{
                                                                        inputLabel: {
                                                                            shrink: true
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.numSerie"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            id="numSerie"
                                                            type="text"
                                                            size="small"
                                                            label="Num. Serie"
                                                            placeholder="Ingrese el numero de serie del arma"
                                                            fullWidth
                                                            error={!!errors.detallesEspecificos?.numSerie}
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
                                                    name="detallesEspecificos.material"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            id="material"
                                                            type="text"
                                                            size="small"
                                                            label="Material del Arma"
                                                            placeholder="Ingrese el material fisico del arma"
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

                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.capacidadCargador"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="capacidadCargador"
                                                            label="Capacidad del cargador"
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                            min={1} max={1000}
                                                            size="small"
                                                            error={!!errors.detallesEspecificos?.capacidadCargador}
                                                            style={{
                                                                borderRadius: .5
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.longitudCanon"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="longitudCanon"
                                                            label="Longitud de cañon"
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                            min={1} max={1000}
                                                            size="small"
                                                            style={{
                                                                borderRadius: .5
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}

                                    {/* PANTALLA DE CARGA */}
                                    {!codigoSeleccionado && (
                                        <LoaderScreen />
                                    )}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "end",
                            alignItems: 'center'
                        }}
                    >
                        <Button onClick={() => {}}
                            color="secondary"
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
                                ml: 2,
                                "&.MuiButtonBase-root": {
                                    borderRadius: .5
                                }
                            }}
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Fade>
    )
}