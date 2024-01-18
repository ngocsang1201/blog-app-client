import { useMutation } from '@tanstack/react-query';
import { authApi } from '~/api';
import { UseMutationOpt } from '~/models';
import { showToast } from '~/utils/toast';

export function useForgotPassword(options?: UseMutationOpt<unknown, string>) {
  return useMutation({
    ...options,
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      showToast('checkEmail', 'info');
    },
  });
}
