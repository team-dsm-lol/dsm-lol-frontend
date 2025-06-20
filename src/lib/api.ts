import axios, { AxiosError } from 'axios';
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
  Tier
} from '@/types/api';
import { globalLogout } from '@/store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Token management
let accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('accessToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken');
  }
};

export const getAuthToken = (): string | null => {
  if (accessToken) return accessToken;
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAuthToken(token);
      return token;
    }
  }
  
  return null;
};

// Initialize token on startup
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken');
  if (token) {
    setAuthToken(token);
  }
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('API: 401 Unauthorized - 토큰이 유효하지 않음');
      setAuthToken(null);
      globalLogout();
      
      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  // 학교 계정 로그인
  login: async (data: SchoolLoginRequest): Promise<ApiResponse<{ access_token: string }>> => {
    const response = await api.post('/api/users/login', data);
    return response.data;
  },

  // Riot 계정 연동
  registerRiot: async (data: RiotAccountRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await api.post('/api/users/register-riot', data);
    return response.data;
  },

  // 내 정보 조회
  getMyInfo: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  // 사용자 목록 조회
  getAllUsers: async (params?: {
    tier?: Tier;
    name?: string;
    hasTeam?: boolean;
  }): Promise<ApiResponse<UserListResponse>> => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  // 영입 가능한 사용자 조회
  getAvailableUsers: async (params?: {
    tier?: Tier;
    name?: string;
  }): Promise<ApiResponse<UserListResponse>> => {
    const response = await api.get('/api/users/available', { params });
    return response.data;
  },
};

// Team API
export const teamApi = {
  // 팀 생성
  createTeam: async (data: TeamCreateRequest): Promise<ApiResponse<TeamResponse>> => {
    const response = await api.post('/api/teams', data);
    return response.data;
  },

  // 모든 팀 조회
  getAllTeams: async (): Promise<ApiResponse<TeamListResponse>> => {
    const response = await api.get('/api/teams');
    return response.data;
  },

  // 특정 팀 조회
  getTeamById: async (teamId: number): Promise<ApiResponse<TeamResponse>> => {
    const response = await api.get(`/api/teams/${teamId}`);
    return response.data;
  },

  // 내 팀 조회
  getMyTeam: async (): Promise<ApiResponse<TeamResponse>> => {
    const response = await api.get('/api/teams/my-team');
    return response.data;
  },

  // 팀 탈퇴
  leaveTeam: async (): Promise<ApiResponse<string>> => {
    const response = await api.post('/api/teams/leave');
    return response.data;
  },

  // 팀원 강퇴
  kickMember: async (userId: number): Promise<ApiResponse<string>> => {
    const response = await api.post(`/api/teams/kick/${userId}`);
    return response.data;
  },
};

// Recruit API
export const recruitApi = {
  // 영입 요청 보내기
  sendRecruitRequest: async (data: RecruitRequestDto): Promise<ApiResponse<RecruitResponse>> => {
    const response = await api.post('/api/recruits', data);
    return response.data;
  },

  // 영입 요청에 응답
  respondToRecruitRequest: async (
    requestId: number, 
    data: RecruitDecisionRequest
  ): Promise<ApiResponse<string>> => {
    const response = await api.post(`/api/recruits/${requestId}/respond`, data);
    return response.data;
  },

  // 팀에 온 영입 요청들 조회
  getTeamRecruitRequests: async (): Promise<ApiResponse<RecruitListResponse>> => {
    const response = await api.get('/api/recruits/team-requests');
    return response.data;
  },

  // 나에게 온 영입 요청들 조회
  getPendingRequests: async (): Promise<ApiResponse<RecruitListResponse>> => {
    const response = await api.get('/api/recruits/pending');
    return response.data;
  },
};

export default api; 