import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, Container, Stack } from '@mui/material';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { authApi } from '~/api';
import { PageTitle } from '~/components/common';
import { usePageTitle } from '~/hooks/common';
import { ChangePasswordFormValues } from '~/models';
import { themeMixins } from '~/utils/theme';
import { MuiTextField } from '../formFields';

export function UpdatePasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = queryString.parse(location.search)?.token as string;

  const { t } = useTranslation('updatePasswordForm');
  const { t: tValidate } = useTranslation('validate');

  const schema = z
    .object({
      token: z.string(),
      newPassword: z.string().min(6, tValidate('password.min', { min: 6 })),
      confirmPassword: z.string().min(6, tValidate('password.min', { min: 6 })),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: tValidate('notMatch'),
      path: ['confirmPassword'],
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
    resolver: zodResolver(schema),
  });

  const submitForm = async (formValues: ChangePasswordFormValues) => {
    await authApi.resetPassword(formValues);
    navigate('/login', { replace: true });
  };

  usePageTitle(t('pageTitle'));

  return (
    <Container maxWidth="sm">
      <Box mt={3} p={3} sx={{ ...themeMixins.getPaperStyles() }}>
        <PageTitle uppercase={false}>{t('pageTitle')}</PageTitle>

        <Box component="form" onSubmit={handleSubmit(submitForm)}>
          <Stack direction="column" spacing={2}>
            <MuiTextField
              name="newPassword"
              control={control}
              variant="outlined"
              label={t('label.newPassword')}
              type="password"
            />

            <MuiTextField
              name="confirmPassword"
              control={control}
              variant="outlined"
              label={t('label.confirmPassword')}
              type="password"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                {t('submit')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
