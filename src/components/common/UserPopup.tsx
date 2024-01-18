import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useCustomMediaQuery } from '~/hooks/common';
import { User } from '~/models';
import { themeMixins } from '~/utils/theme';
import { PopperWrapper, PopperWrapperProps, UserButtonGroup } from '.';

export interface UserPopupProps extends Omit<PopperWrapperProps, 'children'> {
  user: Partial<User>;
}

export function UserPopup(props: UserPopupProps) {
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
          <Box
            sx={{
              mt: 2,
              p: 1,
              bgcolor: 'action.hover',
              borderRadius: 0.5,
              borderLeft: 4,
              borderColor: 'primary.main',
            }}
          >
            <Typography variant="body2" fontStyle="italic" sx={{ ...themeMixins.truncate(1) }}>
              {user.bio}
            </Typography>
          </Box>
        )}

        <Box mt={2}>
          <UserButtonGroup user={user} />
        </Box>
      </Box>
    </PopperWrapper>
  );
}
