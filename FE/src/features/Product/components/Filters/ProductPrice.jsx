import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import styled from '@emotion/styled';

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

ProductPrice.propTypes = {
  onChange: PropTypes.func,
};

function ProductPrice({ onChange }) {
  const [price, setPrice] = useState({
    salePrice_gte: '',
    salePrice_lte: '',
  });

  const handlePrice = (evt) => {
    const { name, value } = evt.target;
    const numericValue = value.replace(/\D/g, '');
    setPrice((prevValue) => ({
      ...prevValue,
      [name]: numericValue,
    }));
  };

  const handleSubmit = () => {
    if (onChange) {
      onChange(price);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Giá
      </Typography>
      <StyledBox>
        <StyledTextField
          name="salePrice_gte"
          value={price.salePrice_gte}
          type="text"
          onChange={handlePrice}
          size="small"
          placeholder="Từ"
        />
        <ArrowRightAltIcon />
        <StyledTextField
          name="salePrice_lte"
          value={price.salePrice_lte}
          type="text"
          onChange={handlePrice}
          size="small"
          placeholder="Đến"
        />
      </StyledBox>
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Lọc
      </Button>
    </>
  );
}

export default ProductPrice;
