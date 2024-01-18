import { Grid } from '@mui/material';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userApi } from '~/api';
import { Suggestions } from '~/components/common';
import { PostFilter, PostList } from '~/components/post';
import { APP_NAME } from '~/constants';
import { usePageTitle } from '~/hooks/common';
import { ListParams, User } from '~/models';

const MAX_SUGGEST_USERS = 3;

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [filter, setFilter] = useState<ListParams>(() => {
    const params = queryString.parse(location.search);
    return { page: 1, by: 'all', ...params };
  });
  const [suggestedUsers, setSuggestedUsers] = useState<Partial<User>[]>([]);

  usePageTitle(APP_NAME, false);

  useEffect(() => {
    const setPageOne = () => setFilter({ page: 1 });
    window.addEventListener('homeClick', setPageOne);
    return () => {
      window.removeEventListener('homeClick', setPageOne);
    };
  }, []);

  useEffect(() => {
    const params = queryString.parse(location.search);
    setFilter({
      ...filter,
      page: 1,
      search: undefined,
      ...params,
      username: undefined,
    });
  }, [location.search]);

  useEffect(() => {
    const { page, by, ...rest } = filter;
    navigate(`?${queryString.stringify(rest)}`, { replace: true });
  }, [filter]);

  useEffect(() => {
    (async () => {
      try {
        const userList = await userApi.search('', false);

        const randomNumbers = new Set<number>();

        while (randomNumbers.size < MAX_SUGGEST_USERS) {
          randomNumbers.add(Math.trunc(Math.random() * userList.length));
        }

        const randomUsers = Array.from(randomNumbers).map((num) => userList[num]);
        setSuggestedUsers(randomUsers);
      } catch (error) {}
    })();
  }, []);

  const handleFilterChange = (newFilter: ListParams) => {
    setFilter({
      ...filter,
      page: 1,
      search: undefined,
      ...newFilter,
    });
  };

  return (
    <Grid container spacing={{ xs: 0, lg: 8 }} flexDirection={{ xs: 'column-reverse', lg: 'row' }}>
      <Grid item xs md={11} lg>
        <PostFilter filter={filter} onChange={handleFilterChange} />

        <PostList filter={filter} onFilterChange={handleFilterChange} />
      </Grid>

      <Grid item xs lg={4} display={{ xs: 'none', lg: 'block' }}>
        <Suggestions userList={suggestedUsers} />
      </Grid>
    </Grid>
  );
}
