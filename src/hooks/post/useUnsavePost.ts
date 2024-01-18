import { useMutation } from '@tanstack/react-query';
import { postApi } from '~/api';
import { UseMutationOpt } from '~/models';
import { showToast } from '~/utils/toast';

export function useUnsavePost(options?: UseMutationOpt<unknown, string>) {
  return useMutation({
    ...options,
    mutationFn: postApi.unsave,
    onSuccess: (...args) => {
      showToast('post.unsave');
      options?.onSuccess?.(...args);
    },
  });
}
