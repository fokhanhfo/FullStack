import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
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
import { useAddProductMutation } from '../hook/productApi';
import ListImage from './ListImage';
import { formatPrice } from 'utils';

ViewProduct.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

function ViewProduct({ actionsState, onSubmit, initialValues }) {
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  console.log(activeAction);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  console.log(initialValues);
  let schema;
  if (activeAction === 'edit') {
    schema = yup
      .object({
        name: yup.string().required('Băt buộc'),
        detail: yup.string().required('Bắt buộc'),
        price: yup.number().required('Bắt buộc'),
        quantity: yup.number().required('Bắt buộc'),
        category: yup.string().required('Bắt buộc'),
        status: yup.number().required('Bắt buộc'),
      })
      .required();
  } else {
    schema = yup
      .object({
        name: yup.string().required('Băt buộc'),
        detail: yup.string().required('Bắt buộc'),
        price: yup.number().required('Bắt buộc'),
        quantity: yup.number().required('Bắt buộc'),
        category: yup.object().required('Bắt buộc'),
        file: yup.mixed().required('Bắt buộc'),
      })
      .required();
  }

  const form = useForm({
    defaultValues: {
      name: '',
      detail: '',
      price: '',
      quantity: '',
      category: '',
      status: '',
      file: null,
    },
    resolver: yupResolver(schema),
  });

  // const handleSubmit = (value) => {
  //   if (handleClose) {
  //     handleClose();
  //   }
  //   form.reset();
  // };
  const [addProduct] = useAddProductMutation();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (activeAction === 'edit') {
        onSubmit(values);
      } else {
        const formData = new FormData();
        console.log(values.category);
        formData.append('name', values.name);
        formData.append('detail', values.detail);
        formData.append('price', values.price);
        formData.append('quantity', values.quantity);
        formData.append('category', JSON.stringify(values.category));
        if (values.file && values.file.length > 0) {
          for (let i = 0; i < values.file.length; i++) {
            formData.append('images', values.file[i]);
          }
        }
        await addProduct(formData).unwrap();
      }
      enqueueSnackbar('success', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('error' + err, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
      form.reset();
      handleAction(activeAction, dispatch, { add, edit, del, view });
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        detail: initialValues.detail || '',
        price: formatPrice(initialValues.price) || '',
        quantity: initialValues.quantity || '',
        category: initialValues.category || '',
        status: initialValues.status || '',
      });
    }
  }, [initialValues, form]);

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={view}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Sản phẩm {initialValues.name}
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
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent dividers>
          <InputField name="name" label="Tên sản phẩm" form={form} disabled></InputField>
          <CKEditorForm name="detail" lable="Chi tiết sản phẩm" form={form} disabled />
          <InputField name="price" label="Giá tiền" form={form} disabled />
          <InputField name="quantity" label="Số lượng sản phẩm" form={form} disabled />
          <SelectFrom name="category" label="Danh mục" form={form} options={categoryQuery.data.data} disabled />
          {activeAction === 'edit' ||
            (activeAction === 'view' && (
              <RadioForm name="status" label="Trạng thái" form={form} option={optionStatus} disabled />
            ))}
        </DialogContent>
      </form>
      {initialValues.imagesUrl.length > 0 && (
        <Grid container spacing={2} mt={2}>
          {initialValues.imagesUrl.map((url, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardMedia component="img" height="140" image={url} alt={`image-${index}`} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Dialog>
  );
}

export default ViewProduct;
