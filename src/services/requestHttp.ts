import axios from "axios";
import { endPoints } from "./endPoints";
import type {
    Bodegas, Categoria, InventarioQL, Login, Orden, Producto,
    Solicitud, SubCategoria, TipoGeneric, Ubicacion
} from "../helpers/interfaces";

export default class RequestHttp {
    constructor() {}

    async getData(url: string) {
        return (await axios.get(url))
    }

    async postCategoria(data: Categoria) {
        try {
            const result = await axios.post(endPoints.postCatgoria, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    // CATEGORIAS Y SUBCATEGORIAS
    async getCodigoSubCategoria(id: number) {
        try {
            const result = await axios.get(`${endPoints.getCodigoSubCategoria}/${id}`)
            return {
                code: result.data,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async postSubCategoria(data: SubCategoria) {
        try {
            const result = await axios.post(endPoints.postSubCategoria, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async putSubCategoria(id: number, data: SubCategoria) {
        try {
            const result = await axios.put(`${endPoints.postSubCategoria}/${id}`, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    // PRODUCTOS
    async postProducto(data: Producto) {
        try {
            const result = await axios.post(endPoints.postProducto, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async putProducto(data: Producto, idProducto: number) {
        try {
            const result = await axios.put(`${endPoints.postProducto}/${idProducto}`, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async getCodigoProducto(id: number) {
        try {
            const result = await axios.get(`${endPoints.getCodigoProducto}/${id}`)
            return {
                code: result.data,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }


    // TIPOS DE PRODUCTOS
    async postTipoProducto(data: TipoGeneric) {
        try {
            const result = await axios.post(endPoints.postTipoProducto, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    // LOGISTICA
    async postUbicacion(data: Ubicacion) {
        try {
            const result = await axios.post(endPoints.postUbicacion, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async postBodega(data: Bodegas) {
        try {
            const result = await axios.post(endPoints.postBodega, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async getCodigoLogistica(tipo: string) {
        const url = tipo === 'ubicacion' ? endPoints.getCodigoUbicacion
            : endPoints.getCodigoBodega
        try {
            const result = await axios.get(url)
            return result.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }


    // INVENTARIOS
    async postInventarios(data: InventarioQL) {
        try {
            const result = await axios.post(endPoints.postInventario, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async getCodigoInventario() {
        try {
            const result = await axios.get(endPoints.getCodigoInventario)
            return {
                code: result.data,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }


    // PARA GUARDAR ITEMS DE COMBOBOX
    async postItem(data: {
        nombre: string
        descripcion?: string | null
    }, url: string) {
        try {
            const result = await axios.post(url, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }


    // SOLICITUDES
    async getCodigoSolicitud() {
        try {
            const result = await axios.get(endPoints.getCodigoSolicitud)
            return {
                code: result.data,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async postSolicitud(data: Solicitud) {
        try {
            const result = await axios.post(endPoints.postSolicitud, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async putSolicitud(data: Solicitud, idSolicitud: number) {
        try {
            const result = await axios.put(`${endPoints.postSolicitud}/${idSolicitud}`, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    // TIPOS DE SOLICITUD
    async postTipoSolicitud(data: TipoGeneric) {
        try {
            const result = await axios.post(endPoints.postTipoSolicitud, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    // LOGIN
    async postLogin(data: Login) {
        try {
            const result = await axios.post(endPoints.postLogin, data)
            return {
                code: result.status,
                msg: result.data?.token,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }


    // ORDENES
    async getCodigoOrdenes() {
        try {
            const result = await axios.get(endPoints.getCodigoOrden)
            return {
                code: result.data,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async postOrdenes(data: Orden) {
        try {
            const result = await axios.post(endPoints.postOrden, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

    async putOrdenes(data: Orden, idOrden: number) {
        try {
            const result = await axios.put(`${endPoints.postOrden}/${idOrden}`, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }

        async postTipoOrden(data: TipoGeneric) {
        try {
            const result = await axios.post(endPoints.postTipoOrden, data)
            return {
                code: result.data?.code ?? result.status,
                msg: result.data?.msg,
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return {
                    code: error?.response?.status,
                    msg: error?.response?.data.message,
                }
            }
        }
    }
}