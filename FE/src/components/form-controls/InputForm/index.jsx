import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  width: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  height: PropTypes.string,
};

function InputField(props) {
  const { form, name, label, disabled, width, height } = props;
  // const {errors,formState} = form;
  // console.log(errors,formState);
  const {
    formState: { errors },
  } = form;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <TextField
          {...field}
          margin="normal"
          variant="outlined"
          fullWidth
          label={label}
          disabled={disabled}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          sx={{ width: width || '100%', height: height || '100%' }}
        />
      )}
    />
  );
}

export default InputField;
