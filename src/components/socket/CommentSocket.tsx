import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QueryKey } from '~/constants';
import { Comment } from '~/models';
import { SocketProps } from './SocketClient';

const EVENTS = {
  CREATE_COMMENT: 'createComment',
  EDIT_COMMENT: 'editComment',
  REMOVE_COMMENT: 'removeComment',
};

export function CommentSocket({ socket }: SocketProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(EVENTS.CREATE_COMMENT, ({ comment }: { comment: Comment }) => {
      let commentCount = 0;
      queryClient.setQueryData([QueryKey.COMMENTS, comment.postId], (commentList: Comment[]) => {
        return [comment, ...commentList];
      });
    });
    socket.on(EVENTS.EDIT_COMMENT, ({ comment }: { comment: Comment }) => {
      queryClient.setQueryData([QueryKey.COMMENTS, comment.postId], (commentList: Comment[]) => {
        return commentList.map((c) => (c._id === comment._id ? comment : c));
      });
    });
    socket.on(EVENTS.REMOVE_COMMENT, ({ comment }: { comment: Comment }) => {
      let commentCount = 0;
      queryClient.setQueryData([QueryKey.COMMENTS, comment.postId], (commentList: Comment[]) => {
        return commentList.filter((c) => c._id !== comment._id);
      });
    });

    return () => {
      socket.off(EVENTS.CREATE_COMMENT);
      socket.off(EVENTS.EDIT_COMMENT);
      socket.off(EVENTS.REMOVE_COMMENT);
    };
  }, [socket]);

  return null;
}
