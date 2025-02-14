import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

NavMenu.propTypes = {
  isMenu: PropTypes.bool.isRequired,
};

const menuItems = [
  { id: 'sell', label: 'Tại quầy', link: '../sell' },
  { id: 'product', label: 'Sản phẩm', link: '../products' },
  { id: 'category', label: 'Danh mục', link: '../category' },
  { id: 'bill', label: 'Hóa đơn', link: '../bill' },
  { id: 'permission', label: 'Permission', link: '../permission' },
  {
    id: 'permission_and_user',
    label: 'Permission and User',
    subItems: [
      { id: 'user', label: 'User', link: '../user' },
      { id: 'role_and_permission', label: 'Role And Permission', link: '../role-and-permission' },
    ],
  },
];

function NavMenu({ isMenu }) {
  const [openMenus, setOpenMenus] = useState({});

  const handleClick = useCallback((menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: '#3e47a9' }}>
      <div className="header_home_img">
        <Link style={{ textDecoration: 'none' }} to="./home">
          {isMenu ? 'ADMIN' : <InboxIcon />}
        </Link>
      </div>

      <div className="nav_menu_content">
        {menuItems.map((menu) => (
          <div className={`menu_management ${menu.id}`} key={menu.id}>
            {menu.subItems ? (
              <>
                <ListItemButton onClick={() => handleClick(menu.id)} sx={{ color: 'white' }}>
                  <ListItemIcon sx={{ minWidth: '24px' }}>
                    <InboxIcon />
                  </ListItemIcon>
                  {isMenu && <ListItemText primary={menu.label} sx={{ pl: 2 }} />}
                  {isMenu && (openMenus[menu.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={openMenus[menu.id] && isMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.subItems.map((subItem) => (
                      <NavLink
                        to={subItem.link}
                        key={subItem.id}
                        className={({ isActive }) =>
                          isActive ? 'item_menu_management active-link' : 'item_menu_management link'
                        }
                        style={{ textDecoration: 'none', color: 'white' }}
                      >
                        <ListItemButton sx={{ pl: 2.5, color: 'white' }}>
                          <ListItemIcon sx={{ minWidth: '40px', visibility: 'hidden' }}>
                            <InboxIcon />
                          </ListItemIcon>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      </NavLink>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <NavLink
                to={menu.link}
                className={({ isActive }) =>
                  isActive ? 'item_menu_management active-link' : 'item_menu_management link'
                }
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: '24px' }}>
                    <InboxIcon />
                  </ListItemIcon>
                  {isMenu && <ListItemText primary={menu.label} sx={{ pl: 2 }} />}
                </ListItemButton>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NavMenu;
