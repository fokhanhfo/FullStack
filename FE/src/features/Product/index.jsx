import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import ListPage from './pages/ListPage';
import { Box, Container } from '@mui/material';
import DetailPage from './pages/DetailPage';

ProductFeatureCopy.propTypes = {};

function ProductFeatureCopy(props) {
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<ListPage />} />
        <Route path="/:productId" element={<DetailPage />} />
      </Routes>
    </Container>
  );
}

export default ProductFeatureCopy;
