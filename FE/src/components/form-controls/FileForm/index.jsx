import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, FormHelperText, Button, Grid, Card, CardMedia, CardActions, IconButton } from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';

FileForm.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

function FileForm({ form, name, label, disabled }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {
    formState: { errors },
  } = form;

  const handleFileChange = (newFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    form.setValue(name, [...selectedFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    form.setValue(name, newFiles);
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!value[name] || value[name].length === 0) {
        setSelectedFiles([]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, name]);

  return (
    <FormControl margin="normal" fullWidth error={!!errors[name]}>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              id="file-upload"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleFileChange(files);
                field.onChange([...selectedFiles, ...files]);
              }}
              disabled={disabled}
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span" startIcon={<AddPhotoAlternate />} disabled={disabled}>
                {label || 'Upload Images'}
              </Button>
            </label>
          </>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}

      {selectedFiles.length > 0 && (
        <Grid container spacing={2} mt={2}>
          {selectedFiles.map((file, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardMedia component="img" height="140" image={URL.createObjectURL(file)} alt={file.name} />
                <CardActions>
                  <IconButton color="error" onClick={() => removeFile(index)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </FormControl>
  );
}

export default FileForm;
