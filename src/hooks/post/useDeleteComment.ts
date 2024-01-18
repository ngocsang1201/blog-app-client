import { useMutation } from '@tanstack/react-query';
import { commentApi } from '~/api';
import { UseMutationOpt } from '~/models';

export function useDeleteComment(options?: UseMutationOpt<unknown, string>) {
  return useMutation({
    ...options,
    mutationFn: commentApi.delete,
  });
}
