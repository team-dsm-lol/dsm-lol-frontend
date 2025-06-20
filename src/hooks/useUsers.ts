import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { userApi } from '@/services/api';
import type { Tier, UserListResponse } from '@/types/api';

// 모든 사용자 조회 Hook
export const useUsers = (params?: {
  tier?: Tier;
  name?: string;
  hasTeam?: boolean;
}): UseQueryResult<UserListResponse, Error> => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await userApi.getAllUsers(params);
      return response.data;
    },
  });
};

// 영입 가능한 사용자 조회 Hook
export const useAvailableUsers = (params?: {
  tier?: Tier;
  name?: string;
}): UseQueryResult<UserListResponse, Error> => {
  return useQuery({
    queryKey: ['users', 'available', params],
    queryFn: async () => {
      const response = await userApi.getAvailableUsers(params);
      return response.data;
    },
  });
}; 