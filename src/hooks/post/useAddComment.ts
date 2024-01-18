import { useMutation } from '@tanstack/react-query';
import { commentApi } from '~/api';
import { Comment, UseMutationOpt } from '~/models';

export function useAddComment(options?: UseMutationOpt<unknown, Comment>) {
  return useMutation({
    ...options,
    mutationFn: commentApi.create,
  });
}
