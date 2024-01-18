import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '~/api';
import { QueryKey } from '~/constants';
import { LikeResponse, Post, UseMutationOpt } from '~/models';
import { useUserStore } from '~/store';

const toggleItem = <T>(arr: T[], item: T) => {
  if (arr.includes(item)) {
    return arr.filter((i) => i !== item);
  } else {
    return [...arr, item];
  }
};

export function useLikePost(slug: string, options?: UseMutationOpt<LikeResponse, string>) {
  const currentUser = useUserStore((state) => state.currentUser);

  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: postApi.like,
    onMutate: () => {
      const post = queryClient.getQueryData<Post>([QueryKey.POST_DETAIL, slug]);
      const updatedLikes = toggleItem(post?.likes || [], currentUser._id);
      queryClient.setQueryData([QueryKey.POST_DETAIL, slug], (post: Post) => ({
        ...post,
        likes: updatedLikes,
        likeCount: updatedLikes.length,
      }));
      return post;
    },
  });
}
