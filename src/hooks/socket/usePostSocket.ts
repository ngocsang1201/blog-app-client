import { useEffect } from 'react';
import { useAppSelector } from '~/store/hooks';
import { selectSocket } from '~/store/slices/socketSlice';

export function usePostSocket(postId?: string) {
  const socket = useAppSelector(selectSocket);

  useEffect(() => {
    if (!socket || !postId) return;
    socket.emit('joinPost', { postId });
    return () => {
      socket.emit('leavePost', { postId });
    };
  }, [socket, postId]);
}
