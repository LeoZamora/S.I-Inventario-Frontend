import { z } from 'zod'

// CATEGORY VALIDATION
const categoriasSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    codigo: z.string().min(1, "El codigo es obligatorio"),
    descripcion: z.string().optional().nullable()
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
    ramGB: z.number(),
    cantidadAlm: z.number(),
    procesador: z.string().optional().nullable(),
    idTipoDispositivo: z.number(),
    idTipoAlmacenamiento: z.number(),
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
    precioDolares: z.number().min(1, "El precio es obligatorio"),
    total: z.number().min(1, "Precio total autocalculado"),

    usuarioRegistro: z.string("El usuario de registro es obligatorio").min(3, "El usuario debe tener almenos 3 caracteres"),
    detallesEspecificos: detalleSchema
})

export const validationSchema = {
    categoriasSchema,
    tipoProductoSchema,
    subCategoriasSchema,
    ubicacionSchema,
    bodegasSchema,
    inventarioSchema,
    productoSchema
}
