import { useQuery } from '@tanstack/react-query';
import { postApi } from '~/api';
import { QueryKey } from '~/constants';
import { Post, UseQueryOpt } from '~/models';

export function usePostDetail(slug: string, options?: UseQueryOpt<Post>) {
  return useQuery({
    ...options,
    queryKey: [QueryKey.POST_DETAIL, slug],
    queryFn: () => postApi.getBySlug(slug),
  });
}
