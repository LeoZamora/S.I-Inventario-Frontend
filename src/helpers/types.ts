export type ItemCombobox = {
    id?: number | null
    nombre: string
    descripcion?: string | null
    usuarioRegistro?: string | null
}

export type MenuItem = {
    icon: string,
    title: string,
    path: string,
}

export type estadoSolicitud = {
    estados: {
        nombreEstado: string
    }
}

type ubicacionesType = {
    idUbicacion: number
    codigoUbicacion: string
    nombreUbicacion: string
}

type bodegaSolicitante = {
    idBodega: number
    codigoBodega: string
    nombreBodega: string
    ubicacion: ubicacionesType
    descripcion: string | null
}

type bodegaSolicitada = {
    idBodega: number
    codigoBodega: string
    nombreBodega: string
    ubicacion: ubicacionesType
    descripcion: string | null
}

export type producto = {
    codigoProducto: string
    nombreProducto: string
}

export type detalleSolicitud = {
    idDetalleSolicitud: number
    observaciones: string | null
    cantidad: number
    precioUnitario: number
    idSolicitud: number
    producto: producto
    idProducto: number
}

export type SolicitudByID = {
    idSolicitud: number
    codigoSolicitud: string
    solicitante: string
    observaciones: string | null
    motivo: string
    fechaRegistro: string
    usuarioRegistro: string
    idBodegaSolicitada: number
    idBodegaSolicitante: number
    idTipoSolicitud: number
    producto: producto
    bodegaSolicitada: bodegaSolicitada
    bodegaSolicitante: bodegaSolicitante
    detalleSolicitud: detalleSolicitud[]
    estadoSolicitud: estadoSolicitud
}