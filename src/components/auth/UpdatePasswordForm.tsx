import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Container, Typography } from '@mui/material';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { authApi } from '~/api';
import { CommonForm } from '~/components/common';
import { usePageTitle } from '~/hooks';
import { ChangePasswordFormValues, FormField } from '~/models';
import { themeMixins } from '~/utils/theme';

export function UpdatePasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = queryString.parse(location.search)?.token as string;

  const { t } = useTranslation('updatePasswordForm');
  const { t: tValidate } = useTranslation('validate');

  usePageTitle(t('pageTitle'));

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required(tValidate('newPassword.required'))
      .min(6, tValidate('password.min', { min: 6 })),
    confirmPassword: yup
      .string()
      .required(tValidate('confirmPassword.required'))
      .oneOf([yup.ref('newPassword'), null], tValidate('confirmPassword.match')),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const submitForm = async (formValues: ChangePasswordFormValues) => {
    await authApi.resetPassword(formValues);
    navigate('/login', { replace: true });
  };

  const fieldList: FormField[] = [{ name: 'newPassword' }, { name: 'confirmPassword' }];

  return (
    <Container maxWidth="sm">
      <Box mt={3} p={3} sx={{ ...themeMixins.paperBorder() }}>
        <Typography variant="h5" component="h2" fontWeight={600} mb={2}>
          {t('pageTitle')}
        </Typography>

        <CommonForm
          name="updatePasswordForm"
          fieldList={fieldList}
          control={control}
          onSubmit={handleSubmit(submitForm)}
          submitting={isSubmitting}
          commonProps={{
            type: 'password',
          }}
        />
      </Box>
    </Container>
  );
}