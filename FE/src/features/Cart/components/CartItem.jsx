import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, IconButton, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatPrice } from 'utils';
import styled from 'styled-components';
import { useDeletecartMutation, useUpdateCartMutation } from '../cartApi';
import { useSnackbar } from 'notistack';

CartItem.propTypes = {
  listCart: PropTypes.array.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 12px 0;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PriceText = styled(Typography)`
  font-weight: bold;
  color: #e63946;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledTextField = styled(TextField)`
  width: 50px;
  text-align: center;
`;

function CartItem({ listCart = [], onCheckboxChange }) {
  const [updateCart] = useUpdateCartMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteCart] = useDeletecartMutation();

  const handleIncrement = async (cartItem) => {
    const newQuantity = { ...cartItem, quantity: cartItem.quantity + 1 };
    await updateCart(newQuantity).unwrap();
  };

  const handleDecrement = async (cartItem) => {
    if (cartItem.quantity > 1) {
      const newQuantity = { ...cartItem, quantity: cartItem.quantity - 1 };
      await updateCart(newQuantity).unwrap();
    }
  };

  const handleDelete = async (id) => {
    await deleteCart(id).unwrap();
    enqueueSnackbar('Sản phẩm đã bị xóa', { variant: 'success' });
  };

  return (
    <div>
      {listCart.map((cartItem) => (
        <StyledPaper key={cartItem.id}>
          <Checkbox checked={cartItem.status === 1} onChange={() => onCheckboxChange(cartItem)} />
          <ProductImage src={cartItem.productDetail.imagesUrl} alt={cartItem.productDetail.product.name} />
          <ProductInfo>
            <Typography variant="body1" fontWeight={600}>
              {cartItem.productDetail.product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {cartItem.productDetail.product.category.name}
            </Typography>
            <PriceText>{formatPrice(cartItem.productDetail.sellingPrice * cartItem.quantity)}</PriceText>
          </ProductInfo>
          <QuantityContainer>
            <IconButton onClick={() => handleDecrement(cartItem)}>
              <RemoveIcon />
            </IconButton>
            <StyledTextField value={cartItem.quantity} readOnly />
            <IconButton onClick={() => handleIncrement(cartItem)}>
              <AddIcon />
            </IconButton>
          </QuantityContainer>
          <IconButton color="error" onClick={() => handleDelete(cartItem.id)}>
            <DeleteIcon />
          </IconButton>
        </StyledPaper>
      ))}
    </div>
  );
}

export default CartItem;
