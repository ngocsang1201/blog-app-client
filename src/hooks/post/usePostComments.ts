import { useQuery } from '@tanstack/react-query';
import { commentApi } from '~/api';
import { QueryKey } from '~/constants';
import { Comment, UseQueryOpt } from '~/models';

export function usePostComments(postId: string, options?: UseQueryOpt<Comment[]>) {
  return useQuery({
    ...options,
    queryKey: [QueryKey.COMMENTS, postId],
    queryFn: () => commentApi.fetchPostComments(postId),
    initialData: [],
  });
}
