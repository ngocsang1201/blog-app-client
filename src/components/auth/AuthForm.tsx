import { Avatar, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { FormEventHandler } from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import images from '~/assets/images';
import { MuiTextField } from '~/components/formFields';
import { APP_NAME } from '~/constants';
import { FormField } from '~/models';
import { AuthButton } from './AuthButton';

export interface AuthFormProps<TFormValues extends object> {
  name: string;
  control: Control<TFormValues>;
  fieldList: FormField[];
  loading: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onGoogleLogin?: () => void;
}

export function AuthForm<TFormValues extends object>(props: AuthFormProps<TFormValues>) {
  const { name: formName, control, fieldList, loading, onSubmit, onGoogleLogin } = props;

  const { t } = useTranslation(`${formName}Page`);

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Avatar
          sx={{
            width: 48,
            height: 48,
            fontSize: 32,
            fontWeight: 600,
            bgcolor: 'primary.main',
            color: 'common.white',
            mb: 2,
          }}
        >
          {APP_NAME[0]}
        </Avatar>

        <Typography color="text.primary" fontSize={24} fontWeight={600}>
          {t('form.title', { appName: APP_NAME })}
        </Typography>
      </Stack>

      <Stack direction="column" spacing={1} mt={4}>
        {fieldList.map(({ name, props }) => (
          <MuiTextField
            key={name}
            name={name}
            control={control}
            label={t(`form.label.${name}`)}
            variant="outlined"
            size="medium"
            disabled={loading}
            sx={{
              '& input': {
                py: 1.5,
                fontSize: 16,
              },
              '& fieldset': {
                fontSize: 16,
              },
            }}
            {...props}
          />
        ))}

        <AuthButton
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{ fontSize: 16 }}
        >
          {t('form.button.submit')}
        </AuthButton>

        {onGoogleLogin && (
          <AuthButton
            variant="outlined"
            startIcon={<img src={images.google} width={24} />}
            onClick={onGoogleLogin}
          >
            {t('form.button.google')}
          </AuthButton>
        )}
      </Stack>
    </Box>
  );
}
