import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '~/api';
import { localStorageKey } from '~/constants';
import { AuthResponse, LoginFormValues, UseMutationOpt } from '~/models';
import { useUserStore } from '~/store';

export function useLoginEmail(options?: UseMutationOpt<AuthResponse, LoginFormValues>) {
  const navigate = useNavigate();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  return useMutation({
    ...options,
    mutationFn: authApi.login,
    onSuccess: ({ user, token }) => {
      localStorage.setItem(localStorageKey.ACCESS_TOKEN, token);
      setCurrentUser(user);
      navigate('/', { replace: true });
    },
  });
}
