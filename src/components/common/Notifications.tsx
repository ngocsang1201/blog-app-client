import { CloseRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { themeMixins } from 'utils/theme';
import { useNotifications } from '~/hooks/notification';
import { Notification } from '~/models';
import { useUserStore } from '~/store';

const NUMBER_OF_NAME_TO_SHOW = 1;

interface NotificationsProps {
  open: boolean;
  onClose?: () => void;
}

export function Notifications(props: NotificationsProps) {
  const { open, onClose } = props;

  const { t } = useTranslation('notification');

  const navigate = useNavigate();

  const currentUser = useUserStore((state) => state.currentUser);

  const { data: notifications, isFetching } = useNotifications({
    enabled: open,
  });

  const handleNotificationClick = ({ type, postSlug }: Notification) => {
    if (type === 'follow') {
      navigate(`/profile/${currentUser.username}`);
    } else {
      navigate(`/post/${postSlug}`);
    }
    onClose?.();
  };

  const generateNamesString = (users: Notification['actionUsers']) => {
    if (users.length <= NUMBER_OF_NAME_TO_SHOW) {
      return users.map((user) => user.name).join(', ');
    }

    const names = users
      .slice(0, NUMBER_OF_NAME_TO_SHOW)
      .map((user) => user.name)
      .join(', ');
    const remainText = t('more', { remain: users.length - NUMBER_OF_NAME_TO_SHOW });
    return `${names} ${remainText}`;
  };

  return (
    <Box>
      <Box position="relative" pl={2} py={2}>
        <Typography variant="h6" fontWeight={600}>
          {t('label.title')}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseRounded />
        </IconButton>
      </Box>

      <Divider />

      <Box>
        {isFetching ? (
          <Stack justifyContent="center" py={2}>
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <List>
            {notifications.map((notification) => (
              <Typography
                key={notification.updatedAt}
                variant="body2"
                component={ListItemButton}
                sx={{ py: 1, px: 2 }}
                onClick={() => handleNotificationClick(notification)}
              >
                <Avatar
                  src={notification.actionUsers[0].avatar}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />

                <Box
                  dangerouslySetInnerHTML={{
                    __html: t(`message.${notification.type}`, {
                      name: generateNamesString(notification.actionUsers),
                    }),
                  }}
                  sx={{ ...themeMixins.truncate(2) }}
                />
              </Typography>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
