import {
  AccountCircleRounded,
  EditRounded,
  FlagRounded,
  ForumRounded,
  MoreHorizRounded,
  PersonAddRounded,
  PersonOffRounded,
  PersonRemoveRounded,
} from '@mui/icons-material';
import { Button, CircularProgress, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFollowUser } from '~/hooks/common';
import { MenuOption, User } from '~/models';
import { useUserStore } from '~/store';
import { showComingSoonToast } from '~/utils/toast';
import { ActionMenu, GrayButton } from '.';

export interface UserButtonGroupProps {
  user: Partial<User>;
  updateUser?: (user: Partial<User>) => void;
  showActionMenu?: boolean;
}

export function UserButtonGroup({ user, updateUser, showActionMenu }: UserButtonGroupProps) {
  const userId = user?._id!;

  const navigate = useNavigate();
  const location = useLocation();
  const isInProfilePage = location.pathname.startsWith('/profile');

  const { t } = useTranslation('userButtonGroup');

  const currentUser = useUserStore((state) => state.currentUser);

  const [openMenu, setOpenMenu] = useState(false);

  const anchorRef = useRef<any>(null);

  const { loading, follow, unfollow } = useFollowUser(updateUser);

  const renderFollowButton = () => {
    const isFollowed = currentUser.following!.find(({ _id }) => _id === userId);

    if (isFollowed) {
      return (
        <GrayButton
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <PersonRemoveRounded />}
          disabled={loading}
          sx={{ flex: showActionMenu ? 2 : 1 }}
          onClick={() => unfollow(userId)}
        >
          {t('unfollow')}
        </GrayButton>
      );
    }

    return (
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={16} /> : <PersonAddRounded />}
        disabled={loading}
        sx={{ flex: showActionMenu ? 2 : 1 }}
        onClick={() => follow(userId)}
      >
        {t('follow')}
      </Button>
    );
  };

  const actionMenu: MenuOption[] = [
    {
      label: t('menu.block'),
      icon: PersonOffRounded,
      onClick: showComingSoonToast,
      show: true,
    },
    {
      label: t('menu.report'),
      icon: FlagRounded,
      onClick: showComingSoonToast,
      show: true,
    },
  ];

  return (
    <Stack
      alignItems="center"
      spacing={1}
      width="100%"
      sx={{
        '& > button': {
          height: 36,
          minWidth: 'fit-content',
        },
      }}
    >
      {currentUser._id === userId ? (
        <GrayButton
          startIcon={isInProfilePage ? <EditRounded /> : <AccountCircleRounded />}
          fullWidth
          sx={{ flex: 1 }}
          onClick={() => {
            const url = isInProfilePage
              ? '/settings?tab=edit-profile'
              : `/profile/${user.username!}`;
            navigate(url);
          }}
        >
          {isInProfilePage ? t('editProfile') : t('viewProfile')}
        </GrayButton>
      ) : (
        <>
          {renderFollowButton()}

          <GrayButton
            variant="contained"
            startIcon={showActionMenu ? undefined : <ForumRounded />}
            sx={{ flex: 1 }}
          >
            {showActionMenu ? <ForumRounded /> : t('message')}
          </GrayButton>

          {showActionMenu && (
            <>
              <GrayButton
                ref={anchorRef}
                variant="contained"
                sx={{ flex: 1 }}
                onClick={() => setOpenMenu(true)}
              >
                <MoreHorizRounded />
              </GrayButton>

              <ActionMenu
                menu={actionMenu}
                open={openMenu}
                anchorEl={anchorRef.current}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
                onClose={() => setOpenMenu(false)}
              />
            </>
          )}
        </>
      )}
    </Stack>
  );
}
