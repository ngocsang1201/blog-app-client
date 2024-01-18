import { Avatar, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User } from '~/models';
import { useUserStore } from '~/store';

export interface SuggestionItemProps {
  item: Partial<User>;
  onFollow?: (userId: string) => void;
}

export function SuggestionItem({ item, onFollow }: SuggestionItemProps) {
  const { t } = useTranslation('suggestions');

  const currentUser = useUserStore((state) => state.currentUser);

  const [loading, setLoading] = useState(false);

  const isFollowed = useMemo(() => {
    return !!currentUser.following?.find((user) => user._id === item._id);
  }, [currentUser.following]);

  const handleFollowClick = async () => {
    setLoading(true);
    await onFollow?.(item._id!);
    setLoading(false);
  };

  return (
    <Stack spacing={2} width="100%">
      <Link to={`/profile/${item.username}`}>
        <Avatar src={item.avatar} sx={{ width: 32, height: 32 }} />
      </Link>

      <Box flex={1}>
        <Typography
          variant="subtitle2"
          component={Link}
          to={`/profile/${item.username}`}
          sx={{
            width: 'fit-content',
            mb: -0.5,
          }}
        >
          {item.name}
        </Typography>

        <Typography variant="caption" component="p">
          @{item.username}
        </Typography>
      </Box>

      <Button
        size="small"
        disabled={isFollowed}
        sx={{ '&:hover': { bgcolor: 'transparent' } }}
        onClick={handleFollowClick}
      >
        {loading ? <CircularProgress size={16} /> : isFollowed ? t('followed') : t('follow')}
      </Button>
    </Stack>
  );
}
