import { useMutation } from '@tanstack/react-query';
import { postApi } from '~/api';
import { UseMutationOpt } from '~/models';
import { showToast } from '~/utils/toast';

export function useSavePost(options?: UseMutationOpt<unknown, string>) {
  return useMutation({
    ...options,
    mutationFn: postApi.save,
    onSuccess: (...args) => {
      showToast('post.save');
      options?.onSuccess?.(...args);
    },
  });
}
