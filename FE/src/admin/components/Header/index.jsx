import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Box, Drawer, TextField, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';

Header.propTypes = {};

const drawerWidth = 240;

function Header(props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: 'margin-left 0.3s, width 0.3s',
          width: `calc(100% - ${open ? drawerWidth : 60}px)`,
          marginLeft: `${open ? drawerWidth : 60}px`,
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={toggleDrawer}>
            <MenuIcon />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              sx={{ marginRight: 2, width: '200px' }} // Thêm margin và chỉnh kích thước
            />
            <AccountCircleIcon />
          </div>
        </div>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <NavMenu isMenu={open}></NavMenu>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
