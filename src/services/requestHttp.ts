import axios from "axios";
import { endPoints } from "./endPoints";
import type { Categoria } from "../helpers/interfaces";

export default class RequestHttp {
    constructor() {}

    async getData(url: string) {
        return (await axios.get(url))
    }

    async postCategoria(data: Categoria) {
        try {
            const result = await axios.post(endPoints.postCatgoria, data)
            return {
                code: result.data?.code,
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