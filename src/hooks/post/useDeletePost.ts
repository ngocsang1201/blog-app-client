import { useMutation } from '@tanstack/react-query';
import { postApi } from '~/api';
import { UseMutationOpt } from '~/models';
import { showToast } from '~/utils/toast';

export function useDeletePost(options?: UseMutationOpt<unknown, string>) {
  return useMutation({
    ...options,
    mutationFn: postApi.remove,
    onSuccess: (...args) => {
      showToast('post.delete');
      options?.onSuccess?.(...args);
    },
  });
}
