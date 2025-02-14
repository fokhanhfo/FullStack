import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import Loading from 'components/Loading';
import { Box, Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import BillDetail from 'components/billDetail/BillDetail';
import UserInformation from 'components/billDetail/UserInformation';

PageBillDetail.propTypes = {};

function PageBillDetail() {
  const { enqueueSnackbar } = useSnackbar();
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillId = async () => {
      try {
        const response = await billApi.get(billId);
        if (response) {
          setBill(response.data);
        }
      } catch (error) {
        enqueueSnackbar('Lỗi khi tải hóa đơn', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBillId();
  }, [billId, enqueueSnackbar]);

  if (isLoading) return <Loading />;
  if (!bill) return <Typography>Không tìm thấy hóa đơn</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Chi Tiết Hóa Đơn
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <UserInformation bill={bill} />
      </Paper>
      <Box sx={{ mt: 4 }}>
        <BillDetail billDetail={bill.billDetail} />
      </Box>
    </Box>
  );
}

export default PageBillDetail;
