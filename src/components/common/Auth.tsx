import { Navigate, Outlet } from 'react-router-dom';
import { localStorageKey } from '~/constants';

export function Auth() {
  const isAuth = localStorage.getItem(localStorageKey.ACCESS_TOKEN);

  if (isAuth) return <Outlet />;

  return <Navigate to="/login" />;
}
