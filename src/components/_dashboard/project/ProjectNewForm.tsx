import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { isBefore } from 'date-fns';
// material
import { LoadingButton, MobileDateTimePicker} from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { ProjectManager } from '../../../@types/project';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import countries from './countries';
import { createProject } from 'redux/slices/project';
import { dispatch } from 'redux/store';

// ----------------------------------------------------------------------

type ProjectNewFormProps = {
  isEdit: boolean;
  currentUser?: ProjectManager;
};

export default function ProjectNewForm({ isEdit, currentUser }: ProjectNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProjectSchema = Yup.object().shape({
    project_name: Yup.string().required('name is required'),
    project_size: Yup.string().required('size is required'),
    project_start_date: Yup.date().required('date is required'),
    project_end_date: Yup.date().required('date is required'),
    working_employees: Yup.number(),
    manager: Yup.string().required('Name is required'),
 
  });


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectName: currentUser?.project_name || '',
      projectSize: currentUser?.project_size || '',
      startDate: currentUser?.project_start_date || new Date(),
      end_date: currentUser?.project_end_date|| new Date(),
      working_employees: currentUser?.working_employees || '',
      manager: currentUser?.Manager || '',

    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const newProject = {
          project_name: values.projectName,
          project_size: values.projectSize,
          project_start_date: values.startDate,
          project_end_date: values.end_date,
          working_employees: values.working_employees,
          manager: values.manager
        };
        dispatch(createProject(newProject));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.project.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } =
    formik;

  const isDateError = isBefore(new Date(values.end_date), new Date(values.startDate));

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    {...getFieldProps('project_name')}
                    error={Boolean(touched.projectName && errors.projectName)}
                    helperText={touched.projectName && errors.projectName}
                  />
                  <TextField
                    fullWidth
                    label="Project Size"
                    {...getFieldProps('project_size')}
                    error={Boolean(touched.projectSize && errors.projectSize)}
                    helperText={touched.projectSize && errors.projectSize}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <MobileDateTimePicker
                  label="Start date"
                  value={values.startDate}
                  inputFormat="dd/MM/yyyy hh:mm a"
                  onChange={(start_date) => setFieldValue('start', start_date)}
                  renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
                />

                <MobileDateTimePicker
                  label="End date"
                  value={values.end_date}
                  inputFormat="dd/MM/yyyy hh:mm a"
                  onChange={(end_date) => setFieldValue('end', end_date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={Boolean(isDateError)}
                      helperText={isDateError && 'End date must be later than start date'}
                      sx={{ mb: 3 }}
                    />
                  )}
                />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                   
                    label="Working Employees"
                    {...getFieldProps('working_employees')}
                    error={Boolean(touched.working_employees && errors.working_employees)}
                    helperText={touched.working_employees && errors.working_employees}
                  />
                  <TextField
                    fullWidth
                    label="Manager"
                    {...getFieldProps('manager')}
                    error={Boolean(touched.manager&& errors.manager)}
                    helperText={touched.manager && errors.manager}
                  />
                </Stack>                                          

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Project' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
