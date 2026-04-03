import {
    Container, Box, Typography,
    Button, Grid, Fade, Divider,
    Autocomplete, TextField, CircularProgress,
    FormControlLabel, Paper, Skeleton, IconButton,
} from "@mui/material";
import {
    ArrowBackRounded, ImageSearchRounded,
    FilePresentRounded, AddRounded
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSchema } from '../../../config/schema.validation';
import RequestGraph from "../../../services/requestGraph";
import RequestHttp from "../../../services/requestHttp";
import { endPoints, queries } from "../../../services/endPoints";
import React, { useEffect, useState } from "react";
import NumberField from "../../../reusable/NumberField";
import {  type Producto } from "../../../helpers/interfaces";
import { NumericFormat } from "react-number-format"
import { IOSSwitch } from "../../../reusable/Switch";
import useSWR from 'swr'
import ItemComboboxCreate from './ItemComboboxCreate';
import AlertComp from '../../../reusable/AlertComp';
import InputFileUpload from '../../../reusable/FileInput';
import ImgViewer from '../../../reusable/ViewImg';

// TYPES
type CategoriasCombobox = {
    descripcion?: string | null
    nombreCategoria: string
    codigoSubCategoria: string
    idCategoria: number
}

type ListOption = {
    id:  number
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

type ProductoStock = {
    estado: number
    idInventario: number
    idProductoInventario: number
    stock: number
    stockMin: number
    stockMax: number
}

type FormProps = z.infer<typeof validationSchema.productoSchema>
type DetailsProps = z.infer<typeof validationSchema.detalleSchema>

type DetailsProducto = {
    idProducto: number
    codigoProducto: string
    idSubCategoria: number
    idTipoProducto: number
    nombreProducto: string
    observaciones?: string | null
    marca: string
    modelo?: string | null
    imagen?: string | null
    caracteristicasEspeciales: string
    fechaRegistro: string
    precio: number
    usuarioRegistro: string
    subCategoria: {
        categoria: {
            idCategoria: number
            codigoSubCategoria: string
        }
    }
    detallesEspecificos: DetailsProps,
    inventarioProductos: ProductoStock[]
}

type GenericItem = {
    descripcion: string
    estado: boolean
    fechaRegistro: string
    nombre: string
    usuarioRegistro: string
    [key: string]: string | boolean | number
}


// CONSTANST
const requestHttp = new RequestHttp
const requestGraph = new RequestGraph
const codigosValidos = ["EC", "ARM", "MOB", "IMP"] as const;
type CodigoDefined = "EC" | "ARM" | "MOB" | "IMP"
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

const ProductoFormSkeleton = () => {
    return (
        <Grid container spacing={2} sx={{ py: 1 }}>
            {[1, 2, 3, 4].map((item) => (
                <Grid key={item} size={{ xs: 12, md: 6, lg: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Skeleton animation="wave" variant="text" width="40%" height={20} sx={{ mb: -1 }} />
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            height={40}
                            sx={{
                                borderRadius: 0.5,
                                width: '100%'
                            }}
                        />
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

const ProductoFormSkeleton2 = () => {
    return (
        <Grid container spacing={2} sx={{ py: 1 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid key={item} size={{ xs: 12, md: 6, lg: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Skeleton variant="text" width="40%" height={20} sx={{ mb: -1 }} />
                        <Skeleton
                            variant="rounded"
                            height={ [5, 6].includes(item) ? 60 : 40}
                            sx={{
                                borderRadius: 0.5,
                                width: '100%'
                            }}
                        />
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

const StockSkeleton = () => {
    return (
        <Grid container spacing={2} sx={{ py: 1 }}>
            {/* SKELETON SECCIÓN STOCK */}
            <Grid
                container
                size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
                sx={{
                    p: 1,
                    borderRadius: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {[1, 2, 3].map((item) => (
                    <Grid key={item} size={12} sx={{ mb: item !== 3 ? 1 : 0 }}>
                        {/* Simula el Label y el Input */}
                        <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem', mb: 0.5 }} />
                        <Skeleton variant="rounded" height={40} />
                    </Grid>
                ))}
            </Grid>

            {/* SKELETON SECCIÓN PRECIOS */}
            <Grid
                container
                size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
                sx={{
                    p: 1,
                    borderRadius: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {[1, 2, 3].map((item) => (
                    <Grid key={item} size={12} sx={{ mb: item !== 3 ? 1 : 0 }}>
                        {/* Simula el Label y el Input */}
                        <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem', mb: 0.5 }} />
                        <Skeleton variant="rounded" height={40} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default function ProductoCreate() {
    const navigate = useNavigate()
    const { id } = useParams()
    const idProducto = Number(id)
    const isEdit = idProducto >= 0 ? true : false
    const {
        control, handleSubmit,
        formState: { errors }, setValue,
        getValues, reset
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
            detallesEspecificos: {
                ramGB: 0,
                cantidadAlm: 0,
                procesador: "",
                capacidadCargador: 0,
                idCalibre: 0,
                idCategoriaImpresora: 0,
                idSistemaDisparo: 0,
                idTipoArma: 0,
                idTipoAlmacenamiento: 0,
                idTipoConexion: 0,
                idTipoDispositivo: 0,
                idTipoImpresion: 0
            }
        }
    })

    const [categorias, setCategorias] = useState<ListOption[]>([])
    const [subCategorias, setSubCat] = useState<ListOption[]>([])
    const [tipoDispositivo, setTipoDispositivo] = useState<ListOption[]>([])
    const [tipoAlmacenamiento, setTipoAlmacenamiento] = useState<ListOption[]>([])
    const [tipoCalibre, setTipoCalibre] = useState<ListOption[]>([])
    const [tipoArma, setTipoArma] = useState<ListOption[]>([])
    const [sistemaDisparo, setSistema] = useState<ListOption[]>([])
    const [tipoProducto, setTipoProducto] = useState<ListOption[]>([])
    const [inventarios, setInventarios] = useState<ListOption[]>([])
    const [codigoSeleccionado, setCodigo] = useState("")
    const [tipoCombobox, setTipo] = useState("")
    const [imgBase64, setImg] = useState("")

    // ALERTA
    const [msgAlert, setMsg] = useState("Registro creado correctamente")
    const [openAlert, setOpenAlert] = useState(false)
    const [severityAlert, setSeverity] = useState<"success" | "warning" | "info" | "error">("success")

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // IMGVIEWER
    const [openImg, setOpeImg] = useState(false)

    const handleCreateItem = (code: number, msg: string) => {
        if (code === 200) {
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

    async function onSubmit(data: FormProps) {
        try {
            const { codigoSubCategoria, ...clearDetails } = data.detallesEspecificos
            console.log(codigoSubCategoria);

            const dataForm: Producto = {
                codigoProducto: data.codigoProducto,
                nombreProducto: data.nombreProducto,
                marca: data.marca,
                modelo: data.modelo,
                observaciones: data.observaciones,
                imagen: imgBase64,
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
                detallesEspecificos: clearDetails
            }

            let result;

            if (isEdit) {
                result = await requestHttp.putProducto(dataForm, Number(id))
            } else {
                result = await requestHttp.postProducto(dataForm)
            }

            handleCreateItem(result?.code, result?.msg)
            if (!isEdit) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // IMPLEMENTACION DE FETCHER
    const useCatalog = (
        endpoint: string,
        idKey: string,
        setState: (data: ListOption[]) => void
    ) => {
        useSWR(endpoint, fetcherItem, {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            revalidateOnMount: true,
            onSuccess: (data) => {
                const items: ListOption[] = data.map((item:  GenericItem) => ({
                    label: item.nombre,
                    id: item[idKey],
                    descripcion: item.descripcion
                }))
                setState(items)
            }
        })
    }

    const fetcher = async ([query, variables]: [string, number]) => {
        const result = await requestGraph.queryGraph(query, variables)
        return result?.findProductoById ?? null;
    }

    const fetcherItem = async(endpoint: string) => {
        const result = await requestHttp.getData(endpoint)
        return result.data
    }

    const { isLoading } = useSWR(
        isEdit ? [queries.GET_PRODUCTO_BY_ID, { idProducto: Number(id) }] : null,
        fetcher,
        {
            // revalidateOnFocus: false,
            // revalidateOnMount: true,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            onSuccess: (data: DetailsProducto) => {
                const categoriaId = data.subCategoria.categoria.idCategoria
                const [code] = data.subCategoria.categoria.codigoSubCategoria.split("-")
                setImg(data?.imagen ?? "")
                setCodigo(code)
                getSubCategorias(categoriaId)

                reset((prev) => ({
                    ...prev,
                    idCategoria: categoriaId,
                    idProducto: data.idProducto,
                    idSubCategoria: data.idSubCategoria,
                    idTipoProducto: data.idTipoProducto,
                    codigoProducto: data.codigoProducto,
                    nombreProducto: data.nombreProducto,
                    observaciones: data.observaciones,
                    caracteristicasEspeciales: data.caracteristicasEspeciales,
                    idInventario: data.inventarioProductos[0].idInventario,
                    stock: data.inventarioProductos[0].stock,
                    stockMin: data.inventarioProductos[0].stockMin,
                    stockMax: data.inventarioProductos[0].stockMax,
                    marca: data.marca,
                    modelo: data.modelo,
                    precio: data.precio,
                    fechaRegistro: data.fechaRegistro,
                    usuarioRegistro: data.usuarioRegistro,
                    detallesEspecificos: data.detallesEspecificos
                }))
            }
        }
    )

    useCatalog(endPoints.getTipoAlm, "idTipoAlmacenamiento", setTipoAlmacenamiento)

    useCatalog(endPoints.getTipoDispositivo, "idTipoDispositivo", setTipoDispositivo)

    useCatalog(endPoints.getTipoCalibre, "idCalibre", setTipoCalibre)

    useCatalog(endPoints.getTipoArma, "idTipoArma", setTipoArma)

    useCatalog(endPoints.getSistemaDisparo, "idSistemaDisparo", setSistema)

    // const { mutate: reloadTipoAlm } = useSWR(endPoints.getTipoAlm, fetcherItem)
    // const { mutate: reloadTipoDispositivo } = useSWR(endPoints.getTipoDispositivo, fetcherItem)
    // const { mutate: reloadTipoCalibre } = useSWR(endPoints.getTipoCalibre, fetcherItem)
    // const { mutate: reloadArma } = useSWR(endPoints.getTipoArma, fetcherItem)
    // const { mutate: reloadSistemDisparo } = useSWR(endPoints.getSistemaDisparo, fetcherItem)

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

    useEffect(() => {
        if (isEdit) {
            const idCategoria = getValues("idCategoria")
            const categoria = categorias.find(item => item.id === idCategoria)

            if (categoria?.codigo && codigosValidos.includes(categoria?.codigo as CodigoDefined)) {
                setValue(
                    "detallesEspecificos.codigoSubCategoria",
                    categoria?.codigo as typeof codigosValidos[number]
                )
            }
        }
    }, [categorias, getValues, isEdit, setValue, idProducto])

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
                        { isEdit ? 'Editar Producto' : 'Nuevo Producto' }
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* <Tooltip title="Volver">
                        <IconButton onClick={() => {
                            navigate(-1)
                        }}>
                            <ArrowBackRounded />
                        </IconButton>
                    </Tooltip> */}
                    <IconButton onClick={() => {
                        navigate(-1)
                    }}>
                        <ArrowBackRounded />
                    </IconButton>
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

                                { isLoading ? (
                                    <ProductoFormSkeleton />
                                ) :
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
                                                        readOnly={isEdit}
                                                        value={categorias.find(c => c.id === field.value) || null}
                                                        getOptionLabel={(option) => option?.label ?? ""}
                                                        onChange={(_, data) => {
                                                            field.onChange(data?.id || 0)
                                                            const value = data?.id || 0
                                                            getSubCategorias(value)

                                                            if (data?.codigo && codigosValidos.includes(data.codigo as CodigoDefined)) {
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
                                                                    },
                                                                    input: {
                                                                        ...params?.InputProps
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
                                                        readOnly={isEdit}
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
                                                                        ...params?.InputProps,
                                                                        endAdornment: (
                                                                            <React.Fragment>
                                                                                { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                            </React.Fragment>
                                                                        ),
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
                                                render={({ field }) => (
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
                                }

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

                                    <Box>
                                        <IconButton color="primary" onClick={() => {
                                            setOpeImg(true)
                                        }}>
                                            <ImageSearchRounded />
                                        </IconButton>
                                        <InputFileUpload onSuccess={(imgBase64: string) => {
                                            setImg(imgBase64)
                                        }}/>
                                    </Box>
                                </Box>

                                <Divider />

                                { isLoading ? (
                                    <ProductoFormSkeleton2 />
                                ) :
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
                                }


                                {/* CONTROL DE INVENTARIO */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Control de Inventario
                                </Typography>

                                <Divider />

                                { isLoading ? (
                                    <StockSkeleton />
                                ) :
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
                                                            readOnly={isEdit}
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
                                                            readOnly={isEdit}
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
                                                            readOnly={isEdit}
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
                                }

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
                                                    render={({ field, fieldState }) => (
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 4,
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Button color="secondary" variant="contained"
                                                                sx={{
                                                                    "&.MuiButtonBase-root": {
                                                                        borderRadius: .5,
                                                                        minWidth: 0,
                                                                    },
                                                                }}
                                                                onClick={() => {
                                                                    setOpen(true)
                                                                    setTipo("tdis")
                                                                }}
                                                            >
                                                                <AddRounded sx={{ color: 'white' }}/>
                                                            </Button>
                                                            <Autocomplete
                                                                options={tipoDispositivo}
                                                                id="idTipoDispositivo"
                                                                size="small"
                                                                fullWidth
                                                                value={tipoDispositivo.find(c => c.id === field.value) || null}
                                                                getOptionLabel={(option) => option?.label ?? ""}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data?.id || 0)
                                                                }}
                                                                renderInput={(params) => {
                                                                        return (
                                                                            <TextField {...params} label="Tipos de Dispositivos"
                                                                                placeholder="Elija un tipo de dispositivo"
                                                                                error={!!fieldState.error}
                                                                                helperText={fieldState.error?.message}
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
                                                                                        ...params?.InputProps,
                                                                                        endAdornment: (
                                                                                            <React.Fragment>
                                                                                                { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                                            </React.Fragment>
                                                                                        ),
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idTipoAlmacenamiento"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 4,
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Button color="secondary" variant="contained"
                                                                sx={{
                                                                    "&.MuiButtonBase-root": {
                                                                        borderRadius: .5,
                                                                        minWidth: 0,
                                                                    },
                                                                }}
                                                                onClick={() => {
                                                                    setOpen(true)
                                                                    setTipo("talm")
                                                                }}
                                                            >
                                                                <AddRounded sx={{ color: 'white' }}/>
                                                            </Button>
                                                            <Autocomplete
                                                                options={tipoAlmacenamiento}
                                                                id="idTipoAlmacenamiento"
                                                                size="small"
                                                                fullWidth
                                                                value={tipoAlmacenamiento.find(c => c.id === field.value) || null}
                                                                getOptionLabel={(option) => option?.label ?? ""}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data?.id || 0)
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Tipo de Almacenamiento"
                                                                        placeholder="Elija un tipo de almacenamiento"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
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
                                                                                ...params?.InputProps,
                                                                                endAdornment: (
                                                                                    <React.Fragment>
                                                                                        { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                                    </React.Fragment>
                                                                                ),
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.procesador"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            id="procesador"
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
                                                    render={({ field, fieldState }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="ramGB"
                                                            label="Cantidad Memoria Ram"
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                            min={1} max={1000}
                                                            size="small"
                                                            error={!!fieldState.error}
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
                                                    render={({ field, fieldState }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="cantidadAlm"
                                                            label="Capacidad de almacenamiento"
                                                            error={!!fieldState.error}
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
                                                    render={({ field, fieldState }) => (
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 4,
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Button color="secondary" variant="contained"
                                                                sx={{
                                                                    "&.MuiButtonBase-root": {
                                                                        borderRadius: .5,
                                                                        minWidth: 0,
                                                                    },
                                                                }}
                                                                onClick={() => {
                                                                    setOpen(true)
                                                                    setTipo("tcal")
                                                                }}
                                                            >
                                                                <AddRounded sx={{ color: 'white' }}/>
                                                            </Button>
                                                            <Autocomplete
                                                                options={tipoCalibre}
                                                                id="idCalibre"
                                                                size="small"
                                                                fullWidth
                                                                value={tipoCalibre.find(c => c.id === field.value) || null}
                                                                getOptionLabel={(option) => option?.label ?? ""}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data?.id || 0)
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Tipo de Calibre"
                                                                        placeholder="Elija un tipo de calibre"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
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
                                                                                ...params?.InputProps,
                                                                                endAdornment: (
                                                                                    <React.Fragment>
                                                                                        { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                                    </React.Fragment>
                                                                                ),
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idTipoArma"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 4,
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Button color="secondary" variant="contained"
                                                                sx={{
                                                                    "&.MuiButtonBase-root": {
                                                                        borderRadius: .5,
                                                                        minWidth: 0,
                                                                    },
                                                                }}
                                                                onClick={() => {
                                                                    setOpen(true)
                                                                    setTipo("tarm")
                                                                }}
                                                            >
                                                                <AddRounded sx={{ color: 'white' }}/>
                                                            </Button>
                                                            <Autocomplete
                                                                options={tipoArma}
                                                                id="idTipoArma"
                                                                size="small"
                                                                fullWidth
                                                                value={tipoArma.find(c => c.id === field.value) || null}
                                                                getOptionLabel={(option) => option?.label ?? ""}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data?.id || 0)
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Tipo de Arma"
                                                                        placeholder="Elija un tipo de arma"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
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
                                                                                ...params?.InputProps,
                                                                                endAdornment: (
                                                                                    <React.Fragment>
                                                                                        { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                                    </React.Fragment>
                                                                                ),
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.idSistemaDisparo"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 4,
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Button color="secondary" variant="contained"
                                                                sx={{
                                                                    "&.MuiButtonBase-root": {
                                                                        borderRadius: .5,
                                                                        minWidth: 0,
                                                                    },
                                                                }}
                                                                onClick={() => {
                                                                    setOpen(true)
                                                                    setTipo("sd")
                                                                }}
                                                            >
                                                                <AddRounded sx={{ color: 'white' }}/>
                                                            </Button>
                                                            <Autocomplete
                                                                options={sistemaDisparo}
                                                                id="idSistemaDisparo"
                                                                size="small"
                                                                fullWidth
                                                                value={sistemaDisparo.find(c => c.id === field.value) || null}
                                                                getOptionLabel={(option) => option?.label ?? ""}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data?.id || 0)
                                                                }}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Sistema de Disparo"
                                                                        placeholder="Elija el sistema de disparo del arma"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
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
                                                                                ...params?.InputProps,
                                                                                endAdornment: (
                                                                                    <React.Fragment>
                                                                                        { loading ? <CircularProgress color="info" size={20} /> : null }
                                                                                    </React.Fragment>
                                                                                ),
                                                                            }
                                                                        }}
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                                <Controller
                                                    name="detallesEspecificos.numSerie"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <TextField
                                                            {...field}
                                                            id="numSerie"
                                                            type="text"
                                                            size="small"
                                                            label="Num. Serie"
                                                            placeholder="Ingrese el numero de serie del arma"
                                                            fullWidth
                                                            error={!!fieldState.error}
                                                            helperText={fieldState.error?.message}
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
                                                    render={({ field, fieldState }) => (
                                                        <NumberField
                                                            {...field}
                                                            id="capacidadCargador"
                                                            label="Capacidad del cargador"
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                            }}
                                                            min={1} max={1000}
                                                            size="small"
                                                            error={!!fieldState.error?.message}
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

                <ItemComboboxCreate open={open} onClose={() => {
                        setOpen(false)
                        setLoading(true)
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    }} tipo={tipoCombobox}
                    onSuccess={handleCreateItem}
                />

                {openAlert && (
                    <AlertComp severity={severityAlert} message={msgAlert}/>
                )}

                <ImgViewer open={openImg} onClose={() => {
                    setOpeImg(false)
                }} img={imgBase64} />
            </Container>
        </Fade>
    )
}