import {
    configureStore
} from '@reduxjs/toolkit'
import { authSlice, inventariosSlice } from './slices/slices'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist/es/constants'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authSlice.reducer),
    inventario: inventariosSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)