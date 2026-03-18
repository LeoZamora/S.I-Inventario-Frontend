import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../modules/HomePage";
import Categorias from "../components/inventario_components/Categorias";
import Inventarios from "../components/inventario_components/Inventarios";
import AppShell from "../layout/AppShell";
import InventarioLayout from "../modules/InventarioModule";
import TiposProductos from "../components/inventario_components/TipoProducto";
import Proveedores from "../components/inventario_components/Proveedores";
import InventarioArmas from "../components/inventario_components/InventarioArmas";
import InventarioProductos from "../components/inventario_components/InventarioProductos";
// import UnderConstruction from "../reusable/BuildComp";
import BodegasUbicaciones from "../components/inventario_components/Logistica";
import DetailsCategory from "../components/inventario_components/categorias_components/CategoriaDetails";
import DetailsUbicacion from "../components/inventario_components/bodegas_components/LogisticaDetails";
import ProductoCreate from "../components/inventario_components/inventario_components/ProductoCreate";
import Solicitudes from "../components/movimientos_inventario/Solicitudes";
import CreateSolicitud from "../components/movimientos_inventario/solicitudes_components/CreateSolicitud";

const routes = [
    {
        path: 'inventario',
        component: <InventarioLayout />,
        pathnameBase: 'Inventory',
        indexRedirectTo: "productos",
        children: [
            {
                path: 'productos',
                element: <InventarioProductos />,
                children: [
                    {
                        path: ':id?',
                        element: <ProductoCreate />,
                    }
                ]
            },
            {
                path: 'armas',
                element: <InventarioArmas />,
            },
            {
                path: 'categorias',
                element: <Categorias />,
                children: [
                    {
                        path: ':id',
                        element: <DetailsCategory />,
                    }
                ]
            },
            {
                path: 'tipos-productos',
                element: <TiposProductos />,
            },
            {
                path: 'inventarios',
                element: <Inventarios />,
            },
            {
                path: 'proveedores',
                element: <Proveedores />,
            },
            {
                path: 'bodegas-ubicaciones',
                element: <BodegasUbicaciones />,
                children: [
                    {
                        path: ':id',
                        element: <DetailsUbicacion />,
                    }
                ]
            },
        ]
    },
    {
        path: 'solicitudes',
        component: <Solicitudes />,
        pathnameBase: 'Solicitudes',
        children: [
            {
                path: ':id?',
                element: <CreateSolicitud />,
                children: []
            },
        ]
    },
    // {
    //     path: 'ordenes',
    //     component: <Solicitudes />,
    //     pathnameBase: 'Ordenes',
    //     children: []
    // },
]

export default function RouterApp() {

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
                <Route path="/" element={<AppShell/>}>
                    <Route path="/home" element={<HomePage/>} />

                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path }
                            element={route.component}
                        >
                            {route.indexRedirectTo && (
                                // <Route element={route.indexRedirectTo} />
                                <Route
                                    element={<Navigate to={route.indexRedirectTo} replace />}
                                />
                            )}

                            {route.children?.map((child) => (
                                <Route key={`${route.path}/${child.path}`} path={child.path}
                                    element={child.element}>
                                    {child.children?.map((subChild) => (
                                        <Route key={`${route.path}/${subChild.path}`} path={subChild.path}
                                            element={subChild.element}
                                        />
                                    ))}
                                </Route>
                            ))}
                        </Route>
                    ))}
                </Route>
                <Route path="*" element={<div>NO FOUND <strong>404</strong></div>} />
            </Routes>
        </Suspense>
    )
}