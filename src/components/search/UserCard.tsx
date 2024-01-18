import { AccountCircleRounded } from '@mui/icons-material';
import { Avatar, Box, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '~/models';
import { useUserStore } from '~/store';
import { GrayButton, StyledCard, UserButtonGroup } from '../common';

interface UserCardProps {
  user: Partial<User>;
}

export function UserCard({ user }: UserCardProps) {
  const navigate = useNavigate();

  const { t } = useTranslation('userCard');

  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <StyledCard>
      <CardContent sx={{ '&:last-child': { p: 0 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack flex={1} spacing={2}>
            <Avatar
              src={user.avatar}
              sx={{ width: 60, height: 60 }}
              component={Link}
              to={`/profile/${user.username}`}
            >
              {user.name![0].toUpperCase()}
            </Avatar>

            <Box>
              <Typography
                component={Link}
                to={`/profile/${user.username}`}
                variant="body1"
                fontWeight={600}
              >
                {user.name}
              </Typography>

              <Typography variant="body2">@{user.username}</Typography>
            </Box>
          </Stack>

          <Stack>
            {user._id === currentUser._id ? (
              <GrayButton
                variant="contained"
                fullWidth
                startIcon={<AccountCircleRounded />}
                onClick={() => navigate(`/profile/${currentUser!.username}`)}
              >
                {t('viewProfile')}
              </GrayButton>
            ) : (
              <UserButtonGroup user={user} />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
}
