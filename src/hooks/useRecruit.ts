import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitApi } from '@/services/api';
import { handleApiError } from '@/lib/api';
import type { RecruitRequestDto, RecruitDecisionRequest } from '@/types/api';

// 영입 요청 보내기 Hook
export const useSendRecruitRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecruitRequestDto) => {
      const response = await recruitApi.sendRecruitRequest(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruits'] });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Send recruit request failed:', apiError.message);
    },
  });
};

// 영입 요청 응답 Hook
export const useRespondToRecruitRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, data }: { requestId: number; data: RecruitDecisionRequest }) => {
      const response = await recruitApi.respondToRecruitRequest(requestId, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruits'] });
      queryClient.invalidateQueries({ queryKey: ['team', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Respond to recruit request failed:', apiError.message);
    },
  });
};

// 팀에 온 영입 요청들 조회 Hook
export const useTeamRecruitRequests = () => {
  return useQuery({
    queryKey: ['recruits', 'team'],
    queryFn: async () => {
      const response = await recruitApi.getTeamRecruitRequests();
      return response.data;
    },
  });
};

// 나에게 온 영입 요청들 조회 Hook
export const usePendingRequests = () => {
  return useQuery({
    queryKey: ['recruits', 'pending'],
    queryFn: async () => {
      const response = await recruitApi.getPendingRequests();
      return response.data;
    },
  });
}; 