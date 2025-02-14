import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import ProductFilter from '../components/ProductFilter';
import ListProduct from '../components/ListProduct';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import productApi from 'api/productApi';
import Loading from 'components/Loading';
import { Box, Button, Pagination, PaginationItem } from '@mui/material';
import { Add, ArrowLeft, ArrowRight } from '@mui/icons-material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import styled from 'styled-components';
import { useGetProductsQuery } from 'admin/featuresAdmin/Produuct/hook/productApi';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch } from 'react-redux';
import AddProduct from '../components/AddProduct';
import AddIcon from '@mui/icons-material/Add';

ListPageProduct.propTypes = {
  actionsState: PropTypes.object.isRequired,
};

const StyledButton = styled(Button)`
  float: right;
`;

function ListPageProduct({ actionsState }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 5,
      status: Number.parseInt(params.status) || 1,
      ...params,
    };
  }, [location.search]);

  const { data, error, isLoading } = useGetProductsQuery(queryParams);

  if (isLoading) return <Loading />;
  if (error) return <p>Đã xảy ra lỗi khi tải sản phẩm!</p>;

  const products = data?.data.products || [];
  const pagination = data?.data || {};

  // const rows = [];
  // products.forEach(element => {
  //     rows.push(createData(
  //         element.id,
  //         element.name,
  //         element.detail,
  //         element.price,
  //         element.quantity,
  //         element.category.name,
  //         element.imagesUrl[0],
  //         element.status
  //     ));
  // });

  // console.log(rows);

  const handleNextPage = (event, page) => {
    const newFilter = {
      ...queryParams,
      page: page,
    };
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  const handleChangeFilter = (newfilter) => {
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newfilter),
      },
      { replace: true },
    );
  };
  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  return (
    <div>
      <div className="title">
        <h3>Sản phẩm</h3>
      </div>
      {loading ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProductFilter filter={queryParams} onSubmit={handleChangeFilter} />
            <Box>
              <Button
                sx={{ float: 'right' }}
                startIcon={<AddIcon />}
                onClick={() => handleActions('add')}
                variant="contained"
              >
                Add
              </Button>
            </Box>
            <ListProduct actionsState={actionsState} products={products} />
            <Box>
              <Pagination
                sx={{ justifyContent: 'center' }}
                count={Math.ceil(pagination.count / queryParams.limit)}
                page={Number.parseInt(queryParams.page)}
                onChange={handleNextPage}
                renderItem={(item) => <PaginationItem slots={{ previous: ArrowLeft, next: ArrowRight }} {...item} />}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Loading></Loading>
      )}
      {actionsState.add && <AddProduct actionsState={actionsState} />}
    </div>
  );
}

export default ListPageProduct;
