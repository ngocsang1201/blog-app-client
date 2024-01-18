import {
  BookmarkRounded,
  BorderColorRounded,
  DeleteRounded,
  FlagRounded,
  LinkRounded,
} from '@mui/icons-material';
import { Box, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog, StyledCard } from '~/components/common';
import { ROLE } from '~/constants';
import { MenuOption, Post } from '~/models';
import { useUserStore } from '~/store';
import { copyPostLink } from '~/utils/common';
import { showComingSoonToast, showToast } from '~/utils/toast';
import { MdEditor, PostCardHeader } from '.';
import { useDeletePost, useSavePost } from '~/hooks/post';

export interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const navigate = useNavigate();

  const { t } = useTranslation('postMenu');

  const [openDialog, setOpenDialog] = useState(false);

  const currentUser = useUserStore((state) => state.currentUser);

  const closeDialog = () => setOpenDialog(false);

  const { mutate: deletePost, isPending } = useDeletePost({
    onSuccess: () => {
      showToast('post.delete');
      closeDialog();
    },
  });
  const { mutate: savePost } = useSavePost({
    onSuccess: () => {
      showToast('post.save');
    },
  });

  const postId = post._id!;
  const isAuthor = post.authorId === currentUser._id;
  const isAdmin = currentUser.role === ROLE.ADMIN;

  const actionMenu: MenuOption[] = [
    {
      label: t('save'),
      icon: BookmarkRounded,
      onClick: () => savePost(postId),
      show: true,
    },
    {
      label: t('edit'),
      icon: BorderColorRounded,
      onClick: () => navigate?.(`/edit/${postId}`),
      show: isAuthor,
    },
    {
      label: t('delete'),
      icon: DeleteRounded,
      onClick: () => setOpenDialog(true),
      show: isAuthor || isAdmin,
    },
    {
      label: t('copyLink'),
      icon: LinkRounded,
      onClick: () => copyPostLink(post),
      show: true,
    },
    {
      label: t('report'),
      icon: FlagRounded,
      onClick: showComingSoonToast,
      show: !isAuthor,
    },
  ];

  return (
    <Box pb={2}>
      <StyledCard>
        <Typography variant="h4" component="h1" fontWeight={600} mb={0}>
          {post.title}
        </Typography>

        <PostCardHeader
          post={post}
          actionMenu={actionMenu}
          sx={{
            my: 2,
            mx: 0,
            '& .icon-button': {
              ml: 1,
            },
          }}
        />

        <CardContent sx={{ '&:last-child': { p: 0 } }}>
          <MdEditor value={post.content} readOnly />
        </CardContent>
      </StyledCard>

      <ConfirmDialog
        type="post.delete"
        open={openDialog}
        onClose={closeDialog}
        onConfirm={() => deletePost(postId)}
        loading={isPending}
      />
    </Box>
  );
}
