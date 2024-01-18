import { MoreHorizRounded } from '@mui/icons-material';
import { Avatar, Box, CardHeader, IconButton, SxProps, Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionMenu, UserPopup } from '~/components/common';
import { useMouseEventsWithPopup } from '~/hooks/common';
import { MenuOption, Post } from '~/models';
import { formatTime } from '~/utils/common';

export interface PostCardHeaderProps {
  post: Post;
  actionMenu: MenuOption[];
  sx?: SxProps;
}

export function PostCardHeader(props: PostCardHeaderProps) {
  const { post, actionMenu = [], sx } = props;

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef<any>(null);
  const popupRef = useRef<any>(null);

  const { open: openPopup, mouseEvents } = useMouseEventsWithPopup();

  const toggleMenu = () => setOpenMenu(!openMenu);
  const closeMenu = () => setOpenMenu(false);

  const handleAuthorClick = () => {
    navigate(`/profile/${post.author?.username}`);
  };

  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            ref={popupRef}
            src={post.author?.avatar}
            onClick={handleAuthorClick}
            {...mouseEvents}
            sx={{ cursor: 'pointer' }}
          />
        }
        action={
          <Box>
            <IconButton
              disableTouchRipple
              size="small"
              ref={menuRef}
              onClick={toggleMenu}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'transparent',
                },
              }}
            >
              <MoreHorizRounded />
            </IconButton>

            <ActionMenu
              menu={actionMenu}
              open={openMenu}
              anchorEl={menuRef.current}
              onClose={closeMenu}
            />
          </Box>
        }
        title={
          <Typography
            variant="subtitle2"
            fontWeight={600}
            onClick={handleAuthorClick}
            {...mouseEvents}
            sx={{
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            {post.author?.name}
          </Typography>
        }
        subheader={
          <Tooltip title={formatTime(post.createdAt, 'DD/MM/YYYY, HH:mm')}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'inline-block' }}>
              {formatTime(post.createdAt)}
            </Typography>
          </Tooltip>
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 0,
          '& .MuiCardHeader-subheader': {
            mt: -0.5,
          },
          '& .MuiCardHeader-action': {
            m: 0,
          },
          ...sx,
        }}
      />

      <UserPopup open={openPopup} user={post.author!} anchorEl={popupRef.current} />
    </>
  );
}
