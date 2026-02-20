import { createSlice } from "@reduxjs/toolkit";
import type { InventarioQL } from '../../helpers/interfaces';

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
        }
    }
})

export const inventariosSlice = createSlice({
    name: 'inventarios',
    initialState: {
        inventarios: [] as InventarioQL[],
    },
    reducers: {
        setInventarios: (state, action) => {
            state.inventarios = action.payload;
        },
        clearInventarios: (state) => {
            state.inventarios = [];
        }
    }
})