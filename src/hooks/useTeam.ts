import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { teamApi } from '@/services/api';
import { handleApiError } from '@/lib/api';
import type { TeamCreateRequest, TeamListResponse, TeamResponse } from '@/types/api';

// 모든 팀 조회 Hook
export const useTeams = (): UseQueryResult<TeamListResponse, Error> => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamApi.getAllTeams();
      return response.data;
    },
  });
};

// 내 팀 조회 Hook
export const useMyTeam = (): UseQueryResult<TeamResponse, Error> => {
  return useQuery({
    queryKey: ['team', 'my'],
    queryFn: async () => {
      const response = await teamApi.getMyTeam();
      return response.data;
    },
    retry: false,
  });
};

// 특정 팀 조회 Hook
export const useTeam = (teamId: number) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await teamApi.getTeamById(teamId);
      return response.data;
    },
    enabled: !!teamId,
  });
};

// 팀 생성 Hook
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TeamCreateRequest) => {
      const response = await teamApi.createTeam(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', 'my'] });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Team creation failed:', apiError.message);
    },
  });
};

// 팀 탈퇴 Hook
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await teamApi.leaveTeam();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Leave team failed:', apiError.message);
    },
  });
};

// 팀원 강퇴 Hook
export const useKickMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await teamApi.kickMember(userId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', 'my'] });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Kick member failed:', apiError.message);
    },
  });
}; 