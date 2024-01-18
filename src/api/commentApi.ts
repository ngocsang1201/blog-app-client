import { Comment } from '~/models';
import axiosClient from './axiosClient';

export const commentApi = {
  fetchPostComments(postId: string): Promise<Comment[]> {
    const url = '/comments';
    return axiosClient.get(url, { params: { postId } });
  },
  create(data: Comment) {
    const url = '/comments';
    return axiosClient.post(url, data);
  },
  edit(data: Comment) {
    const url = `/comments/${data._id}`;
    return axiosClient.patch(url, data);
  },
  delete(commentId: string) {
    const url = `/comments/${commentId}`;
    return axiosClient.delete(url);
  },
  like(commentId: string): Promise<Comment> {
    const url = `/comments/${commentId}/like`;
    return axiosClient.post(url);
  },
};
