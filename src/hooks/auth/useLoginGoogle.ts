import { useState } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { authApi } from '~/api';
import { localStorageKey } from '~/constants';
import { AuthResponse, UseMutationOpt } from '~/models';
import { useUserStore } from '~/store';
import { env, variables } from '~/utils/env';

export function useLoginGoogle(options?: UseMutationOpt<AuthResponse, string>) {
  const navigate = useNavigate();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const [loading, setLoading] = useState(false);

  const clientId = env(variables.googleClientId);
  const { signIn } = useGoogleLogin({
    clientId,
    isSignedIn: false,
    accessType: 'offline',
    onRequest: () => {
      setLoading(true);
    },
    onSuccess: async ({ tokenId }: any) => {
      const { user, token, activeToken } = await authApi.googleLogin(tokenId);
      setLoading(false);
      if (activeToken) {
        navigate(`/create-password?token=${activeToken}`);
        return;
      }
      localStorage.setItem(localStorageKey.ACCESS_TOKEN, token);
      setCurrentUser(user);
      navigate('/', { replace: true });
    },
    onFailure(error) {},
  });

  return { signIn, loading };
}
