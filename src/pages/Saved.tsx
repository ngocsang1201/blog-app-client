import { Grid, List } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '~/components/common';
import { PostList } from '~/components/post';
import { usePageTitle } from '~/hooks/common';

export function SavedPage() {
  const { t } = useTranslation('savedPage');

  const [page, setPage] = useState(1);

  usePageTitle(t('pageTitle'));

  return (
    <Grid container>
      <Grid item xs={12} lg={8}>
        <PageTitle>{t('pageTitle')}</PageTitle>

        <List disablePadding>
          <PostList
            filter={{ page }}
            onFilterChange={({ page }) => setPage(page || 1)}
            mode="saved"
          />
        </List>
      </Grid>
    </Grid>
  );
}
