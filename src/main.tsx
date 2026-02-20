import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme/theme.ts'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { LicenseInfo } from '@mui/x-license';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './appStore/store.ts'
import { Provider } from 'react-redux'

// Activa la licencia
LicenseInfo.setLicenseKey(
  'e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y'
);

// FOR DEV
axios.defaults.baseURL = 'http://localhost:3010/'

// FOR DOCKER COMPOSE
// axios.defaults.baseURL = 'http://localhost:8110/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
      </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)