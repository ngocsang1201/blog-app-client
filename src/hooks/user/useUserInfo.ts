import { useQuery } from '@tanstack/react-query';
import { userApi } from '~/api';
import { QueryKey } from '~/constants';
import { UseQueryOpt, User } from '~/models';

export function useUserInfo(username: string, options?: UseQueryOpt<Partial<User>>) {
  return useQuery({
    ...options,
    queryKey: [QueryKey.USER_INFO, username],
    queryFn: () => userApi.getUserInfo(username),
  });
}
