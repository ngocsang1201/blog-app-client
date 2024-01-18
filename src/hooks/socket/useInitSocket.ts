import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAppDispatch } from '~/store/hooks';
import { socketActions } from '~/store/slices/socketSlice';
import { env, variables } from '~/utils/env';

export function useInitSocket() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = io(env(variables.serverUrl));
    if (!socket) return;

    dispatch(socketActions.setSocket(socket));

    return () => {
      socket.close();
    };
  }, [dispatch]);
}
