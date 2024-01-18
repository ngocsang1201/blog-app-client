import { Box } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserInfo } from '~/components/common';
import { PostList } from '~/components/post';
import { APP_NAME } from '~/constants';
import { usePageTitle } from '~/hooks/common';
import { useUserInfo } from '~/hooks/user';
import { User } from '~/models';

export function ProfilePage() {
  const { username = '' } = useParams();

  const [page, setPage] = useState<number>(1);

  const { data: userInfo } = useUserInfo(username);

  const pageTitle = userInfo?.name ?? APP_NAME;
  usePageTitle(pageTitle);

  const updateUser = (user: Partial<User>) => {
    // setUserInfo((userInfo) => ({ ...userInfo, ...user }));
  };

  return (
    <Box>
      <UserInfo username={username} updateUser={updateUser} />

      {username && (
        <PostList filter={{ page, username }} onFilterChange={({ page }) => setPage(page || 1)} />
      )}
    </Box>
  );
}
