import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

SelectFrom.propTypes = {
  form: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  transmitId: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function SelectFrom(props) {
  const { height, width, transmitId, form, name, label, disabled, options, onSubmit, isLoading } = props;
  const {
    formState: { errors },
  } = form;

  const handleChange = (event) => {
    const value = event.target.value;
    const selectedValue = value ? JSON.parse(value) : null;
    if (onSubmit) {
      onSubmit(selectedValue);
    }
  };

  return (
    <FormControl
      margin="normal"
      className="select_form"
      sx={{
        width: width || '100%',
        height: height || '100%',
      }}
      error={!!errors[name]}
    >
      <InputLabel id={`${name}-label`} sx={{ top: height ? '-6px' : '' }}>
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${name}-label`}
            id={name}
            value={field.value ? JSON.stringify(field.value) : ''}
            onChange={(e) => {
              const value = e.target.value;
              const selectedOption = value ? JSON.parse(value) : null;
              field.onChange(selectedOption);
              handleChange(e);
            }}
            input={<OutlinedInput label={label} sx={{ height: height || '100%', lineHeight: height || '100%' }} />}
            MenuProps={MenuProps}
            disabled={disabled}
            sx={{ height: height || '100%', display: 'flex', alignItems: 'center' }}
          >
            <MenuItem value="">
              <em>Bỏ chọn</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.id} value={JSON.stringify(option)}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
}

export default SelectFrom;
