import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: "#1A237E",
        },
        background: {
            // default: "#f5f5f5",
            default: 'rgba(252, 252, 252)'
            // paper: "#0f172a"
        }
    },
    typography: {
        fontFamily: ['Poppins', 'system-ui', 'Segoe UI', 'Roboto', 'Arial'].join(',')
    },
    shape: {
        borderRadius: 14
    }
})