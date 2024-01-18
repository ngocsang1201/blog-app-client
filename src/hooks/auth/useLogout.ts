import { useNavigate } from 'react-router-dom';
import { localStorageKey } from '~/constants';
import { User } from '~/models';
import { useUserStore } from '~/store';
import { delay } from '~/utils/common';

export function useLogout() {
  const navigate = useNavigate();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const logout = async () => {
    await delay(500);
    setCurrentUser({} as User);
    localStorage.removeItem(localStorageKey.ACCESS_TOKEN);
    navigate('/login');
  };

  return { logout };
}
