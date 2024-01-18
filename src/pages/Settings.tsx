import { Box, Paper, Stack } from '@mui/material';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '~/api';
import { PageTitle } from '~/components/common';
import { SettingForm, SettingTabs } from '~/components/settings';
import { SETTING_TABS } from '~/constants';
import { usePageTitle } from '~/hooks/common';
import { ChangePasswordFormValues, SettingTabItem, User } from '~/models';
import { useUserStore } from '~/store';
import { useAppDispatch } from '~/store/hooks';
import { updateCurrentUserAsync } from '~/store/slices/userSlice';
import { themeMixins } from '~/utils/theme';

export function SettingsPage() {
  const location = useLocation();
  const { tab: activeTab } = queryString.parse(location.search) as { tab: string | undefined };

  const { EDIT_PROFILE, CHANGE_PASSWORD } = SETTING_TABS;

  const { t } = useTranslation('settingsPage');

  const dispatch = useAppDispatch();
  const currentUser = useUserStore((state) => state.currentUser);

  usePageTitle(t('pageTitle'));

  const handleUpdateProfile = (formValues: Partial<User>) => {
    dispatch(updateCurrentUserAsync(formValues));
  };

  const handleChangePassword = async (formValues: ChangePasswordFormValues) => {
    await authApi.changePassword(formValues);
  };

  const handleForgotPassword = async () => {
    if (!currentUser.email) return;
    await authApi.forgotPassword(currentUser.email);
  };

  const tabs: SettingTabItem[] = [
    {
      label: t('tabs.editProfile'),
      tab: EDIT_PROFILE,
    },
    {
      label: t('tabs.changePassword'),
      tab: CHANGE_PASSWORD,
    },
  ];

  const tabsValue = tabs.map((tab) => tab.tab);

  if (!activeTab || !tabsValue.includes(activeTab)) {
    return <Navigate to={`/settings?tab=${tabsValue[0]}`} replace />;
  }

  return (
    <Box>
      <PageTitle>{t('pageTitle')}</PageTitle>

      <Paper
        sx={{
          ...themeMixins.getPaperStyles(),
          overflow: 'hidden',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <SettingTabs tabs={tabs} activeTab={activeTab} />

          <Box
            sx={{
              flex: 1,
              py: { xs: 2, md: 3 },
              px: { xs: 3, sm: 6 },
              borderWidth: 0,
              borderLeftWidth: { xs: 0, md: 1 },
              borderTopWidth: { xs: 1, md: 0 },
              borderStyle: 'solid',
              borderColor: 'divider',
            }}
          >
            <SettingForm
              activeTab={activeTab}
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onForgotPassword={handleForgotPassword}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
