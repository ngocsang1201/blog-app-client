import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { postApi } from '~/api';
import { QueryKey } from '~/constants';
import { Post, UseQueryOpt } from '~/models';
import { useGlobalStore } from '~/store';

export function usePostForEdit(postId: string, options?: UseQueryOpt<Post>) {
  const setLoading = useGlobalStore((state) => state.setLoading);

  const query = useQuery({
    ...options,
    queryKey: [QueryKey.POST_EDIT, postId],
    queryFn: () => postApi.getForEdit(postId),
  });

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching]);

  return query;
}
