import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1DB954" }, // Spotify green
    secondary: { main: "#191414" }, // Dark background
    background: { default: "#F5F7FA" },
  },
  typography: {
    h2: { fontWeight: "bold", letterSpacing: 2 },
    h5: { fontWeight: 300 },
    button: { fontWeight: "bold", textTransform: "uppercase" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "10px 20px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 8px 25px rgba(29,185,84,0.4)", // glow
          },
        },
      },
    },
  },
});

export default theme;
