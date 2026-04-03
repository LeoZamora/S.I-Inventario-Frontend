import type { producto } from "./types";

export interface Categoria {
    // idCategoria?: number | null
    nombreCategoria: string;
    codigoSubCategoria: string | null;
    descripcion?: string | null;
    usuarioRegistro: string
}
export interface SubCategoria {
    idSubCategoria?: number | null;
    codigoSubCategoria?: string;
    codigoProducto: string;
    nombre: string;
    idCategoria: number;
    descripcion?: string | null;
    usuarioRegistro?: string | null;
    categoria?: Categoria | null;
}

export interface Bodegas {
    idBodega?: number | null
    codigoBodega: string | null;
    nombreBodega: string;
    descripcion?: string | null;
    usuarioRegistro: string
    idUbicacion?: number | null
}


export interface Ubicacion {
    idUbicacion?: number | null;
    codigoUbicacion: string;
    nombreUbicacion: string;
    direccion?: string | null;
    fechaRegistro?: string | null;
    usuarioRegistro?: string | null;
    bodegas?: Bodegas | null;
}

export interface TipoGeneric {
    nombre: string;
    descripcion?: string | null;
    usuarioRegistro: string
}

export interface Login {
    usuario: string;
    password: string
}

export interface InventarioProducto {
    stockMin: number;
    stockMax: number;
    stock: number;
    estado: number | boolean
}

export interface ProductoGQL {
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    precio: number;
    marca: string;
    modelo: string;
    estado: string;
    subCategoria: SubCategoria;
    inventarioProductos: InventarioProducto[];
    tipoProducto: TipoGeneric
    fechaRegistro: Date;
    usuarioRegistro: string;
}

export interface Producto {
    idInventario?: number;
    idTipoProducto?: number;
    idCategoria?: number | null
    idSubCategoria?: number | null;
    codigoProducto: string;
    nombreProducto: string;
    marca: string;
    modelo?: string | null;
    observaciones?: string | null
    imagen?: string | null,
    caracteristicasEspeciales?: string | null
    precio: number;
    stock: number
    stockMin: number
    stockMax: number
    usuarioRegistro: string;
    detallesEspecificos?: object | null
}

export interface UbicacionQL {
    nombreUbicacion: string;
}

export interface BodegaGraphQL {
    idBodega: number;
    nombreBodega: string;
    ubicacion: UbicacionQL;
    descripcion: string;
    // estado: string;
    fechaRegistro: Date;
    usuarioRegistro: string;
}

export interface InventarioQL {
    idInventario?: number;
    codigoInventario: string;
    nombreInventario: string;
    pathRoute: string;
    observaciones?: string | null;
    estado?: string | number;
    fechaRegistro?: Date;
    usuarioRegistro: string;
    idBodega?: number | null;
    idDepartamento?: number | null
}

export interface DetailsSolicitud {
    idDetalleSolicitud?: number | null
    idSolicitud?: number | null
    idProducto: number,
    cantidad: number,
    precioUnitario: number,
    observaciones: string | null
}

export interface Solicitud {
    codigoSolicitud: string,
    solicitante: string,
    observaciones: string | null,
    motivo: string,
    usuarioRegistro: string,
    idBodegaSolicitante: number,
    idBodegaSolicitada: number | null,
    idTipoSolicitud: number,
    detalles: DetailsSolicitud[]
}

export interface DetailsOrden {
    idDetalleOrden: number | null
    idOrden: number | null
    idProducto: number,
    cantidad: number,
    precioUnitario: number,
    observaciones: string | null
    producto?: producto | null
}

export interface Orden {
    idOrden?: number | null
    codigoOrden: string,
    noReferencia: string | null,
    observaciones: string | null,
    usuarioRegistro: string,
    fechaEmision: string,
    idTipoOrden: number,
    idSolicitud: number,
    detalleOrdens: DetailsOrden[]
}