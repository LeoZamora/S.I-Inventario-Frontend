import KeepAliveRouteOutlet from "keepalive-for-react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function InventarioLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    // Redirigir SOLO si la ruta es exactamente "/inventario"
    useEffect(() => {
        if (location.pathname === '/inventario' || location.pathname === '/inventario/') {
            navigate('productos', { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: "white" }}>
            <KeepAliveRouteOutlet />
        </div>
    );
}