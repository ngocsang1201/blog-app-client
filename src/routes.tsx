import { RouteObject } from 'react-router-dom';
import { ActiveAccount, UpdatePasswordForm } from './components/auth';
import { Auth } from './components/common';
import { EmptyLayout, HeaderOnlyLayout, LoginLayout, MainLayout } from './components/layouts';
import {
  CreateEditPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  PostDetailPage,
  ProfilePage,
  RegisterPage,
  SavedPage,
  SettingsPage,
} from './pages';

const publicRoutes: RouteObject[] = [
  {
    element: <LoginLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <EmptyLayout maxWidth="sm" />,
    children: [
      {
        path: '/active',
        element: <ActiveAccount />,
      },
      {
        path: '/password',
        element: <UpdatePasswordForm />,
      },
    ],
  },
];

const privateRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/post/:slug',
        element: <PostDetailPage />,
      },
      {
        path: '/saved',
        element: <SavedPage />,
      },
    ],
  },
  {
    element: <HeaderOnlyLayout />,
    children: [
      {
        path: '/create',
        element: <CreateEditPage />,
      },
      {
        path: '/edit/:postId',
        element: <CreateEditPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <HeaderOnlyLayout maxWidth="md" />,
    children: [
      {
        path: '/profile/:username',
        element: <ProfilePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
];

const routes: RouteObject[] = [
  {
    children: publicRoutes,
  },
  {
    element: <Auth />,
    children: privateRoutes,
  },
];

export default routes;
