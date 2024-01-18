import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import i18next from 'i18next';
import slugify from 'slugify';
import { otherApi } from '~/api';
import { PaginationParams, Post, SearchResult, User } from '~/models';
import { showToast } from './toast';

import 'dayjs/locale/vi';

export const formatTime = (timestamp: any, template?: string) => {
  dayjs.extend(relativeTime);
  dayjs.locale(i18next.language);
  return template ? dayjs(timestamp).format(template) : dayjs(timestamp).fromNow();
};

export const slugifyString = (str: string) => {
  return slugify(str, { locale: 'vi', lower: true });
};

export const getImageUrlFromCDN = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', '1social');

    const imageObject: any = await otherApi.uploadImageToCDN(formData);
    return imageObject?.url || '';
  } catch (error) {}
};

export const copyPostLink = (post: Post) => {
  navigator.clipboard.writeText(`${window.location.origin}/post/${post.slug}`);
  showToast('common.copy');
};

export const delay = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.trim().toLowerCase().match(re);
};

export const formatSearchResponse = (response: Post[] | Partial<User>[]): SearchResult[] => {
  return response.map((data: any) => ({
    _id: data._id,
    title: data.title ?? data.name,
    subtitle: data.description ?? data.username,
    image: data.thumbnail ?? data.avatar,
    url: data.slug ? `/post/${data.slug}` : `/profile/${data.username}`,
  }));
};

export const calculateTotalPage = (pagination?: PaginationParams) =>
  pagination ? Math.ceil(pagination?.totalRows / pagination?.limit) : 1;
