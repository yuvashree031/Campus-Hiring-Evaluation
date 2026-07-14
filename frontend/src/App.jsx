import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";
import PriorityInbox from "./pages/PriorityInbox";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    background: {
      default: "#060d1b",
      paper: "#0c1527",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Segoe UI', sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body2: { lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#060d1b",
          minHeight: "100vh",
        },
        "*::-webkit-scrollbar": {
          width: 6,
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.08)",
          borderRadius: 3,
        },
      },
    },
  },
});

function App() {
  const [notificationCount, setNotificationCount] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#060d1b",
          }}
        >
          {}
          <Navbar notificationCount={notificationCount} />

          {}
          <Container
            maxWidth="md"
            sx={{
              py: { xs: 3, sm: 4 },
              px: { xs: 2, sm: 3 },
              flexGrow: 1,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<Notifications onCountUpdate={setNotificationCount} />}
              />
              <Route path="/priority" element={<PriorityInbox />} />
            </Routes>
          </Container>

          {}
          <Box
            component="footer"
            sx={{
              textAlign: "center",
              py: 3,
              px: 2,
              borderTop: "1px solid rgba(255,255,255,0.04)",
              color: "#475569",
              fontSize: "0.8rem",
            }}
          >
            Campus Hiring Evaluation - Notification System
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
