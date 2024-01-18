import { useEffect } from 'react';
import { Route, RouteObject, Routes } from 'react-router-dom';
import { CustomScrollbar } from '~/components/common';
import { userApi } from './api';
import { SocketClient } from './components/socket';
import { localStorageKey } from './constants';
import { useLogout } from './hooks/auth';
import { useInitSocket } from './hooks/socket';
import routes from './routes';
import { useUserStore } from './store';

const createElementsFromRoutes = (routes: RouteObject[]) => {
  return routes.map(({ path, element, children }, index) => (
    <Route key={`${path}-${index}`} path={path} element={element}>
      {children ? createElementsFromRoutes(children) : null}
    </Route>
  ));
};

function App() {
  useInitSocket();

  const { logout } = useLogout();

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem(localStorageKey.ACCESS_TOKEN) || '';
        if (!token) throw new Error();

        const user = await userApi.getCurrentUser();
        if (!user) throw new Error();

        setCurrentUser(user);
      } catch (error) {
        logout();
      }
    })();
  }, []);

  return (
    <CustomScrollbar>
      <SocketClient />
      <Routes>{createElementsFromRoutes(routes)}</Routes>
    </CustomScrollbar>
  );
}

export default App;
