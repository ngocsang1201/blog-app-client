import { Box, List, ListItem, Pagination, Stack } from '@mui/material';
import { NoPost } from '~/components/common';
import { PostCardSkeleton } from '~/components/skeletons';
import { usePostList } from '~/hooks/post';
import { ListParams } from '~/models';
import { PostCard } from './PostCard';

export interface PostListProps {
  filter: ListParams;
  onFilterChange?: (filter: ListParams) => void;
  mode?: 'default' | 'saved';
}

export function PostList(props: PostListProps) {
  const { filter, onFilterChange, mode } = props;

  const {
    data: {
      data: postList,
      pagination: { totalPage = 1 },
    },
    isFetching,
  } = usePostList({ saved: mode === 'saved', ...filter });

  const handlePageChange = (e: any, page: number) => {
    onFilterChange?.({ page });
  };

  if (isFetching)
    return (
      <List disablePadding>
        <ListItem disablePadding>
          <PostCardSkeleton />
        </ListItem>
      </List>
    );

  return (
    <Box width="100%">
      <List disablePadding>
        {postList.length > 0 ? (
          postList.map((post) => (
            <ListItem key={post._id} disablePadding sx={{ pb: 2 }}>
              <PostCard post={post} mode={mode} />
            </ListItem>
          ))
        ) : (
          <NoPost />
        )}

        {totalPage > 1 && (
          <Stack mb={2}>
            <Pagination
              shape="rounded"
              color="primary"
              count={totalPage}
              page={filter.page}
              onChange={handlePageChange}
              sx={{ m: 'auto' }}
            />
          </Stack>
        )}
      </List>
    </Box>
  );
}
