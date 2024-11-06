import React, { useEffect, useState } from "react";
import { Menu, MenuItem, IconButton, Button, Badge } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [productMenuOpen, setProductMenuOpen] = useState(false); // State to manage submenu visibility
  const [timeoutId, setTimeoutId] = useState(null); // State to store timeout ID
  const [cartCount, setCartCount] = useState(0);
  const open = Boolean(anchorEl);
  const navigation = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigation("/");
  };

  // Show the submenu immediately on mouse enter
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear any previous timeout to avoid premature hiding
    }
    setProductMenuOpen(true);
  };

  // Hide the submenu after 1 second on mouse leave
  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setProductMenuOpen(false);
    }, 200);
    setTimeoutId(id); // Store the timeout ID
  };

  return (
    <div
      style={{
        backgroundColor: "#9a9a9a",
        padding: "10px 20px",
      }}
    >
      <div
        style={{
          
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1120px",
          margin: "auto",
        }}
      >
        <div>
          <img  style={{
          width: "50px", height:"50px"
        }} src="../logo.png" alt="" />
        </div>
        <nav>
          <ul style={{ display: "flex", listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ margin: "0 10px" }}>
              <a
                href="/"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                }}
              >
                Home
              </a>
            </li>

            {/* Products with Submenu */}
            <li
              style={{ margin: "0 10px", position: "relative" }}
              onMouseEnter={handleMouseEnter} // Show submenu on mouse enter
              onMouseLeave={handleMouseLeave} // Hide submenu after 1s on mouse leave
            >
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                }}
              >
                Products
              </a>

              {/* Submenu */}
              {productMenuOpen && (
                <ul
                  style={{
                    position: "absolute",
                    top: "40px",
                    left: "0",
                    backgroundColor: "#fff",
                    padding: "10px 0",
                    borderRadius: "4px",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                    listStyle: "none",
                    minWidth: "200px",
                    zIndex: 1000,
                  }}
                >
                  <li style={{ padding: "8px 12px" }}>
                    <a href="/products/fruit-trees" style={{ textDecoration: "none", color: "#333" }}>
                      Fruit Tree
                    </a>
                  </li>
                  <li style={{ padding: "8px 12px" }}>
                    <a href="/products/flowering-trees" style={{ textDecoration: "none", color: "#333" }}>
                      Flowering Tree
                    </a>
                  </li>
                  <li style={{ padding: "8px 12px" }}>
                    <a href="/products/shade-trees" style={{ textDecoration: "none", color: "#333" }}>
                      Shade Tree
                    </a>
                  </li>
                  <li style={{ padding: "8px 12px" }}>
                    <a href="/products/ornamental-trees" style={{ textDecoration: "none", color: "#333" }}>
                      Ornamental Tree
                    </a>
                  </li>
                  <li style={{ padding: "8px 12px" }}>
                    <a href="/products/evergreen-trees" style={{ textDecoration: "none", color: "#333" }}>
                      Evergreen Tree
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li style={{ margin: "0 10px" }}>
              <a
                href="/about"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                }}
              >
                About
              </a>
            </li>
            <li style={{ margin: "0 10px" }}>
              <a
                href="/contact"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div>
          {user ? (
            <div>
              <IconButton component={Link} to="/cart" color="inherit">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon style={{ color: "#fff" }} />
                </Badge>
              </IconButton>
              <IconButton size="large" edge="end" color="inherit" onClick={handleClick}>
                <AccountCircleIcon style={{ color: "#fff" }} />
                <span style={{ marginLeft: "8px", color: "#fff", fontSize: 14 }}>{user.username}</span>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <a href="/profile" style={{ textDecoration: "none", color: "#000" }}>
                    Profile
                  </a>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/orders" style={{ textDecoration: "none", color: "#000" }}>
                    My Orders
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/contact" style={{ textDecoration: "none", color: "#000" }}>
                    contact
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/about" style={{ textDecoration: "none", color: "#000" }}>
                    about
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <a style={{ textDecoration: "none", color: "#000" }}>Logout</a>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <Button variant="contained" color="secondary" href="/login" style={{ marginRight: "10px" }}>
                Login
              </Button>
              <Button variant="contained" color="secondary" href="/register">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
