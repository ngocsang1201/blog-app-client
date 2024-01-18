import {
  BookmarkRemoveRounded,
  BookmarkRounded,
  BorderColorRounded,
  DeleteRounded,
  FlagRounded,
  LinkRounded,
} from '@mui/icons-material';
import { Box, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { ConfirmDialog, StyledCard } from '~/components/common';
import { QueryKey, ROLE } from '~/constants';
import { useDeletePost, useSavePost, useUnsavePost } from '~/hooks/post';
import { Post } from '~/models';
import { useUserStore } from '~/store';
import { copyPostLink } from '~/utils/common';
import { themeMixins } from '~/utils/theme';
import { showComingSoonToast } from '~/utils/toast';
import { PostCardHeader } from './PostCardHeader';

const allowedElements = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'code',
  'a',
  'span',
];

export interface PostCardProps {
  post: Post;
  mode?: 'default' | 'saved';
}

export function PostCard(props: PostCardProps) {
  const { post, mode = 'default' } = props;
  const postId = post._id!;
  const isSaved = mode === 'saved';

  const navigate = useNavigate();

  const { t } = useTranslation('postMenu');

  const [openDialog, setOpenDialog] = useState(false);

  const currentUser = useUserStore((state) => state.currentUser);

  const handleSuccess = () => {
    closeDialog();
    queryClient.invalidateQueries({ queryKey: [QueryKey.POST_LIST] });
  };

  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending: deleting } = useDeletePost({ onSuccess: handleSuccess });
  const { mutate: savePost } = useSavePost();
  const { mutate: unsavePost, isPending: unsaving } = useUnsavePost({ onSuccess: handleSuccess });

  const loading = deleting || unsaving;

  // prevent click on anchor tag
  useEffect(() => {
    const anchorTags = document.querySelectorAll('.post-content a');
    [...anchorTags].forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });
  }, []);

  const closeDialog = () => setOpenDialog(false);

  const handleConfirm = () => {
    if (isSaved) {
      unsavePost(postId);
    } else {
      deletePost(postId);
    }
    closeDialog();
  };

  const isAuthor = post.authorId === currentUser._id;
  const isAdmin = currentUser.role === ROLE.ADMIN;

  const actionMenus = {
    default: [
      {
        label: t('save'),
        icon: BookmarkRounded,
        onClick: () => savePost(postId),
        show: true,
      },
      {
        label: t('edit'),
        icon: BorderColorRounded,
        onClick: () => navigate?.(`/edit/${post._id}`),
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
    ],
    saved: [
      {
        label: t('unsave'),
        icon: BookmarkRemoveRounded,
        onClick: () => setOpenDialog(true),
      },
      {
        label: t('copyLink'),
        icon: LinkRounded,
        onClick: () => copyPostLink(post),
      },
    ],
  };

  return (
    <StyledCard>
      <PostCardHeader
        post={post}
        actionMenu={actionMenus[mode]}
        sx={{
          mb: 1,
          '& .icon-button': {
            mx: 0.5,
          },
        }}
      />

      <CardContent sx={{ '&:last-child': { p: 0 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box flexGrow={1}>
            <Typography
              color="text.primary"
              fontSize={20}
              fontWeight={600}
              lineHeight={1.2}
              sx={{ ...themeMixins.truncate(2) }}
              component={Link}
              to={`/post/${post.slug}`}
            >
              {post.title}
            </Typography>

            <Typography
              component="div"
              variant="body1"
              className="post-content"
              sx={{
                ...themeMixins.truncate(2),
                m: 0,
                mt: 0.5,
                '& *': {
                  maxWidth: '100%',
                  color: 'text.secondary',
                  fontSize: 16,
                  fontWeight: 400,
                  fontStyle: 'normal',
                  textDecoration: 'none',
                  cursor: 'text',
                },
              }}
            >
              {post.description || (
                <ReactMarkdown
                  children={post.content}
                  remarkPlugins={[remarkGfm]}
                  allowedElements={allowedElements}
                />
              )}
            </Typography>
          </Box>

          {post.thumbnail && (
            <Box width={{ xs: '100%', sm: 'auto' }} mt={{ xs: 2, sm: 0 }} ml={{ xs: 0, sm: 2 }}>
              <CardMedia
                image={post.thumbnail}
                title={post.title}
                sx={{
                  minWidth: 200,
                  aspectRatio: '2',
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
                component={Link}
                to={`/post/${post.slug}`}
              />
            </Box>
          )}
        </Stack>
      </CardContent>

      <ConfirmDialog
        type={isSaved ? 'post.unsave' : 'post.delete'}
        open={openDialog}
        onClose={closeDialog}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </StyledCard>
  );
}
