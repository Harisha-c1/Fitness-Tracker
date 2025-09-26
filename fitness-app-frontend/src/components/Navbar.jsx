
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "../store/authSlice";
import { AuthContext } from "react-oauth2-code-pkce";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token: keycloakToken, tokenData, logIn, logOut } =
    useContext(AuthContext);

  
  useEffect(() => {
    if (keycloakToken) {
      dispatch(
        setCredentials({
          token: keycloakToken,
          user: tokenData,
          userId: tokenData?.sub,
        })
      );
    } else {
      dispatch(logout());
    }
  }, [keycloakToken, tokenData, dispatch]);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    logOut();
    handleClose();
    navigate("/");
  };

  
  const handleProtectedNav = (path) => {
    if (token) {
      navigate(path);
    } else {
      logIn();
    }
  };


  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  
  const navItemStyle = (path) => ({
    textTransform: "none",
    borderBottom:
      location.pathname === path ? "3px solid #00e676" : "3px solid transparent",
    pb: 0.5,
    transition: "border-bottom 0.3s ease-in-out",
  });

  
  const mobileLinks = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleProtectedNav("/dashboard")}
            sx={navItemStyle("/dashboard")}
          >
            <ListItemText primary="My Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleProtectedNav("/activities")}
            sx={navItemStyle("/activities")}
          >
            <ListItemText primary="Activities" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleProtectedNav("/ai-assistant")}
            sx={navItemStyle("/ai-assistant")}
          >
            <ListItemText primary="AI Coach" />
          </ListItemButton>
        </ListItem>
        {token && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleProtectedNav("/activity-form")}
              sx={navItemStyle("/activity-form")}
            >
              <ListItemText primary="Add Activity" />
            </ListItemButton>
          </ListItem>
        )}

        {token ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => logIn()}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: "linear-gradient(90deg,#0f1724,#0b1220)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <Container maxWidth={false} sx={{ px: 2 }}>
        <Toolbar disableGutters sx={{ display: "flex" }}>
          {/* Logo / Home */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              flexGrow: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: 0.6 }}
            >
              Fitness Tracker
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
              ml: "auto",
            }}
          >
            <Button
              onClick={() => handleProtectedNav("/dashboard")}
              color="inherit"
              sx={navItemStyle("/dashboard")}
            >
              My Dashboard
            </Button>
            <Button
              onClick={() => handleProtectedNav("/activities")}
              color="inherit"
              sx={navItemStyle("/activities")}
            >
              Activities
            </Button>
            <Button
              onClick={() => handleProtectedNav("/ai-assistant")}
              color="inherit"
              sx={navItemStyle("/ai-assistant")}
            >
              AI Coach
            </Button>

            {token ? (
              <>
                <IconButton onClick={handleMenu} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/activity-form");
                    }}
                    sx={navItemStyle("/activity-form")}
                  >
                    Add Activity
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => logIn()}
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.18)",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": { borderColor: "rgba(255,255,255,0.28)" },
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Hamburger */}
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        {mobileLinks}
      </Drawer>
    </AppBar>
  );
}











































































































 