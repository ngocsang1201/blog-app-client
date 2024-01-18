import {
  AccountCircleRounded,
  ArrowDropDownRounded,
  LogoutOutlined,
  SettingsRounded,
} from '@mui/icons-material';
import { Avatar, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ActionMenu } from '~/components/common';
import { useLogout } from '~/hooks/auth';
import { MenuOption } from '~/models';
import { useUserStore } from '~/store';

export function UserActions() {
  const navigate = useNavigate();

  const { t } = useTranslation('header');

  const currentUser = useUserStore((state) => state.currentUser);

  const { logout } = useLogout();

  const [openMenu, setOpenMenu] = useState(false);

  const anchorRef = useRef<any>(null);

  const navigateTo = (path: string) => {
    setOpenMenu(false);
    navigate(path);
  };

  const menu: MenuOption[] = [
    {
      label: t('user.profile'),
      icon: AccountCircleRounded,
      onClick: () => navigateTo(`/profile/${currentUser.username}`),
    },
    {
      label: t('user.settings'),
      icon: SettingsRounded,
      onClick: () => navigateTo('/settings'),
    },
    {
      label: t('user.logout'),
      icon: LogoutOutlined,
      onClick: logout,
    },
  ];

  return (
    <Stack
      ref={anchorRef}
      onClick={() => setOpenMenu((x) => !x)}
      sx={{
        p: 0.5,
        borderRadius: 40,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Avatar src={currentUser.avatar} alt={currentUser.name} sx={{ width: 36, height: 36 }} />

      {currentUser.name && (
        <Stack ml={1} display={{ xs: 'none', md: 'flex' }}>
          <Typography variant="subtitle2" fontWeight="500">
            {currentUser.name}
          </Typography>

          <ArrowDropDownRounded />
        </Stack>
      )}

      <ActionMenu
        open={openMenu}
        menu={menu}
        anchorEl={anchorRef.current}
        onClose={() => setOpenMenu(false)}
      />
    </Stack>
  );
}
