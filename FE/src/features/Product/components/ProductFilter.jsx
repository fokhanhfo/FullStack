import React from 'react';
import PropTypes from 'prop-types';
import ProductCategory from './Filters/ProductCategory';
import ProductPrice from './Filters/ProductPrice';
import { Box, Paper, Typography, Button } from '@mui/material';

ProductFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

function ProductFilter({ filters, onChange }) {
  const handleCategoryChange = (category) => {
    const newCategory = { ...category };
    delete newCategory.description;
    if (onChange) {
      const newFilter = {
        ...filters,
        category: JSON.stringify(newCategory),
      };
      onChange(newFilter);
    }
  };

  const handleProductPriceChange = (newPrice) => {
    if (onChange) {
      const newFilter = {
        ...filters,
        price_gte: newPrice.salePrice_gte,
        price_lte: newPrice.salePrice_lte,
      };
      onChange(newFilter);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: 2, backgroundColor: '#f9f9f9', width: 250, display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant="h6" gutterBottom>
        Bộ lọc sản phẩm
      </Typography>
      <Box sx={{ maxHeight: 300, overflowY: 'auto', flexGrow: 1, p: 1 }}>
        <ProductCategory onChange={handleCategoryChange} />
        <ProductPrice onChange={handleProductPriceChange} />
      </Box>
      <Button variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
        Áp dụng
      </Button>
    </Paper>
  );
}

export default ProductFilter;
