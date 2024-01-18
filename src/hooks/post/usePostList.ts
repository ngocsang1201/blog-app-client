import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { postApi } from '~/api';
import { QueryKey } from '~/constants';
import { ListParams, ListResponse, Post, UseQueryOpt } from '~/models';
import { useGlobalStore } from '~/store';
import { calculateTotalPage } from '~/utils/common';

interface Params extends ListParams {
  saved?: boolean;
}

export function usePostList(
  { saved = false, ...params }: Params,
  options?: UseQueryOpt<ListResponse<Post>>
) {
  const setLoading = useGlobalStore((state) => state.setLoading);

  const query = useQuery<ListResponse<Post>>({
    ...options,
    queryKey: [QueryKey.POST_LIST, params],
    queryFn: () => (saved ? postApi.fetchSavedList(params) : postApi.fetchPostList(params)),
    initialData: {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalRows: 0,
      },
    },
    select: (data) => ({
      ...data,
      pagination: {
        ...data.pagination,
        totalPage: calculateTotalPage(data.pagination),
      },
    }),
  });

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching]);

  return query;
}
