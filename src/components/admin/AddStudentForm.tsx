/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import { studentApi, StudentCreateRequest } from '@/api/studentApi';

interface AddStudentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // callback to refresh table
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    student_id: '',
    password: '',
    confirm_password: '',
    phone: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    const data: StudentCreateRequest = {
      ...formData,
      role: 'STUDENT',
    };

    try {
      await studentApi.createStudent(data);
      if (onSuccess) onSuccess();
      onClose();
      setFormData({ first_name: '', last_name: '', email: '', student_id: '', password: '', confirm_password: '', phone: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Student</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="first_name"
              fullWidth
              value={formData.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              value={formData.last_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Student ID"
              name="student_id"
              fullWidth
              value={formData.student_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              name="confirm_password"
              type="password"
              fullWidth
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Register</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentForm;
