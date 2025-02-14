import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import InputField from 'components/form-controls/InputForm';
import CKEditorForm from 'components/form-controls/CKEditorForm';
import SelectFrom from 'components/form-controls/SelectFrom';
import Loading from 'components/Loading';
import FileForm from 'components/form-controls/FileForm';
import RadioForm from 'components/form-controls/RadioForm';
import { optionStatus } from 'utils/status';
import productApi from 'api/productApi';
import { useAddProductMutation, useUpdateProductMutation } from '../hook/productApi';
import { useDispatch } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import billApi from 'api/billApi';

PayOrder.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  totalPrice: PropTypes.number.isRequired,
  cart: PropTypes.array,
};

function PayOrder({ cart, actionsState, onSubmit, initialValues, totalPrice }) {
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = async () => {
    const newdata = {
      cartRequests: cart,
    };
    const res = await billApi.add(newdata);
  };

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={view}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Thanh toán
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography>Tổng tiền : {totalPrice.toLocaleString()} VND</Typography>
        <Typography>Tiền phải trả :</Typography>
        <NumericFormat
          customInput={TextField}
          label="Số lượng"
          thousandSeparator=","
          decimalScale={0}
          allowNegative={false}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClick} type="submit" autoFocus disabled={isSubmitting}>
          Thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PayOrder;
