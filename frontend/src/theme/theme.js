import { createTheme } from "@mui/material/styles";

export const palette = {
  primary: "#1565C0",
  primaryLight: "#42A5F5",
  primaryDark: "#0D47A1",

  secondary: "#00BCD4",

  background: "#F4F8FC",
  paper: "rgba(255,255,255,0.75)",

  textPrimary: "#102A43",
  textSecondary: "#627D98",

  border: "rgba(255,255,255,0.4)",
};

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: palette.primary,
        light: palette.primaryLight,
        dark: palette.primaryDark,
        contrastText: "#fff",
      },

      secondary: {
        main: palette.secondary,
        contrastText: "#fff",
      },

      background:
        mode === "light"
          ? {
              default: "#F4F8FC",
              paper: "rgba(255,255,255,0.75)",
            }
          : {
              default: "#0A1929",
              paper: "rgba(14,25,42,0.75)",
            },

      text:
        mode === "light"
          ? {
              primary: "#102A43",
              secondary: "#627D98",
            }
          : {
              primary: "#FFFFFF",
              secondary: "#A9BDD1",
            },
    },

    typography: {
      fontFamily: '"Inter", "Segoe UI", sans-serif',

      h1: {
        fontWeight: 800,
        letterSpacing: "-0.03em",
      },

      h2: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },

      h3: {
        fontWeight: 700,
      },

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 600,
      },

      h6: {
        fontWeight: 600,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 20,
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "none",
            color: "#102A43",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow:
              "0 8px 32px rgba(31, 38, 135, 0.12)",
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow:
              "0 8px 32px rgba(15, 23, 42, 0.08)",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingLeft: 24,
            paddingRight: 24,
            transition: "all 0.3s ease",
          },

          contained: {
            background:
              "linear-gradient(135deg,#1976D2,#42A5F5)",

            boxShadow:
              "0 10px 25px rgba(25,118,210,0.25)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#1565C0,#2196F3)",

              transform: "translateY(-2px)",

              boxShadow:
                "0 15px 30px rgba(25,118,210,0.35)",
            },
          },

          outlined: {
            borderColor: "#1976D2",

            "&:hover": {
              background: "rgba(25,118,210,0.08)",
            },
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "0.3s",

            "&:hover": {
              background: "rgba(25,118,210,0.08)",
              transform: "scale(1.05)",
            },
          },
        },
      },
    },
  });