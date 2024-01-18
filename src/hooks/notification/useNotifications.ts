import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '~/api';
import { QueryKey } from '~/constants';
import { Notification, UseQueryOpt } from '~/models';

export function useNotifications(options: UseQueryOpt<Notification[]>) {
  return useQuery({
    ...options,
    queryKey: [QueryKey.NOTIFICATIONS],
    queryFn: notificationApi.getAll,
    initialData: [],
  });
}
