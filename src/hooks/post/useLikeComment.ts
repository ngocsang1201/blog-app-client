import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '~/api';
import { QueryKey } from '~/constants';
import { Comment, UseMutationOpt } from '~/models';

export function useLikeComment(options?: UseMutationOpt<Comment, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: commentApi.like,
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(
        [QueryKey.COMMENTS, updatedComment.postId],
        (commentList: Comment[]) => {
          return commentList.map((comment) =>
            comment._id === updatedComment._id ? updatedComment : comment
          );
        }
      );
    },
  });
}
