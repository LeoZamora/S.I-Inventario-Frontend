export interface Categoria {
    nombreCategoria: string;
    codigoSubCategoria: string | null;
    descripcion: string | null;
    usuarioRegistro: string
}

export interface SubCategoria {
    idSubCategoria: number;
    nombre: string;
    categoria: Categoria;
}

export interface InventarioProducto {
    stockMin: number;
    stockMax: number;
    stock: number;
    estado: number | boolean
}

export interface TipoProducto {
    nombre: string;
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
    idInventario: number;
    codigoInventario: string;
    nombreInventario: string;
    pathRoute: string;
    observaciones: string;
    estado: string | number;
    fechaRegistro: Date;
    usuarioRegistro: string;
}