import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Paper, TextField, Typography, InputAdornment, Grid, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from 'styled-components';
import { formatPrice } from 'utils';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'components/InfiniteScroll';
import Loading from 'components/Loading';

const StyledTextField = styled(TextField)`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  .MuiInputBase-root {
    border-radius: 8px;
  }
  .MuiInputAdornment-root {
    padding-left: 10px;
  }
`;

function BillAll({ listBill, filter, onSubmit, pagination }) {
  const [page, setPage] = useState(filter.page);
  const [posts, setPosts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if (filter.status) {
      setPosts([...listBill]);
      setPage(1);
    } else {
      setPosts((prevPosts) => {
        const newPosts = listBill.filter((newBill) => !prevPosts.some((prevBill) => prevBill.id === newBill.id));
        return [...prevPosts, ...newPosts];
      });
    }
    setIsSearch(!!filter.search);
  }, [listBill, filter.status, filter.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const newFilter = {
      ...filter,
      search: event.target.search.value,
      page: 1,
    };
    setPosts([]);
    onSubmit(newFilter);
  };

  const fetchMore = () => {
    setTimeout(() => {
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        onSubmit({ ...filter, page: newPage });
        return newPage;
      });
    }, 1000);
  };

  return (
    <Container maxWidth="md">
      {!filter.status && (
        <form onSubmit={handleSearch}>
          <StyledTextField
            name="search"
            placeholder="Tìm kiếm hóa đơn..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </form>
      )}

      <InfiniteScroll
        loader={<Loading />}
        fetchMore={fetchMore}
        hasMore={posts.length < pagination.count}
        endMessage={<Typography textAlign="center">Đã hiển thị tất cả hóa đơn</Typography>}
        isSearch={isSearch}
      >
        {posts.map((bill) => (
          <Paper key={bill.id} elevation={3} sx={{ padding: 3, marginBottom: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              ID Hóa Đơn: {bill.id}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Trạng thái: {bill.status}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {bill.billDetail.map((item, index) => (
              <Grid container spacing={2} alignItems="center" key={index} sx={{ marginBottom: 2 }}>
                <Grid item xs={4} sm={3}>
                  <img
                    src={item.productId.imagesUrl[0]}
                    alt={item.productId.name}
                    style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
                  />
                </Grid>
                <Grid item xs={5} sm={6}>
                  <Typography fontWeight="bold">{item.productId.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Số lượng: {item.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3} textAlign="right">
                  <Typography fontWeight="bold" color="primary">
                    {formatPrice(item.productId.price)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
            <Box textAlign="right">
              <Link to={`../${bill.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="contained" startIcon={<VisibilityIcon />}>
                  Chi Tiết
                </Button>
              </Link>
            </Box>
          </Paper>
        ))}
      </InfiniteScroll>
    </Container>
  );
}

BillAll.propTypes = {
  listBill: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
};

export default BillAll;
