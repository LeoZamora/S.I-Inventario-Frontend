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


export interface InventarioProducto {
    stockMin: number;
    stockMax: number;
    stock: number;
    estado: number | boolean
}

export interface TipoProducto {
    nombre: string;
    descripcion?: string | null;
    usuarioRegistro: string
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
    tipoProducto: TipoProducto
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