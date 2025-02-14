import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import styled from 'styled-components';
import { formatPrice } from 'utils';
import { Link } from 'react-router-dom';

PayCart.propTypes = {
  listCart: PropTypes.array.isRequired,
  onAllCheckboxChange: PropTypes.func.isRequired,
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledTotal = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
  text-align: right;
`;

const StyledLink = styled(Link)`
  background-color: #ff6f61;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    background-color: #e65b50;
  }
`;

function PayCart({ listCart = [], onAllCheckboxChange }) {
  const selectCartItem = listCart.filter((item) => item.status === 1);
  console.log(selectCartItem);
  const totalPrice = selectCartItem.reduce((sum, item) => sum + item.productDetail.sellingPrice * item.quantity, 0);
  const [statusCheckBox, setStatusCheckBox] = useState(1);

  const handleCheckboxChange = (event) => {
    const newStatus = event.target.checked ? 1 : 0;
    setStatusCheckBox(newStatus);
    onAllCheckboxChange(newStatus);
  };

  useEffect(() => {
    const allChecked = listCart.every((item) => item.status === 1);
    setStatusCheckBox(allChecked ? 1 : 0);
  }, [listCart]);

  return (
    <StyledPaper>
      <StyledActions>
        <FormControlLabel
          control={<Checkbox checked={statusCheckBox === 1} onChange={handleCheckboxChange} />}
          label="Chọn tất cả"
        />
        <Button variant="outlined" color="error">
          Xóa
        </Button>
      </StyledActions>
      <StyledTotal>
        <Typography variant="body1">Tổng ({selectCartItem.length} sản phẩm):</Typography>
        <Typography variant="h6" color="primary">
          {formatPrice(totalPrice)}
        </Typography>
        <StyledLink to="/checkout">Thanh Toán</StyledLink>
      </StyledTotal>
    </StyledPaper>
  );
}

export default PayCart;
