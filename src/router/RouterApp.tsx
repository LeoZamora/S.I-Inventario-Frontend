import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { lazy } from "react";
// import { KeepAlive } from "react-activation";
import LoadingOverlay from "../reusable/LoaderOverlay";
import TiposOrdenes from "../components/movimientos_inventario/TipoOrden";

// Lazy load de componentes

const AppShell = lazy(() => import('../layout/AppShell'));
const HomePage = lazy(() => import('../pages/HomePage'));
const InventarioLayout = lazy(() => import('../pages/InventarioModule'));
const Categorias = lazy(() => import('../components/inventario_components/Categorias'));
const Inventarios = lazy(() => import('../components/inventario_components/Inventarios'));
const TiposProductos = lazy(() => import('../components/inventario_components/TipoProducto'));
const Proveedores = lazy(() => import('../components/inventario_components/Proveedores'));
const InventarioArmas = lazy(() => import('../components/inventario_components/InventarioArmas'));
const BodegasUbicaciones = lazy(() => import('../components/inventario_components/Logistica'));
const DetailsCategory = lazy(() => import('../components/inventario_components/categorias_components/CategoriaDetails'));
const DetailsUbicacion = lazy(() => import('../components/inventario_components/bodegas_components/LogisticaDetails'));
const ProductoCreate = lazy(() => import('../components/inventario_components/inventario_components/ProductoCreate'));
const Solicitudes = lazy(() => import('../components/movimientos_inventario/Solicitudes'));
const CreateSolicitud = lazy(() => import('../components/movimientos_inventario/solicitudes_components/CreateSolicitud'));
const TiposSolicitudes = lazy(() => import('../components/movimientos_inventario/TipoSolicitud'));
const Ordenes = lazy(() => import('../components/movimientos_inventario/Ordenes'));
const CreateOrden = lazy(() => import('../components/movimientos_inventario/ordenes_conponents/CreateOrden'));
const LoginApp = lazy(() => import('../pages/LoginApp'));
const InventarioProductos = lazy(() => import('../components/inventario_components/InventarioProductos'));


// function ProductoCreateWrapper() {
//     const { id } = useParams();

//     return (
//         <KeepAlive
//             id={id ? `edit-${id}` : 'form-crear'}
//             name="ProductoForm"
//             saveScrollPosition
//             autoFreeze={true} 
//         >
//             <Suspense fallback={<LoadingOverlay isLoading={true}/>}>
//                 <ProductoCreate key={id} id={Number(id)} />
//             </Suspense>
//         </KeepAlive>
//     );
// }

// function SolicitudCreateWrapper() {
//     const { id } = useParams();

//     return (
//         <KeepAlive
//             id={id ? `edit-${id}` : 'form-crear'}
//             name="SolicitudForm"
//             saveScrollPosition
//             autoFreeze={true} 
//         >
//             <Suspense fallback={<LoadingOverlay isLoading={true}/>}>
//                 <CreateSolicitud key={id} id={Number(id)} />
//             </Suspense>
//         </KeepAlive>
//     );
// }

// function OrdenesCreateWrapper() {
//     const { id } = useParams();

//     return (
//         <KeepAlive
//             id={id ? `edit-${id}` : 'form-crear'}
//             name="OrdenForm"
//             saveScrollPosition
//             autoFreeze={true} 
//         >
//             <Suspense fallback={<LoadingOverlay isLoading={true}/>}>
//                 <CreateOrden key={id} id={Number(id)} />
//             </Suspense>
//         </KeepAlive>
//     );
// }

const routes = [
    {
        path: 'inventario',
        element: <InventarioLayout />,
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
        element: <Solicitudes />,
        pathnameBase: 'Solicitudes',
        children: [
            {
                path: ':id?',
                element: <CreateSolicitud />,
                children: []
            },
            {
                path: 'tipo-solicitud',
                element: <TiposSolicitudes />,
                children: []
            },
        ]
    },
    {
        path: 'ordenes',
        element: <Ordenes />,
        pathnameBase: 'Ordenes',
        children: [
            {
                path: ':id?',
                element: <CreateOrden />,
                children: []
            },
            {
                path: 'tipo-orden',
                element: <TiposOrdenes />,
                children: []
            },
        ]
    },
]

export default function RouterApp() {

    return (
        <Suspense fallback={<LoadingOverlay isLoading={true}/>}>
            <Routes>
                <Route path="/login" element={<LoginApp />} />

                <Route element={ <ProtectedRoute /> }>
                    <Route path="/" element={<AppShell/>}>
                        <Route path="/home" element={<HomePage/>} />

                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path }
                                element={route.element}
                            >
                                {route.indexRedirectTo && (
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
                </Route>

                <Route path="*" element={<div>NO FOUND <strong>404</strong></div>} />
            </Routes>
        </Suspense>
    )
}