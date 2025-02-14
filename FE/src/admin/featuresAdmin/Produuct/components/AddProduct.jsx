import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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
import { useAddProductMutation, useUpdateProductMutation } from '../hook/productApi';

AddProduct.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

function AddProduct({ actionsState, onSubmit, initialValues }) {
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  console.log(activeAction);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const baseSchema = {
    name: yup.string().required('Bắt buộc'),
    detail: yup.string().required('Bắt buộc'),
    price: yup.number().required('Bắt buộc'),
    quantity: yup.number().required('Bắt buộc'),
    category: yup.object().required('Bắt buộc'),
  };

  const schema = yup.object(
    activeAction === 'edit'
      ? { ...baseSchema, id: yup.number().required('Bắt buộc'), status: yup.number().required('Bắt buộc') }
      : { ...baseSchema, file: yup.mixed().required('Bắt buộc') },
  );

  const form = useForm({
    defaultValues: {
      id: '',
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
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (activeAction === 'edit') {
        const payload = { ...values, category: values.category };
        await updateProduct(payload);
      } else {
        const payload = new FormData();
        payload.append('name', values.name);
        payload.append('detail', values.detail);
        payload.append('price', values.price);
        payload.append('quantity', values.quantity);
        payload.append('category', JSON.stringify(values.category));

        if (values.file && values.file.length > 0) {
          for (let i = 0; i < values.file.length; i++) {
            payload.append('images', values.file[i]);
          }
        }
        await addProduct(payload).unwrap();
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
        id: initialValues.id || '',
        name: initialValues.name || '',
        detail: initialValues.detail || '',
        price: initialValues.price || '',
        quantity: initialValues.quantity || '',
        category: initialValues.category || '',
        status: initialValues.status || '',
      });
    }
  }, [initialValues, form]);

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={add || edit}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {add ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}
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
          <InputField name="name" label="Tên sản phẩm" form={form}></InputField>
          <CKEditorForm name="detail" lable="Chi tiết sản phẩm" form={form} />
          <InputField name="price" label="Giá tiền" form={form} />
          <InputField name="quantity" label="Số lượng sản phẩm" form={form} />
          <SelectFrom name="category" label="Danh mục" form={form} options={categoryQuery.data.data} />
          {!(activeAction === 'edit') && <FileForm name="file" form={form} />}
          {activeAction === 'edit' && <RadioForm name="status" label="Trạng thái" form={form} option={optionStatus} />}
        </DialogContent>
        <DialogActions>
          <Button type="submit" autoFocus disabled={isSubmitting}>
            {add ? 'Thêm' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddProduct;
