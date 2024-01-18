import {
  ChatBubbleOutlineRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
} from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Post } from '~/models';
import { useUserStore } from '~/store';

export interface PostReactionProps {
  post?: Post | null;
  onOpenComment?: () => void;
  onLikePost?: () => void;
}

export function PostReaction(props: PostReactionProps) {
  const { post, onOpenComment, onLikePost } = props;

  const currentUser = useUserStore((state) => state.currentUser);

  if (!post) return null;

  return (
    <Box>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          display: 'inline-block',
          pb: 0.5,
          mb: 1,
          borderBottom: 1,
          borderColor: 'text.primary',
        }}
      >
        {post.author?.name}
      </Typography>

      <Stack
        sx={{
          alignItems: 'center',
          '& button': {
            fontSize: '1rem',
            color: 'text.secondary',
          },
        }}
      >
        <Button
          color="inherit"
          startIcon={
            post.likes!.includes(currentUser._id!) ? (
              <FavoriteRounded sx={{ color: 'error.main' }} />
            ) : (
              <FavoriteBorderRounded />
            )
          }
          onClick={onLikePost}
          sx={{ '&:hover': { color: 'error.main' } }}
        >
          {post.likeCount}
        </Button>

        <Button
          color="inherit"
          startIcon={<ChatBubbleOutlineRounded />}
          onClick={onOpenComment}
          sx={{ '&:hover': { color: 'primary.main' } }}
        >
          {post.commentCount}
        </Button>
      </Stack>
    </Box>
  );
}
