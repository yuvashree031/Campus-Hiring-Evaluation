







import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ notificationCount = 0 }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  
  const navItems = [
    { label: "Notifications", path: "/", icon: <NotificationsActiveIcon fontSize="small" /> },
    { label: "Priority Inbox", path: "/priority", icon: <InboxIcon fontSize="small" /> },
  ];

  
  const isActive = (path) => location.pathname === path;

  
  const drawer = (
    <Box
      sx={{ width: 250, bgcolor: "#0a1628", height: "100%" }}
      onClick={() => setDrawerOpen(false)}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography variant="h6" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
          Campus Hiring
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                color: isActive(item.path) ? "#60a5fa" : "#94a3b8",
                "&.Mui-selected": {
                  bgcolor: "rgba(96,165,250,0.08)",
                },
                "&:hover": {
                  bgcolor: "rgba(96,165,250,0.05)",
                },
              }}
            >
              <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>{item.icon}</Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(10, 22, 40, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          {}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}>
            <Badge
              badgeContent={notificationCount}
              color="primary"
              max={99}
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#3b82f6",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                },
              }}
            >
              <NotificationsActiveIcon sx={{ color: "#60a5fa", fontSize: 26 }} />
            </Badge>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: "#e2e8f0",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                textDecoration: "none",
                fontSize: { xs: "0.95rem", sm: "1.15rem" },
              }}
            >
              Campus Hiring Evaluation
            </Typography>
          </Box>

          {}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path) ? "#60a5fa" : "#94a3b8",
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    bgcolor: isActive(item.path) ? "rgba(96,165,250,0.08)" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(96,165,250,0.12)",
                      color: "#e2e8f0",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: "#0a1628" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
