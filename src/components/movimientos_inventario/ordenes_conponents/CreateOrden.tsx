import {
    Container, Box, Typography,
    Button, Grid, Fade, Divider,
    Autocomplete, TextField,
    IconButton,
    FormControl, MenuItem, InputLabel, FormHelperText,
    Select
} from "@mui/material";
import {
    AddRounded,
    ArrowBackRounded,
    DeleteRounded
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { validationSchema } from '../../../config/schema.validation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import RequestHttp from "../../../services/requestHttp";
import RequestGraph from "../../../services/requestGraph";
import z from "zod";
import { queries } from "../../../services/endPoints";
import useSWR from "swr";
import NumberField from "../../../reusable/NumberField";
import { NumericFormat } from "react-number-format";
import { DataGridPremium, useGridApiRef, type GridCellParams, type GridColDef } from '@mui/x-data-grid-premium';
import { formatCurrency } from "../../../helpers/helpers";
import type { DetailsOrden, Orden, ProductoGQL } from "../../../helpers/interfaces";
import AlertComp from "../../../reusable/AlertComp";
import { Delete } from '@mui/icons-material';
import type { estadoSolicitud, SolicitudByID } from "../../../helpers/types";

const requestHttp = new RequestHttp
const requestGraph = new RequestGraph
const usuarioRegistro = 'dba'
const schema = z.object({
    orden: validationSchema.ordenesSchema,
    details: validationSchema.detailsProductSchema
})

type TipoOrden = {
    nombre: string
    descripcion: string
    fechaRegistro: string
    [key: string]: string | number
}

type ItemTable = {
    idDetalleOrden?: number | null
    idOrden?: number | null
    codigoProducto: string
    nombreProducto: string
    precioUnitario: number
    idProducto: number
    cantidad: number
    observaciones: string | null
    total: number
}

type SolicitudCombobox = {
    idSolicitud: number
    codigoSolicitud: string
    solicitante: string
    estadoSolicitud: estadoSolicitud[]
    orden: {
        idOrden: number
        codigoOrden: string
    }[]
}

type ListOption = {
    id: string | number
    label: string
    description: string | null
    codigo: string | null
}

type InventarioCombobox = {
    idInventario: number
    nombreInventario: string
    codigoInventario: string
}


export default function CreateOrden() {
    const navigate = useNavigate()

    // TABLE
    const apiRef = useGridApiRef()
    const [rows, setRows] = useState<ItemTable[]>([]);

    // FORM
    const [tipoOrden, setTipoOrden] = useState<ListOption[]>([])
    const [productos, setProductosInv] = useState<ProductoGQL[]>()
    const [productosList, setProductos] = useState<ListOption[]>()
    const [solicitudes, setSolicitudes] = useState<ListOption[]>([])
    const [inventarios, setInventarios] = useState<ListOption[]>([])

    // ALERT
    const [msgAlert, setMsg] = useState("Registro creado correctamente")
    const [openAlert, setOpenAlert] = useState(false)
    const [severityAlert, setSeverity] = useState<"success" | "warning" | "info" | "error">("success")

    const [loading, setLoading] = useState(false);
    const { id } = useParams()
    const idOrden = Number(id)
    const isEdit = idOrden >= 0 ? true : false
    const {
        control, reset,
        setValue, getValues,
        trigger, formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            orden: {
                codigoOrden: "",
                observaciones: "",
                usuarioRegistro: usuarioRegistro,
                noReferencia: "",
                idSolicitud: 0,
                idTipoOrden: 0,
                fechaEmision: "",
            },
            details: {
                idProducto: 0,
                cantidad: 0,
                precioUnitario: 0.0,
                observaciones: "",
                total: 0.0,
            }
        }
    })

    // ALERT FUNCTIONS
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

    const fetcherTipoOrden = async (query: string) => {
        const tiposSolicitud = await requestGraph.queryGraph(query)
        return tiposSolicitud?.findAllTipoOrdenes
    }

    const fetcherItem = async ([query, variables]: [string, number]) => {
        const datos = await requestGraph.queryGraph(query, variables)
        return datos
    }

    // FUNCION PARA ELIMINAR UN PRODUCTO DE LA TABLA
    const deleteItem = useMemo(() => (id: number) => {
        const rowEdit = rows.filter(row => row.idProducto !== id)
        setRows([])
        setRows(rowEdit)
    }, [rows])

    const headerColumns: GridColDef[] = useMemo(() => [
        {
            field: 'opc',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableExport: false,
            resizable: true,
            headerName: '',
            headerClassName: 'classname--headerOpc',
            cellClassName: 'classname--cell',
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton onClick={() => {
                            deleteItem(params.row.idProducto)
                        }}>
                            <Delete color="error" />
                        </IconButton>
                    </Box>
                )
            }
        },
        {
            field: 'codigoProducto',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableExport: true,
            resizable: true,
            headerName: 'Código de Producto',
            headerClassName: 'classname--header',
            cellClassName: 'classname--cell',
            // flex: 1
        },
        {
            field: 'nombreProducto',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableExport: true,
            resizable: true,
            headerName: 'Producto',
            headerClassName: 'classname--header',
            cellClassName: 'classname--cell',
            // flex: 1
        },
        {
            field: 'precioUnitario',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableExport: true,
            resizable: true,
            headerName: 'Precio Unitario',
            headerClassName: 'classname--header',
            cellClassName: 'classname--cell',
            // flex: 1,
            renderCell: (params: GridCellParams) => {
                return (
                    <span>
                        { formatCurrency(Number(params.value), "NIO") }
                    </span>
                )
            }
        },
        {
            field: 'cantidad',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            editable: true,
            disableExport: true,
            resizable: true,
            headerName: 'Cantidad',
            headerClassName: 'classname--header',
            cellClassName: 'classname--cell',
            // flex: 1
        },
        {
            field: 'total',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            editable: true,
            disableExport: true,
            resizable: true,
            headerName: 'Total',
            headerClassName: 'classname--header',
            cellClassName: 'classname--cell',
            // flex: 1,
            renderCell: (params: GridCellParams) => {
                return (
                    <span>
                        { formatCurrency(Number(params.value), "NIO") }
                    </span>
                )
            }
        },
        {
            field: 'observaciones',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableExport: true,
            resizable: true,
            headerName: 'Observaciones',
            editable: true,
            headerClassName: 'classname--header',
            cellClassName: 'classname--cell',
            // flex: 1
        }
    ], [deleteItem])

    const getProductos = useCallback(async (id: number) => {
        try {
            setLoading(true)
            const result = await requestGraph.queryGraph(
                queries.GET_PRODUCTS,
                { id: id }
            )
            setLoading(false)

            const productos = result.findProductos.map((prod: ProductoGQL) => {
                return {
                    ...prod,
                    categoria: prod.subCategoria?.categoria?.nombreCategoria,
                    subCategoria: prod.subCategoria.nombre,
                    tipoProducto: prod.tipoProducto.nombre,
                    stock: prod.inventarioProductos[0].stock || 0,
                    stockMin: prod.inventarioProductos[0].stockMin || 0,
                    stockMax: prod.inventarioProductos[0].stockMax || 0,
                }
            })

            setProductosInv(productos)

            const data: ListOption[] = productos.map((prod: ProductoGQL) => {
                return {
                    id: prod.idProducto,
                    label: `${prod.codigoProducto} - ${prod.nombreProducto}`,
                    codigo: prod.codigoProducto
                }
            })

            setProductos(data)
        } catch (error) {
            console.error("Hubo un fallo", error);
        }
    }, [])


    // SUBMIT DE GUARDAR Y EDITAR
    async function onSubmit() {
        setValue("orden.usuarioRegistro", usuarioRegistro)
        const isValid = await trigger("orden")
        const orden = getValues("orden")

        if (isValid) {
            const details: DetailsOrden[] = rows.map((item: ItemTable) => {
                return {
                    idDetalleOrden: item.idDetalleOrden ?? null,
                    idOrden: item.idOrden ?? null,
                    idProducto: item.idProducto,
                    cantidad: item.cantidad,
                    observaciones: item.observaciones,
                    precioUnitario: item.precioUnitario,
                }
            })
            const ordenForm: Orden = {
                codigoOrden: orden.codigoOrden,
                noReferencia: orden.noReferencia ?? null,
                observaciones: orden.observaciones ?? null,
                idSolicitud: orden.idSolicitud,
                idTipoOrden: orden.idTipoOrden,
                fechaEmision: orden.fechaEmision,
                usuarioRegistro:  usuarioRegistro,
                detalleOrdens: details
            }

            let result;
            if (isEdit) {
                result = await requestHttp.putOrdenes(ordenForm, idOrden)
            } else {
                result = await requestHttp.postOrdenes(ordenForm)
            }

            handleCreateItem(result?.code, result?.msg)
            if (!isEdit) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000)
            }
        }
    }

    // FUNCION PARA AGREGAR PRODUCTOS A LA TABLA
    async function addProducto() {
        const isValid = await trigger("details")
        const details = getValues("details")

        if (isValid) {
            const prod = productos?.find(p => p.idProducto == details.idProducto)

            if (prod) {
                const existElement = rows.filter(item => item.idProducto === details.idProducto)
                if (existElement) {
                    const mapedRows: ItemTable[] = rows.map(item => {
                        if (item.idProducto === details.idProducto) {
                            item.cantidad += details.cantidad
                            item.total = details.precioUnitario * item.cantidad
                        }

                        return item
                    })

                    setRows(mapedRows)
                } else {
                    const productoTable: ItemTable = {
                        idProducto: prod.idProducto,
                        precioUnitario: details.precioUnitario,
                        codigoProducto: prod.codigoProducto,
                        nombreProducto: prod.nombreProducto,
                        cantidad: details.cantidad,
                        observaciones: details.observaciones ?? null,
                        total: details.total ?? 0
                    }

                    setRows((prevRows) => [...prevRows, {
                        ...productoTable,
                        id: prod.idProducto
                    }])
                }

                setValue("details", {
                    idInventario: getValues("details.idInventario"),
                    idProducto: 0,
                    cantidad: 0,
                    precioUnitario: 0,
                    total: 0,
                    observaciones: ""
                });
            }

        }
    }

    // FETCHER PARA COMBOBOX
    const useCatalog = (
        query: string,
        idKey: string,
        setState: (data: ListOption[]) => void
    ) => {
        useSWR(query, fetcherTipoOrden, {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            onSuccess: (data) => {
                const listItem: ListOption[] = data.map((item: TipoOrden) => ({
                    id: item[idKey],
                    label: `${item.nombre}`,
                    description: item.descripcion ?? null,
                }))
                setState(listItem)
            }
        })
    }
    useCatalog(queries.GET_TIPO_ORDEN_COMBOBOX, "idTipoOrden", setTipoOrden)

    // COMBOBOX DE SOLICITUDES Y INVENTARIOS
    useSWR(
        [queries.GET_INVENTARIO_COMBOBOX],
        fetcherItem,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            onSuccess: (data) => {
                const foundInventarios = data?.findInventarios
                setInventarios(foundInventarios.map((item: InventarioCombobox) => {
                    return {
                        label: `${item.codigoInventario} - ${item.nombreInventario}`,
                        id: Number(item.idInventario),
                    }
                }))
            }
        }
    )
    useSWR(
        [queries.GET_SOLICITUDES_COMBOBOX, { idEstado: Number(14) }],
        fetcherItem,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            onSuccess: (data) => {
                const foundSolicitudes = data?.findSolicitudByState || [];

                const filtradas = foundSolicitudes.filter((item: SolicitudCombobox) =>
                    item.orden.length === 0
                );

                const solicitudes = isEdit ? foundSolicitudes : filtradas;

                const formateadas = solicitudes.map((item: SolicitudCombobox) => {
                    const estado = item.estadoSolicitud.slice(-1)[0]?.estados?.nombreEstado || "Sin Estado";
                    return {
                        label: `${item.codigoSolicitud} - ${item.solicitante} (${estado})`,
                        id: Number(item.idSolicitud),
                    };
                });

                setSolicitudes(formateadas);
            }
        }
    )

    // GET ORDEN BY ID
    useSWR(
        isEdit ? [queries.GET_ORDEN_BY_ID, { idOrden: Number(idOrden) }] : null,
        fetcherItem,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            onSuccess: (data) => {
                const orden: Orden = data?.findOrdenById || {};

                reset({
                    orden:{
                        codigoOrden: orden.codigoOrden,
                        noReferencia: orden.noReferencia,
                        observaciones: orden.observaciones,
                        idSolicitud: orden.idSolicitud,
                        idTipoOrden: orden.idTipoOrden,
                        fechaEmision: orden.fechaEmision.slice(0, 16),
                        usuarioRegistro: orden.usuarioRegistro,
                    }
                })

                const rows: ItemTable[] = orden.detalleOrdens.map((item, i: number) => {
                    return {
                        id: i,
                        codigoProducto: String(item?.producto?.codigoProducto),
                        nombreProducto: String(item?.producto?.nombreProducto),
                        precioUnitario: item.precioUnitario,
                        idProducto: item.idProducto,
                        idOrden: item.idOrden,
                        idDetalleOrden: item.idDetalleOrden,
                        cantidad: item.cantidad,
                        total: Number(item.precioUnitario * item.cantidad),
                        observaciones: item.observaciones ?? null,
                    }
                })

                setRows(rows)
            }
        }
    )

    // PROCESOS PARA ACTUALIZAR DESDE LA TABLA
    const processRowUpdate = (newRow: ItemTable) => {
        const updatedRow = {
            ...newRow,
            cantidad: Number(newRow.cantidad),
            total: Number(newRow.cantidad) * Number(newRow.precioUnitario)
        };

        setRows((prevRows) =>
            prevRows.map((row) => (row.idProducto === newRow.idProducto ? updatedRow : row))
        );

        return updatedRow;
    };

    // GET SOLICITUD BY ID
    async function getSolicitudById(id: number) {
        setLoading(true)
        const result = await requestGraph.queryGraph(queries.GET_SOLICITUDES_BY_ID, {
            idSolicitud: id
        })
        setLoading(false)

        if (result?.findSolicitudById) {
            const data: SolicitudByID = result.findSolicitudById;

            const rows: ItemTable[] = data.detalleSolicitud.map((item, i) => {
                return {
                    id: Number(i),
                    codigoProducto: String(item.producto.codigoProducto),
                    nombreProducto: String(item.producto.nombreProducto),
                    precioUnitario: item.precioUnitario,
                    idProducto: item.idProducto,
                    idSolicitud: item.idSolicitud,
                    idDetalleSolicitud: item.idDetalleSolicitud,
                    cantidad: item.cantidad,
                    total: Number(item.precioUnitario * item.cantidad),
                    observaciones: item.observaciones ?? null,
                }
            })

            setRows(rows)
        }
    }


    const getCodigoOrdenes = useCallback(async () => {
        const result = await requestHttp.getCodigoOrdenes()
        setValue('orden.codigoOrden', result?.code)
    }, [setValue])

    useEffect(() => {
        if (!isEdit) {
            getCodigoOrdenes()
        }
    }, [getCodigoOrdenes, isEdit])

    return (
        <Fade in>
            <Container
                sx={{
                    pb: 2
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" fontWeight={600}>
                        { isEdit ? 'Editar Orden' : 'Nueva Orden' }
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
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8, lg: 8 }}>
                            <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    border: "1px solid",
                                    borderColor: 'divider',
                                    p: 1,
                                    borderRadius: .5,
                                }}
                                component="form"
                                id="subscription-form"
                            >
                                {/* DATOS GENERALES */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Datos Generales
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} sx={{ py: 1 }}>
                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="orden.codigoOrden"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="codigoOrden"
                                                    type="text"
                                                    size="small"
                                                    label="Código de Orden"
                                                    placeholder="Código de Orden"
                                                    error={!!errors.orden?.codigoOrden}
                                                    helperText={errors.orden?.codigoOrden?.message}
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
                                            name="orden.noReferencia"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="noReferencia"
                                                    type="text"
                                                    size="small"
                                                    label="Número de Referencia"
                                                    placeholder="Ingrese el número de referencia"
                                                    error={!!errors.orden?.noReferencia}
                                                    helperText={errors.orden?.noReferencia?.message}
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
                                        >
                                        </Controller>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="orden.idSolicitud"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    id="idSolicitud"
                                                    size="small"
                                                    fullWidth
                                                    readOnly={isEdit}
                                                    value={solicitudes.find(t => t.id === field.value) || null}
                                                    getOptionLabel={(option) => option?.label ?? ""}
                                                    options={solicitudes}
                                                    onChange={(_, data) => {
                                                        const id = Number(data?.id)
                                                        field.onChange(id)

                                                        getSolicitudById(id)
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            id="idSolicitud"
                                                            type="text"
                                                            size="small"
                                                            label="Solicitud"
                                                            placeholder="Elija la una solicitud"
                                                            error={!!errors.orden?.idSolicitud}
                                                            helperText={errors.orden?.idSolicitud?.message}
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true
                                                                },
                                                                input: {
                                                                    ...params?.InputProps,
                                                                }
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: 0.5
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            )}
                                        >
                                        </Controller>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="orden.idTipoOrden"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <FormControl
                                                    fullWidth
                                                    error={!!fieldState.error}
                                                >
                                                    <InputLabel>Tipo de Orden</InputLabel>
                                                    <Select
                                                        {...field}
                                                        id="idTipoOrden"
                                                        label="Tipo de Orden"
                                                        size="small"
                                                        error={!!fieldState.error}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                        }}
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
                                                            <em>Elija un tipo de orden</em>
                                                        </MenuItem>
                                                        {tipoOrden?.map((item: ListOption) => (
                                                            <MenuItem defaultValue={1} value={item.id} sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'start'
                                                            }}>
                                                                { item.label }
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {`${item?.description}`}
                                                                </Typography>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>
                                                        {fieldState.error?.message}
                                                    </FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                        <Controller
                                            name="orden.fechaEmision"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="fechaEmision"
                                                    type="datetime-local"
                                                    size="small"
                                                    label="Fecha de Emisión"
                                                    placeholder="Ingrese la fecha de emisión"
                                                    error={!!errors.orden?.fechaEmision}
                                                    helperText={errors.orden?.fechaEmision?.message}
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
                                        >
                                        </Controller>
                                    </Grid>


                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="orden.observaciones"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="observaciones"
                                                    type="text"
                                                    size="small"
                                                    label="Observaciones"
                                                    placeholder="Ingrese algunas observaciones"
                                                    error={!!errors.orden?.observaciones}
                                                    helperText={errors.orden?.observaciones?.message}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
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
                                        >
                                        </Controller>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '250px',
                                                    mt: 2
                                                }}
                                            >
                                                <DataGridPremium
                                                    loading={loading}
                                                    rows={rows}
                                                    columns={headerColumns}
                                                    processRowUpdate={processRowUpdate}
                                                    apiRef={apiRef}
                                                    density="compact"
                                                    pageSizeOptions={[5, 10]}
                                                    sx={{
                                                        '& .classname--header': {
                                                            backgroundColor: '#F2F2F2',
                                                        },
                                                        '& .classname--cell': {
                                                            p: 0,
                                                        },
                                                        '& .classname--cellOpc': {
                                                            display: 'flex',
                                                            p: 0,
                                                            justifyContent: 'center',
                                                        },
                                                        '& .classname--headerOpc': {
                                                            display: 'flex',
                                                            p: 0,
                                                            justifyContent: 'center',
                                                        }
                                                    }}
                                                />
                                            </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>


                        {/* DETAILS */}

                        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                            <Box component="form"
                                id="details-form"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    border: "1px solid",
                                    borderColor: 'divider',
                                    p: 1,
                                    borderRadius: .5,
                                }}
                            >
                                {/* Detalles de la solicitud */}
                                <Typography
                                    component="h6"
                                    variant="body1"
                                >
                                    Detalles de la Solicitud
                                </Typography>

                                <Divider />

                                <Grid container spacing={2} sx={{ py: 1 }}>
                                    <Grid size={{ xs: 12, lg: 12, sm: 12 }}>
                                        <Controller
                                            control={control}
                                            name="details.idInventario"
                                            render={({ field }) => (
                                                <Autocomplete
                                                    id="inventarios"
                                                    fullWidth
                                                    size="small"
                                                    value={inventarios?.find(t => t.id === field.value) || null}
                                                    options={inventarios}
                                                    loading={loading}
                                                    onChange={(_, data) => {
                                                        const id = data?.id
                                                        field.onChange(id)
                                                        getProductos(Number(id))
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={!!errors.details?.idInventario}
                                                            helperText={errors.details?.idInventario?.message}
                                                            label="Inventarios"
                                                            placeholder="Elija un inventario"
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
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="details.idProducto"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    id="idProducto"
                                                    size="small"
                                                    fullWidth
                                                    value={productosList?.find(t => t.id === field.value) || null}
                                                    getOptionLabel={(option) => option?.label ?? ""}
                                                    options={productosList ?? []}
                                                    onChange={(_, data) => {
                                                        if (data) {
                                                            const idProducto = data?.id
                                                            field.onChange(idProducto)

                                                            const prod: ProductoGQL | null = productos?.find(p => p.idProducto === idProducto) ?? null

                                                            if (prod) {
                                                                setValue("details.precioUnitario", prod.precio)
                                                            }
                                                        }
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            type="text"
                                                            size="small"
                                                            label="Producto"
                                                            placeholder="Elija un producto"
                                                            error={!!errors.details?.idProducto}
                                                            helperText={errors.details?.idProducto?.message}
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
                                                    }
                                                />
                                            )}
                                        >
                                        </Controller>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="details.precioUnitario"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <NumericFormat
                                                    id="precioUnitario"
                                                    thousandSeparator
                                                    valueIsNumericString={false}
                                                    value={value}
                                                    prefix="C$"
                                                    fullWidth
                                                    error={!!errors.details?.precioUnitario}
                                                    onValueChange={(value) => {
                                                        const newVal = value.floatValue || 0
                                                        onChange(newVal)
                                                        const cantidad: number = Number(
                                                            getValues("details.cantidad")
                                                        )

                                                        setValue("details.total", cantidad * newVal)
                                                    }}
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
                                                    placeholder="Ingrese el precio unitario"
                                                    label="Precio unitario"
                                                    size="small"
                                                    customInput={TextField}
                                                />
                                            )}
                                        >
                                        </Controller>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="details.cantidad"
                                            control={control}
                                            render={({ field }) => (
                                                <NumberField
                                                    {...field}
                                                    id="cantidad"
                                                    label="Cantidad"
                                                    size="small"
                                                    readOnly={isEdit}
                                                    error={!!errors.details?.cantidad}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)

                                                        const precio: number = Number(
                                                            String(getValues("details.precioUnitario")).replace(/[^\d.-]/g, "")
                                                        )

                                                        setValue("details.total", Number(value) * precio)
                                                    }}
                                                />
                                            )}
                                        >
                                        </Controller>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="details.total"
                                            control={control}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    {...field}
                                                    id="total"
                                                    thousandSeparator
                                                    valueIsNumericString
                                                    prefix="C$"
                                                    fullWidth
                                                    placeholder="Total de la solicitud"
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

                                    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                        <Controller
                                            name="details.observaciones"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    id="observaciones"
                                                    type="text"
                                                    size="small"
                                                    label="Observaciones"
                                                    placeholder="Ingrese algunas observaciones"
                                                    error={!!errors.details?.observaciones}
                                                    helperText={errors.details?.observaciones?.message}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
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
                                        >
                                        </Controller>
                                    </Grid>
                                </Grid>

                                <Box sx={{ flexGrow: 1 }} />

                                <Divider sx={{ my: 2 }} />

                                <Box
                                    sx={{
                                        mt: 2,
                                        display: "flex",
                                        justifyContent: "end",
                                        alignItems: 'center'
                                    }}
                                >
                                    <Button onClick={() => {
                                        setValue("details", {
                                            idInventario: getValues("details.idInventario"),
                                            idProducto: 0,
                                            cantidad: 0,
                                            precioUnitario: 0,
                                            total: 0,
                                            observaciones: ""
                                        });
                                    }}
                                        color="secondary"
                                        startIcon={<DeleteRounded />}
                                        sx={{
                                            "&.MuiButtonBase-root": {
                                                borderRadius: .5
                                            }
                                        }}
                                    >
                                        Limpiar
                                    </Button>
                                    <Button form="details-form"
                                        onClick={() => {
                                            addProducto()
                                        }}
                                        variant="contained" color="success"
                                        startIcon={<AddRounded />}
                                        sx={{
                                            ml: 2,
                                            "&.MuiButtonBase-root": {
                                                borderRadius: .5
                                            }
                                        }}
                                    >
                                        Agregar
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>


                </Box>

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
                    <Button form="subscription-form"
                        variant="contained"
                        onClick={() => {
                            onSubmit()
                        }}
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

                {openAlert && (
                    <AlertComp severity={severityAlert} message={msgAlert}/>
                )}
            </Container>
        </Fade>
    )
}
