import { z } from 'zod'

// CATEGORY VALIDATION
const itemComboboxSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres")
})

// CATEGORY VALIDATION
const categoriasSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    codigo: z.string().min(1, "El codigo es obligatorio"),
    descripcion: z.string().optional().nullable(),
})

// SUBCATEGORY VALIDATION
const subCategoriasSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    codigo: z.string().min(1, "El codigo es obligatorio"),
    codigoProducto: z.string().min(1, "El codigo es obligatorio"),
    idCategoria: z.number().min(1, "Elija una categoría"),
    descripcion: z.string().optional().nullable()
})

// TIPO PRODUCTO VALIDATION
const tipoProductoSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres")
})

// UBICACION VALIDATION
const ubicacionSchema = z.object({
    codigoUbicacion: z.string().min(3, "El código debe tener almenos 3 caracteres"),
    nombreUbicacion: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    direccion: z.string().optional().nullable(),
    usuarioRegistro: z.string().min(1, "El usuario de registro es obligatorio")
})

// BODEGAS VALIDATION
const bodegasSchema = z.object({
    codigoBodega: z.string().min(3, "El código debe tener almenos 3 caracteres"),
    nombreBodega: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres"),
    idUbicacion: z.number().min(0, "Elija una ubicación")
})

// BODEGAS VALIDATION
const inventarioSchema = z.object({
    codigoInventario: z.string().min(3, "El código debe tener almenos 3 caracteres"),
    nombreInventario: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    pathRoute: z.string().min(3, "Ingrese una ruta de acceso"),
    observaciones: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres"),
    idUbicacion: z.number().min(1, "Elija una ubicacion"),
    idBodega: z.number().min(1, "Elija una bodega"),
    idDepartamento: z.number().min(1, "Elija un departamento asignado")
})

const equipoComputoSchema = z.object({
    ramGB: z.number().min(1, "La cantidad debe ser mayor de 2Gb como minimo").default(1),
    cantidadAlm: z.number().min(1, "El campo es obligatorio").default(2),
    procesador: z.string().optional().nullable(),
    idTipoDispositivo: z.number().min(1,"El tipo de dispositivo es obligatorio"),
    idTipoAlmacenamiento: z.number().min(1,"El tipo de almacenamiento es obligatorio"),
})

const armaSchema = z.object({
    numSerie: z.string(),
    capacidadCargador: z.number(),
    longitudCanon: z.number().optional().nullable(),
    licencia: z.boolean(),
    material: z.string().optional().nullable(),
    idCalibre: z.number(),
    idTipoArma: z.number(),
    idSistemaDisparo: z.number(),
})

const mobiliarioSchema = z.object({
    color: z.string(),
    usoDestinado: z.string(),
    acabado: z.number().nullable(),
    material: z.string(),
    dimensiones: z.string(),
})

const impresoraSchema = z.object({
    color: z.string().nullable(),
    noSerie: z.string(),
    idTipoImpresion: z.number(),
    idCategoriaImpresora: z.number(),
    idTipoConexion: z.number(),
})

const detalleSchema = z.discriminatedUnion("codigoSubCategoria", [
    equipoComputoSchema.extend({ codigoSubCategoria: z.literal("EC") }),
    armaSchema.extend({ codigoSubCategoria: z.literal("ARM") }),
    mobiliarioSchema.extend({ codigoSubCategoria: z.literal("MOB") }),
    impresoraSchema.extend({ codigoSubCategoria: z.literal("IMP") })
])

const productoSchema = z.object({
    idProducto: z.number().optional().nullable(),
    idSubCategoria: z.number().min(1, "La subcategoria es obligatoria"),
    idCategoria: z.number().min(1, "La categoria es obligatoria"),
    idTipoProducto: z.number().min(1, "El tipo de producto es obligatorio"),
    idInventario: z.number().min(1, "Elija el inventario para asignar"),

    codigoProducto: z.string().min(3, "El código debe tener almenos 3 caracteres"),
    nombreProducto: z.string().min(3, "El nombre del producto es obligatorio"),

    marca: z.string("La marca es obligatoria").min(2, "La marca es obligatoria"),
    modelo: z.string().optional().nullable(),
    observaciones: z.string().optional().nullable(),
    caracteristicasEspeciales: z.string().optional().nullable(),
    imagen: z.string().optional().nullable(),

    stockMin: z.number().min(1, "El stock minimo no puede ser 0"),
    stockMax: z.number().min(1, "El stock maximo no puede ser 0"),
    stock: z.number().nonnegative("El stock no puede ser negativo"),
    precio: z.number().min(1, "El precio es obligatorio"),
    precioDolares: z.number().optional(),
    total: z.number().optional(),

    fechaRegistro: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres"),
    detallesEspecificos: detalleSchema
})


// DETAILS PROODUCT
const detailsProductSchema = z.object({
    idDetalleSolicitud: z.number().optional().nullable(),
    idSolicitud: z.number().optional().nullable(),
    idInventario: z.number().min(1, "El id del inventario es obligatorio"),
    idProducto: z.number().min(1, "El id del producto es obligatorio"),
    cantidad: z.number().min(1, "Ingrese una cantidad"),
    precioUnitario: z.number().min(1, "Ingrese el precio unitario del producto"),
    observaciones: z.string().optional().nullable(),
    total: z.number().optional(),
})

// SOLICITUDES
const solicitudesSchema = z.object({
    // idSolicitud: z.number().optional().nullable(),
    codigoSolicitud: z.string().min(3, "El codigo debe cargarse automaticamente"),
    solicitante: z.string().min(3, "El nombre del solicitante es obligatorio"),
    observaciones: z.string().optional().nullable(),
    motivo: z.string().min(3, "Ingrese el motivo de la solicitud"),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres"),
    idUbicacionSolicitante: z.number().min(1, "Elija una ubicacion solicitante"),
    idBodegaSolicitante: z.number().min(1, "Elija la bodega solicitante"),
    idBodegaSolicitada: z.number().optional().nullable(),
    idUbicacionSolicitada: z.number().optional().nullable(),
    idTipoSolicitud: z.number().min(1, "Elija la un tipo de solicitud"),
    // detalles: z.array(detailsProductSchema).nonempty("Debe incluir al menos un producto")
})

// ORDENES
const ordenesSchema = z.object({
    // idOrden: z.number().optional().nullable(),
    codigoOrden: z.string().min(3, "El codigo debe cargarse automaticamente"),
    noReferencia: z.string().optional().nullable(),
    observaciones: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres"),
    fechaEmision: z.string().min(1, "La fecha de emisión es obligatoria"),
    idTipoOrden: z.number().min(1, "Elija la un tipo de orden"),
    idSolicitud: z.number().min(1, "Elija la un tipo de orden"),
    // detalles: z.array(detailsProductSchema).nonempty("Debe incluir al menos un producto")
})

// TIPO SOLICTUD VALIDATION
const tipoSolicitudSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional().nullable(),
    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres")
})


export const loginSchema = z.object({
    usuario: z.string('El usuario es obligatorio').min(3, 'El usuario es obligatorio'),
    password: z.string('La contraseña es obligatoria').min(6, 'La contraseña es obligatoria'),
    // passVerify: z.string('Repita su contraseña').min(6, 'La contraseña debe tener un minimo de 6 caracteres'),
})


export const validationSchema = {
    categoriasSchema,
    tipoProductoSchema,
    subCategoriasSchema,
    ubicacionSchema,
    bodegasSchema,
    inventarioSchema,
    productoSchema,
    itemComboboxSchema,
    detalleSchema,
    solicitudesSchema,
    detailsProductSchema,
    tipoSolicitudSchema,
    ordenesSchema
}
