import React from "react";

export type optionSelected = {
    title: string,
    path?: string | null,
}

export type optionNavigation = {
    title: string,
    path?: string | null,
}

export const InventarioContext = React.createContext<{
    selected: optionSelected | null,
    setSelected: (v: optionSelected) => void
} | null>(null);

export const NavigationContext = React.createContext<{
    opcNavigation: optionNavigation | null,
    setOpcNavigation: (v: optionNavigation) => void,
} | null>(null)

export function useInventarioContext() {
    const ctx = React.useContext(InventarioContext);

    if(!ctx) throw new Error(
        'useInventarioCtx debe usarse dentro de InventarioContext.Provider'
    )

    return ctx
}

export function useNavigationContext() {
    const ctx = React.useContext(NavigationContext);

    if (!ctx) throw new Error(
        'useNavigationCtx debe usarse dentro de InventarioContext.Provider'
    )

    return ctx
}