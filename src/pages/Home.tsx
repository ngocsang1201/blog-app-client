import { Grid } from '@mui/material';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postApi } from '~/api';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import { PostFilter, PostList, TopHashtags } from '~/components/post';
import { APP_NAME } from '~/constants';
import { postActions, selectPostList } from '~/redux/slices/postSlice';
import { usePageTitle } from '~/hooks';
import { ListParams, Post } from '~/models';

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const postList = useAppSelector(selectPostList);

  const [filter, setFilter] = useState<ListParams>(() => {
    const params = queryString.parse(location.search);
    return { page: 1, by: 'all', ...params };
  });
  const [hashtagList, setHashtagList] = useState<string[]>([]);

  usePageTitle(APP_NAME);

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
      hashtag: undefined,
      ...params,
      username: undefined,
    });
  }, [location.search]);

  useEffect(() => {
    const { page, by, ...rest } = filter;
    navigate(`?${queryString.stringify(rest)}`, { replace: true });
    dispatch(postActions.fetchPostList(filter));
  }, [dispatch, filter]);

  useEffect(() => {
    (async () => {
      try {
        const topHashtags = await postApi.getTopHashtags();
        setHashtagList(topHashtags);
      } catch (error) {
        setHashtagList([]);
      }
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

  const handleSavePost = async (post: Post) => {
    await postApi.save(post._id || '');
  };

  const handleDeletePost = async (post: Post) => {
    await postApi.remove(post._id || '');
    dispatch(postActions.fetchPostList(filter));
  };

  return (
    <Grid
      container
      spacing={{ xs: hashtagList.length ? 2 : 0, lg: 8 }}
      flexDirection={{ xs: 'column-reverse', lg: 'row' }}
    >
      <Grid item xs width="100%">
        <PostFilter filter={filter} onChange={handleFilterChange} />

        <PostList
          postList={postList}
          page={Number(filter.page) || 1}
          onPageChange={(page) => handleFilterChange({ page })}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
        />
      </Grid>

      <Grid item xs lg={4} width="100%">
        <TopHashtags
          list={hashtagList}
          active={filter.hashtag}
          onHashtagClick={(hashtag) => handleFilterChange({ hashtag, search: undefined })}
        />
      </Grid>
    </Grid>
  );
}