import { createSlice } from "@reduxjs/toolkit";
import type { MenuItem } from '../../helpers/types'

type Inventario = {
    name: string
    route: string
    descripcion?: string | null,
    icon: string
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null as string | null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = null;
        },
    },
})

export const inventariosSlice = createSlice({
    name: 'inventarios',
    initialState: {
        inventarios: [] as Inventario[],
        idInventario: 0,
        subModulesDrawer: [] as MenuItem[]
    },
    reducers: {
        setInventarios: (state, action) => {
            state.inventarios = action.payload;
        },
        clearInventarios: (state) => {
            state.inventarios = [];
        },
        setInvetarioSelected: (state, action) => {
            state.idInventario  = action.payload
        },
        setSubMudulesDrawer: (state, action) => {
            state.subModulesDrawer = action.payload
        }
    }
})