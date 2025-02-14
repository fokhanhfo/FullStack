import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  List,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../CartContext';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch } from 'react-redux';
import PayOrder from './PayOrder';

OrdersTab.propTypes = {
  actionsState: PropTypes.object,
};

function OrdersTab({ actionsState }) {
  const { cart, setCart } = useCart();

  const dispatch = useDispatch();

  const handleIncreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveProduct = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🛒 Order
      </Typography>
      <Divider sx={{ marginY: 2 }} />

      {/* Box chứa danh sách sản phẩm */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {cart.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
            <Typography variant="body1" color="text.secondary">
              Giỏ hàng trống.
            </Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto', maxHeight: '450px' }}>
            {cart.map((product) => (
              <Card
                key={product.id}
                sx={{
                  marginBottom: 2,
                  boxShadow: 1,
                  '&:hover': { boxShadow: 4 },
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Avatar
                      variant="rounded"
                      sx={{ width: 64, height: 64, marginRight: 2 }}
                      src={product.imagesUrl ? product.imagesUrl[0] : 'https://via.placeholder.com/64'}
                    />
                    <Box>
                      <Typography fontWeight="bold" variant="body1">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Giá: {product.price.toLocaleString()} VND
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent={'center'}>
                    <IconButton onClick={() => handleDecreaseQuantity(product.id)} color="primary">
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ marginX: 1 }}>
                      {product.quantity}
                    </Typography>
                    <IconButton onClick={() => handleIncreaseQuantity(product.id)} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                  }}
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  <IconButton size="small">
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ marginY: 2 }} />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Tổng tiền: {totalPrice.toLocaleString()} VND
        </Typography>
        <Button sx={{ float: 'right' }} onClick={() => handleActions('view')} variant="contained">
          Pay
        </Button>
      </Box>
      <PayOrder cart={cart} totalPrice={totalPrice} actionsState={actionsState} />
    </Box>
  );
}

export default OrdersTab;
