import { useMutation } from '@tanstack/react-query';
import { commentApi } from '~/api';
import { Comment, UseMutationOpt } from '~/models';

export function useEditComment(options?: UseMutationOpt<unknown, Comment>) {
  return useMutation({
    ...options,
    mutationFn: commentApi.edit,
  });
}
