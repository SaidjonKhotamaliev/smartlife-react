import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  ListItemIcon,
  Menu,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import { NavLink, useHistory } from "react-router-dom";
import Basket from "./Basket";
import { useEffect, useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  anchorEl: HTMLElement | null;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    anchorEl,
    handleLogoutClick,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  // HANDLERS

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        <Stack className="menu">
          <Box>
            <NavLink to={"/"}>
              <h1 className="logo-word">SMARTLIFE</h1>
            </NavLink>
          </Box>
          <Stack className="links">
            <Box className={"hover-line"}>
              <NavLink to={"/"} activeClassName={"underline"}>
                Home
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to={"/products"} activeClassName={"underline"}>
                Products
              </NavLink>
            </Box>

            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to={"/orders"} activeClassName={"underline"}>
                  Orders
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink to={"/member-page"} activeClassName={"underline"}>
                  My Page
                </NavLink>
              </Box>
            ) : null}
            <Box className={"hover-line"}>
              <NavLink to={"/help"} activeClassName={"underline"}>
                Help
              </NavLink>
            </Box>

            <Basket
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
            />
            {authMember ? (
              <Box>
                <img
                  className="user-avatar"
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember?.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  aria-haspopup={"true"}
                  onClick={handleLogoutClick}
                />
              </Box>
            ) : null}

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Stack className="header-frame">
          <Stack className="detail">
            <Box className="head-main-txt">Empowering Your Smart Life!</Box>
            <Box className="wel-txt">
              At Smartlife, we bring you the latest and most innovative gadgets,
              carefully selected to enhance your everyday life. From
              cutting-edge smartphones to must-have accessories, discover a
              world where technology meets convenience.
            </Box>
            <Stack
              marginTop={"30px"}
              gap={"20px"}
              display={"flex"}
              flexDirection={"row"}
            >
              {!authMember ? (
                <Box>
                  <Button
                    onClick={() => setLoginOpen(true)}
                    className="login-button"
                    variant="contained"
                  >
                    Login
                  </Button>
                </Box>
              ) : // <img
              //   className="user-avatar"
              //   src={
              //     authMember?.memberImage
              //       ? `${serverApi}/${authMember?.memberImage}`
              //       : "/icons/default-user.svg"
              //   }
              //   aria-haspopup={"true"}
              //   onClick={handleLogoutClick}
              // />
              null}

              <Box className="signup">
                {!authMember ? (
                  <Button
                    variant="contained"
                    className="signup-btn"
                    onClick={() => setSignupOpen(true)}
                  >
                    SIGN UP
                  </Button>
                ) : null}
              </Box>
            </Stack>
          </Stack>
          <Box className="logo-frame">
            <div className="logo-img"></div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
