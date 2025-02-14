import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Avatar, Box, Button, Fade, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginWindow, logout } from 'features/Auth/userSlice';
import { useClearCartMutation } from 'features/Cart/cartApi';
import { KeyboardArrowDown, ShoppingCart } from '@mui/icons-material';

NavWeb.propTypes = {
  listCategory: PropTypes.array.isRequired,
};

function NavWeb({ listCategory }) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const currentUser = useSelector((state) => state.user.current);

  const dispatch = useDispatch();
  const [clearCart] = useClearCartMutation();

  // State cho menu danh mục
  const [menuCategoryAnchor, setMenuCategoryAnchor] = useState(null);
  const menuCategoryOpen = Boolean(menuCategoryAnchor);

  // State cho menu tài khoản
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const accountMenuOpen = Boolean(accountMenuAnchor);

  const handleClickOpen = () => {
    dispatch(loginWindow());
  };

  const handleCategoryToggle = (event) => {
    setMenuCategoryAnchor(event.currentTarget);
  };

  const handleCloseCategoryMenu = () => {
    setMenuCategoryAnchor(null);
  };

  const handleClickAccountMenu = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = async () => {
    dispatch(logout());
    await clearCart();
    handleCloseAccountMenu();
  };

  return (
    <div className="nav-content">
      <div className="nav_logo">
        <Link className="navLink" to="/">
          <Typography>SHOPKHANH</Typography>
        </Link>
      </div>
      <div className="nav__link">
        {/* Danh mục */}
        <div>
          <Button
            sx={{ width: 'auto', color: 'inherit' }}
            endIcon={<KeyboardArrowDown />}
            onClick={handleCategoryToggle}
          >
            <Typography>DANH MỤC</Typography>
          </Button>
          <Menu
            anchorEl={menuCategoryAnchor}
            open={menuCategoryOpen}
            onClose={handleCloseCategoryMenu}
            MenuListProps={{ onMouseLeave: handleCloseCategoryMenu }}
          >
            {listCategory.map((item) => {
              return (
                <MenuItem
                  key={item.id}
                  component={Link}
                  to={`/products?category=${encodeURIComponent(JSON.stringify(item))}`}
                  onClick={handleCloseCategoryMenu}
                >
                  {item.name}
                </MenuItem>
              );
            })}
          </Menu>
        </div>

        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'navLink')} to="/newproduct">
          <Typography>NEW ARRIVALS</Typography>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'navLink')} to="/albums">
          <Typography>ALBUM</Typography>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'navLink')} to="/products">
          <Typography>PRODUCT</Typography>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'navLink')} to="/bill/all">
          <Typography>BILL</Typography>
        </NavLink>
      </div>

      <nav className="nav">
        {/* Giỏ hàng */}
        <Link to="/cart">
          <IconButton className="icon_cart">
            <ShoppingCart />
            <span>{cartQuery?.data?.data?.length || ''}</span>
          </IconButton>
        </Link>

        {/* Hiển thị login/register nếu chưa đăng nhập */}
        {!currentUser || !currentUser.jti ? (
          <div className="nav__sign">
            <Button color="inherit" onClick={handleClickOpen}>
              Login
            </Button>
            <Button color="inherit" onClick={handleClickOpen}>
              Register
            </Button>
          </div>
        ) : (
          // Hiển thị avatar nếu đã đăng nhập
          <IconButton onClick={handleClickAccountMenu}>
            <Avatar />
          </IconButton>
        )}

        {/* Menu tài khoản */}
        {!(!currentUser || !currentUser.jti) && (
          <Menu
            anchorEl={accountMenuAnchor}
            open={accountMenuOpen}
            onClose={handleCloseAccountMenu}
            MenuListProps={{ onMouseLeave: handleCloseAccountMenu }}
          >
            <MenuItem onClick={handleCloseAccountMenu}>Profile</MenuItem>
            <MenuItem onClick={handleCloseAccountMenu}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        )}
      </nav>
    </div>
  );
}

export default NavWeb;
