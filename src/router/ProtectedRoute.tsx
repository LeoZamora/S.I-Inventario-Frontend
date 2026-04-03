import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../appStore/hooks/hook";
// import JWTDecoder from "../helpers/jwtDecoder";
// import type { JwtPayload } from 'jwt-decode'

const ProtectedRoute = () => {
    const token = useAppSelector(state => state.auth.token)

    if (!token) {
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}

export default ProtectedRoute