import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { postApi, userApi } from '~/api';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { UserInfo } from '~/components/common';
import { PostList } from '~/components/post';
import { UserInfoSkeleton } from '~/components/skeletons';
import { APP_NAME } from '~/constants';
import { usePageTitle } from '~/hooks';
import { ListParams, Post, User } from '~/models';
import { postActions, selectPostList, selectPostLoading } from '~/redux/slices/postSlice';
import { showErrorToastFromServer } from '~/utils/toast';

export function ProfilePage() {
  const { username } = useParams();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const postList = useAppSelector(selectPostList);
  const loading = useAppSelector(selectPostLoading);

  const [page, setPage] = useState<number>(1);

  const [userInfo, setUserInfo] = useState<Partial<User> | null>(null);

  usePageTitle(userInfo?.name ?? APP_NAME);

  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const user = await userApi.getUserInfo(username);
        setUserInfo(user);
        fetchUserPostList({ page: 1 });
      } catch (error) {
        showErrorToastFromServer(error);
      }
    })();
  }, [username]);

  useEffect(() => {
    fetchUserPostList({ page });
  }, [page]);

  const fetchUserPostList = ({ page }: { page: number }) => {
    dispatch(postActions.fetchPostList({ page, username }));
  };

  const handlePageChange = ({ page }: ListParams) => {
    setPage(page ?? 1);
  };

  const handleSavePost = async (post: Post) => {
    await postApi.save(post._id || '');
  };

  const handleDeletePost = async (post: Post) => {
    await postApi.remove(post._id || '');
    fetchUserPostList({ page });
  };

  const updateUser = (user: Partial<User>) => {
    setUserInfo(user);
  };

  return (
    <Box>
      {loading || !userInfo ? (
        <UserInfoSkeleton />
      ) : (
        <UserInfo userInfo={userInfo} updateUser={updateUser} />
      )}

      {userInfo && (
        <PostList
          postList={postList}
          page={page}
          onFilterChange={handlePageChange}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
        />
      )}
    </Box>
  );
}
