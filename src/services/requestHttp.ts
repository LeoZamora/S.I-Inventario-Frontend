import axios from "axios";

export default class RequestHttp {
    constructor() {}

    async getData(url: string) {
        return (await axios.get(url))
    }
}