import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/services/api';
import { setAuthToken, removeAuthToken, isAuthenticated } from '@/utils/auth';
import { handleApiError } from '@/lib/api';
import type { SchoolLoginRequest, RiotAccountRequest } from '@/types/api';

// 로그인 Hook
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SchoolLoginRequest) => {
      console.log('로그인 시도:', data.account_id);
      const response = await userApi.login(data);
      return response;
    },
    onSuccess: (response) => {
      console.log('로그인 응답:', response);
      
      if (response.success && response.data?.token) {
        console.log('토큰 저장 중...', response.data.token);
        setAuthToken(response.data.token);
        
        // 쿼리 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        
        console.log('Riot 등록 페이지로 이동...');
        // 약간의 지연 후 이동 (상태 업데이트 시간 확보)
        setTimeout(() => {
          navigate('/riot-register', { replace: true });
        }, 100);
      } else {
        console.error('로그인 응답이 예상과 다름:', response);
      }
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Login failed:', apiError.message);
    },
  });
};

// Riot 계정 연동 Hook
export const useRiotRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RiotAccountRequest) => {
      console.log('Riot 계정 연동 시도:', data);
      const response = await userApi.registerRiot(data);
      return response;
    },
    onSuccess: (response) => {
      console.log('Riot 연동 성공:', response);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      console.error('Riot register failed:', apiError.message);
    },
  });
};

// 로그아웃 Hook
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    console.log('로그아웃 실행');
    removeAuthToken();
    queryClient.clear();
    navigate('/login', { replace: true });
  };
};

// 내 정보 조회 Hook
export const useMyInfo = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      console.log('사용자 정보 조회 중...');
      const response = await userApi.getMyInfo();
      console.log('사용자 정보:', response.data);
      return response.data;
    },
    enabled: isAuthenticated(),
    retry: false,
  });
};

// 인증 상태 확인 Hook
export const useAuthStatus = () => {
  const { data: user, isLoading, error } = useMyInfo();
  
  const status = {
    isAuthenticated: isAuthenticated(),
    user,
    isLoading,
    error,
    isLoggedIn: !!user,
    needsRiotRegister: user && !user.summonerName,
  };
  
  console.log('인증 상태:', status);
  return status;
}; 