import axios from "axios";

export default class RequestGraph {
    constructor() {}

    async queryGraph(query: string, variables = {}) {
        const result = await axios.post('graphql', {
            query: query,
            variables: variables
        })

        // GraphQL siempre devuelve 200 OK, los errores vienen dentro de result.data.errors
        if (result.data.errors) {
            console.error("Errores de GraphQL:", result.data.errors);
            throw new Error("Error en la consulta");
        }

        return result.data.data;
    }
}