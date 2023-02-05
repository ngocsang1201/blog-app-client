import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useCustomMediaQuery } from '~/hooks';
import { User } from '~/models';
import { PopperWrapper, PopperWrapperProps, UserButtonGroup } from '.';

export interface UserInfoPopupProps extends PopperWrapperProps {
  user: Partial<User>;
}

export function UserInfoPopup(props: UserInfoPopupProps) {
  const { user, open, anchorEl } = props;

  const [isOpen, setIsOpen] = useState(open);

  const mdUp = useCustomMediaQuery('up', 'md');

  return (
    <PopperWrapper
      open={(open || isOpen) && mdUp}
      anchorEl={anchorEl}
      placement="bottom-start"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Box p={2} width={350}>
        <Stack alignItems="center">
          <Avatar src={user.avatar} sx={{ width: 60, height: 60 }} />

          <Box ml={2}>
            <Typography fontSize={16} fontWeight={600} pb={0}>
              {user.name}
            </Typography>

            <Typography color="text.secondary" fontSize={14} fontWeight={400}>
              @{user.username}
            </Typography>
          </Box>
        </Stack>

        {user.bio && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              p: 1,
              fontStyle: 'italic',
              bgcolor: 'action.hover',
              borderRadius: 0.5,
              borderLeft: 4,
              borderColor: 'primary.main',
            }}
          >
            {user.bio}
          </Typography>
        )}

        <UserButtonGroup user={user} />
      </Box>
    </PopperWrapper>
  );
}
