import {
  AddCircleOutlineOutlined,
  BookmarkBorderOutlined,
  DarkModeRounded,
  ListAltOutlined,
  LogoutOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { authActions } from 'features/auth/authSlice';
import { configActions } from 'features/common/configSlice';
import { IMenuItem } from 'models';
import { IGetMenuProps } from '.';

export function GetUserMenu(props: IGetMenuProps) {
  const { navigate, dispatch, t } = props;

  const showAppearanceDialog = () => {
    dispatch(configActions.setShowConfig(true));
  };

  const logout = () => {
    dispatch(authActions.logout({ navigate }));
  };

  const userMenu: IMenuItem[] = [
    {
      label: t('menu.create'),
      icon: AddCircleOutlineOutlined,
      onClick: () => navigate?.('/blog/create'),
    },
    {
      label: t('menu.myPosts'),
      icon: ListAltOutlined,
      onClick: () => navigate?.('/blog/my'),
    },
    {
      label: t('menu.saved'),
      icon: BookmarkBorderOutlined,
      onClick: () => navigate?.('/blog/saved'),
    },
    {
      label: t('menu.appearance'),
      icon: DarkModeRounded,
      onClick: showAppearanceDialog,
    },
    {
      label: t('menu.settings'),
      icon: SettingsOutlined,
      onClick: () => navigate?.('/settings'),
    },
    {
      label: t('menu.logout'),
      icon: LogoutOutlined,
      onClick: logout,
    },
  ];

  const dividers: number[] = [1, 2, 4];

  return { userMenu, dividers };
}
