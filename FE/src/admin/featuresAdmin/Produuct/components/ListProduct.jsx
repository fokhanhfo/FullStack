import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import productApi from 'api/productApi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './styled.scss';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useSnackbar } from 'notistack';
import TableHeadComponent from 'admin/components/Table/TableHeadComponent';
import ReusableTable from 'admin/components/Table/ReusableTable';
import { formatPrice } from 'utils';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import AddProduct from './AddProduct';
import ViewProduct from './ViewProduct';
import { render } from '@testing-library/react';

ListProduct.propTypes = {
  products: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListProduct({ products, actionsState }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const listHead = [
    { label: 'ID', key: 'id', width: '5%' },
    {
      label: 'Name',
      key: 'name',
      width: '15%',
      render: (row) => (
        <>
          <span
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => handleActions('view', row)}
          >
            {row.name}
          </span>
        </>
      ),
    },
    { label: 'Detail', key: 'detail', width: '20%' },
    {
      label: 'Price',
      key: 'price',
      width: '10%',
      render: (row) => {
        const listPrice = row.productDetails.map((productDetails) => productDetails.sellingPrice).sort((a, b) => a - b);
        console.log(listPrice[-1]);
        return (
          <>
            {formatPrice(listPrice[0])}-{formatPrice(listPrice[listPrice.length - 1])}
          </>
        );
      },
    },
    {
      label: 'Quantity',
      width: '10%',
      render: (row) => {
        const totalQuantity = row.productDetails.reduce((sum, productDetail) => sum + productDetail.quantity, 0);
        return <>{totalQuantity}</>;
      },
    },
    { label: 'Category', width: '10%', render: (row) => row.category.name },
    {
      label: 'Images',
      width: '15%',
      render: (row) => {
        return (
          <>
            <img
            // src={row?.imagesUrl[0]} alt="" style={{ width: 50, height: 50 }}
            />
            <Button>
              <Link to={`./${row.id}/image/`}>Danh sách ảnh</Link>
            </Button>
          </>
        );
      },
    },
    {
      label: 'Actions',
      width: '5%',
      render: (row) => (
        <>
          <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleActions('edit', row)}>
            <Update />
          </IconButton>
        </>
      ),
    },
    {
      label: 'Status',
      width: '20%',
      render: (row) => (
        <FormControl fullWidth>
          <NativeSelect
            value={row.status}
            onChange={(event) => handleClickStatus(event, row)}
            inputProps={{
              name: 'status',
              id: 'status-select',
            }}
          >
            <option value={1}>On</option>
            <option value={0}>Off</option>
          </NativeSelect>
        </FormControl>
      ),
    },
  ];

  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedProduct(row);
    }
    handleAction(state, dispatch, actionsState);
  };

  const handleClickStatus = async (event, product) => {
    try {
      product.status = event.target.value;
      await productApi.update(product);
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
    } catch (e) {
      enqueueSnackbar(`Update trạng thái không thành công: ${e.message}`, { variant: 'error' });
    }
  };

  return (
    <>
      <ReusableTable listHead={listHead} rows={products} />
      {actionsState.add === true ||
        (actionsState.edit === true && <AddProduct actionsState={actionsState} initialValues={selectedProduct} />)}
      {actionsState.view === true && <ViewProduct actionsState={actionsState} initialValues={selectedProduct} />}
    </>
  );
}

export default ListProduct;
