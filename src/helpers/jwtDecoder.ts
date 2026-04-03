import { jwtDecode } from "jwt-decode"

class JWTDecoder {
    token
    constructor(token: string | null) {
        this.token = token
    }

    decodeToken() {
        if (!this.token) return null

        return jwtDecode(this.token)
    }
}

export default JWTDecoder