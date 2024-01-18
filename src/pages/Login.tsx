import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { AuthForm } from '~/components/auth';
import { useForgotPassword, useLoginEmail, useLoginGoogle } from '~/hooks/auth';
import { usePageTitle } from '~/hooks/common';
import { FormField, LoginFormValues } from '~/models';
import { validateEmail } from '~/utils/common';

export function LoginPage() {
  const { t } = useTranslation('loginPage');
  const { t: tValidate } = useTranslation('validate');

  const { mutate: forgotPassword, isPending: forgotPasswordLoading } = useForgotPassword();
  const { mutate: loginWithEmail, isPending: loginEmailLoading } = useLoginEmail();
  const { signIn: loginWithGoogle, loading: loginGoogleLoading } = useLoginGoogle();
  const loading = loginEmailLoading || loginGoogleLoading;

  usePageTitle(t('pageTitle'));

  const schema = z.object({
    email: z.string().min(1, tValidate('required')).email(tValidate('invalid')),
    password: z
      .string()
      .min(6, tValidate('min', { min: 6 }))
      .max(255, tValidate('max', { max: 255 })),
  });

  const { control, handleSubmit, getValues } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const submitForm = (formValues: LoginFormValues) => loginWithEmail(formValues);

  const checkEmail = (email: string) => {
    if (email.trim().length === 0) {
      toast.error(tValidate('email.required'));
      return false;
    }

    if (!validateEmail(email)) {
      toast.error(tValidate('email.email'));
      return false;
    }

    return true;
  };

  const handleForgotPassword = () => {
    const email = getValues('email');
    const isValid = checkEmail(email);
    isValid && forgotPassword(email);
  };

  const fieldList: FormField[] = [
    { name: 'email' },
    { name: 'password', props: { type: 'password' } },
  ];

  return (
    <Box>
      <AuthForm
        name="login"
        control={control}
        fieldList={fieldList}
        onSubmit={handleSubmit(submitForm)}
        loading={loading}
        onGoogleLogin={loginWithGoogle}
      />

      <Box textAlign="center" my={1}>
        <Typography variant="body2" component="span" sx={{ cursor: 'default' }}>
          {t('text')}{' '}
        </Typography>

        <Typography
          component={Link}
          to="/register"
          variant="body2"
          color="primary"
          fontWeight={500}
        >
          {t('register')}
        </Typography>
      </Box>

      <Stack direction="column" alignItems="center" justifyContent="center">
        <Button
          variant="text"
          disabled={forgotPasswordLoading}
          onClick={handleForgotPassword}
          sx={{
            p: 0,
            bgcolor: 'transparent !important',
          }}
        >
          {t('forgotPassword')}
        </Button>

        {forgotPasswordLoading && <CircularProgress size={20} sx={{ mt: 1 }} />}
      </Stack>
    </Box>
  );
}
