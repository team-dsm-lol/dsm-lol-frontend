import { apiClient } from '@/lib/api';
import type {
  ApiResponse,
  UserResponse,
  UserListResponse,
  TeamResponse,
  TeamListResponse,
  RecruitResponse,
  RecruitListResponse,
  SchoolLoginRequest,
  RiotAccountRequest,
  TeamCreateRequest,
  RecruitRequestDto,
  RecruitDecisionRequest,
  LoginResponse,
  Tier
} from '@/types/api';

// User API
export const userApi = {
  // 학교 계정 로그인
  login: async (data: SchoolLoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/api/users/login', data);
    return response.data;
  },

  // Riot 계정 연동
  registerRiot: async (data: RiotAccountRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.post('/api/users/register-riot', data);
    return response.data;
  },

  // 내 정보 조회
  getMyInfo: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  // 사용자 목록 조회
  getAllUsers: async (params?: {
    tier?: Tier;
    name?: string;
    hasTeam?: boolean;
  }): Promise<ApiResponse<UserListResponse>> => {
    const response = await apiClient.get('/api/users', { params });
    return response.data;
  },

  // 영입 가능한 사용자 조회
  getAvailableUsers: async (params?: {
    tier?: Tier;
    name?: string;
  }): Promise<ApiResponse<UserListResponse>> => {
    const response = await apiClient.get('/api/users/available', { params });
    return response.data;
  },
};

// Team API
export const teamApi = {
  // 팀 생성
  createTeam: async (data: TeamCreateRequest): Promise<ApiResponse<TeamResponse>> => {
    const response = await apiClient.post('/api/teams', data);
    return response.data;
  },

  // 모든 팀 조회
  getAllTeams: async (): Promise<ApiResponse<TeamListResponse>> => {
    const response = await apiClient.get('/api/teams');
    return response.data;
  },

  // 특정 팀 조회
  getTeamById: async (teamId: number): Promise<ApiResponse<TeamResponse>> => {
    const response = await apiClient.get(`/api/teams/${teamId}`);
    return response.data;
  },

  // 내 팀 조회
  getMyTeam: async (): Promise<ApiResponse<TeamResponse>> => {
    const response = await apiClient.get('/api/teams/my-team');
    return response.data;
  },

  // 팀 탈퇴
  leaveTeam: async (): Promise<ApiResponse<string>> => {
    const response = await apiClient.post('/api/teams/leave');
    return response.data;
  },

  // 팀원 강퇴
  kickMember: async (userId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.post(`/api/teams/kick/${userId}`);
    return response.data;
  },
};

// Recruit API
export const recruitApi = {
  // 영입 요청 보내기
  sendRecruitRequest: async (data: RecruitRequestDto): Promise<ApiResponse<RecruitResponse>> => {
    const response = await apiClient.post('/api/recruits', data);
    return response.data;
  },

  // 영입 요청에 응답
  respondToRecruitRequest: async (
    requestId: number, 
    data: RecruitDecisionRequest
  ): Promise<ApiResponse<string>> => {
    const response = await apiClient.post(`/api/recruits/${requestId}/respond`, data);
    return response.data;
  },

  // 팀에 온 영입 요청들 조회
  getTeamRecruitRequests: async (): Promise<ApiResponse<RecruitListResponse>> => {
    const response = await apiClient.get('/api/recruits/team-requests');
    return response.data;
  },

  // 나에게 온 영입 요청들 조회
  getPendingRequests: async (): Promise<ApiResponse<RecruitListResponse>> => {
    const response = await apiClient.get('/api/recruits/pending');
    return response.data;
  },
}; 