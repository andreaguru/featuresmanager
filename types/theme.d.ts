// src/theme/theme.d.ts
import "@mui/material/styles";

// Extend the Theme interface
declare module "@mui/material/styles" {
    interface Theme {
        custom: {
            clientCardHeight: number;
        };
    }

    // Allow configuration using `createTheme`
    interface ThemeOptions {
        custom?: {
            clientCardHeight?: number;
        };
    }
}
