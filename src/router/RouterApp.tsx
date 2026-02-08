import { Routes, Route } from "react-router-dom";
import Productos from "../modules/Productos";
import HomePage from "../modules/HomePage";
import Categorias from "../components/inventario_components/Categorias";
import Inventarios from "../components/inventario_components/Inventarios";
import AppShell from "../layout/AppShell";
import InventarioLayout from "../modules/InventarioModule";
import { Suspense } from "react";

const routes = [
    {
        path: 'inventario',
        component: <InventarioLayout />,
        pathnameBase: 'Inventory',
        indexRedirectTo: "productos",
        children: [
            {
                path: 'productos',
                element: <Productos />
            },
            {
                path: 'categorias',
                element: <Categorias />
            },
            {
                path: 'inventarios',
                element: <Inventarios />
            },
        ]
    }
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
                                <Route element={route.indexRedirectTo} />
                            )}

                            {route.children?.map((child) => (
                                <Route key={`${route.path}/${child.path}`} path={child.path}
                                    element={child.element}/>
                            ))}
                        </Route>
                    ))}
                </Route>
                <Route path="*" element={<div>NO FOUND <strong>404</strong></div>} />
            </Routes>
        </Suspense>
    )
}