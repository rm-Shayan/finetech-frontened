import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import {type ReactNode } from "react";
import theme from "../../config/theme";

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
