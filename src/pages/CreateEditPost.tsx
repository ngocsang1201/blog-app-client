import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { postApi } from '~/api';
import { CreateEditForm } from '~/components/post';
import { usePageTitle } from '~/hooks/common';
import { usePostForEdit } from '~/hooks/post';
import { Post } from '~/models';
import { useUserStore } from '~/store';

export function CreateEditPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isNewPost = !postId;

  const { t } = useTranslation('createEditPage');

  const currentUser = useUserStore((state) => state.currentUser);

  usePageTitle(isNewPost ? t('pageTitle.create') : t('pageTitle.edit'));

  const { data: editedPost, isError } = usePostForEdit(postId || '', {
    enabled: !!postId,
  });

  useEffect(() => {
    if (isError) {
      navigate('/create', { replace: true });
    }
  }, [isError]);

  const defaultValues: Post = {
    title: '',
    content: '',
    thumbnail: '',
    authorId: currentUser._id!,
    description: '',
    ...editedPost,
  };
  const handleFormSubmit = async (data: Post) => {
    const action = isNewPost ? 'create' : 'update';
    const savedPost = await postApi[action](data);
    navigate(`/post/${savedPost.slug}`);
  };

  return (
    <CreateEditForm
      defaultValues={defaultValues}
      onSubmit={handleFormSubmit}
      isNewPost={isNewPost}
    />
  );
}
