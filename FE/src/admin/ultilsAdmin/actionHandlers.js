import { toggleAdd, toggleEdit, toggleDelete, toggleView } from '../reduxAdmin/slices/actionsSlice';

export const handleAction = (action, dispatch, currentState) => {
  const { add, edit, del, view } = currentState;

  switch (action) {
    case 'add':
      dispatch(toggleAdd());
      console.log('Thêm:', !add);
      break;
    case 'edit':
      dispatch(toggleEdit());
      console.log('Sửa:', !edit);
      break;
    case 'delete':
      dispatch(toggleDelete());
      console.log('Xóa:', !del);
      break;
    case 'view':
      dispatch(toggleView());
      console.log('Xem:', !view);
      break;
    default:
      console.error('Hành động không hợp lệ:', action);
      break;
  }
};
