import axios from "axios";

export default class RequestGraph {
    constructor() {}

    async queryGraph(query: string, variables = {}) {
        const result = await axios.post('graphql', {
            query: query,
            variables: variables
        })

        if (result.data.errors) {
            console.error("Errores de GraphQL:", result.data.errors);
            throw new Error("Error en la consulta");
        }

        return result.data.data;
    }
}