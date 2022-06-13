import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { PageTitle } from './PageTitle';

export interface INotFoundProps {
  showHeader?: boolean;
}

export function NotFound({ showHeader }: INotFoundProps) {
  const { t } = useTranslation('notFound');

  return (
    <>
      <PageTitle title={t('pageTitle')} />

      {!!showHeader && <Header />}

      <Stack
        direction="column"
        sx={{
          position: 'fixed',
          inset: 0,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography
          color="primary.main"
          sx={{
            mb: -2,
            fontSize: 120,
            fontWeight: 600,
            letterSpacing: 20,
          }}
        >
          4&#9785;4
        </Typography>

        <Typography
          color="primary.main"
          sx={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          {t('content')}
        </Typography>
      </Stack>
    </>
  );
}
