import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f766e", // SBP Green
    },
    secondary: {
      main: "#14b8a6",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
