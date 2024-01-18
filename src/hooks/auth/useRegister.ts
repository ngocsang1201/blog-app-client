import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '~/api';
import { RegisterFormValues, UseMutationOpt } from '~/models';
import { showToast } from '~/utils/toast';

export function useRegister(options?: UseMutationOpt<unknown, RegisterFormValues>) {
  const navigate = useNavigate();

  return useMutation({
    ...options,
    mutationFn: authApi.register,
    onSuccess: () => {
      showToast('checkEmail', 'info');
      navigate('/login', { replace: true });
    },
  });
}
