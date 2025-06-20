import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/services/api';
import { setAuthToken, removeAuthToken, isAuthenticated } from '@/utils/auth';
import { handleApiError } from '@/lib/api';
import { NAVIGATION_DELAY_MS } from '@/constants';
import type { SchoolLoginRequest, RiotAccountRequest } from '@/types/api';

// 로그인 후 리다이렉트 로직을 별도 함수로 분리
const handlePostLoginRedirect = async (
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    console.log('사용자 정보 조회 중...');
    const userInfoResponse = await userApi.getMyInfo();
    
    if (userInfoResponse.success && userInfoResponse.data) {
      const user = userInfoResponse.data;
      console.log('사용자 정보:', user);
      
      const hasRiotIntegration = user.summonerName && user.tier;
      const targetPath = hasRiotIntegration ? '/' : '/riot-register';
      const logMessage = hasRiotIntegration 
        ? 'Riot 연동 완료된 사용자, 홈으로 이동...'
        : 'Riot 연동 필요한 사용자, Riot 등록 페이지로 이동...';
      
      console.log(logMessage);
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, NAVIGATION_DELAY_MS);
    } else {
      console.error('사용자 정보 조회 실패:', userInfoResponse);
      navigateToRiotRegister(navigate);
    }
  } catch (error) {
    console.error('사용자 정보 조회 중 오류:', error);
    navigateToRiotRegister(navigate);
  }
};

const navigateToRiotRegister = (navigate: ReturnType<typeof useNavigate>) => {
  setTimeout(() => {
    navigate('/riot-register', { replace: true });
  }, NAVIGATION_DELAY_MS);
};

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
    onSuccess: async (response) => {
      console.log('로그인 응답:', response);
      
      if (response.success && response.data?.token) {
        console.log('토큰 저장 중...', response.data.token);
        setAuthToken(response.data.token);
        
        // 쿼리 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        
        await handlePostLoginRedirect(navigate);
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
        }, NAVIGATION_DELAY_MS);
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
    // Riot 연동 필요 조건: 사용자는 있지만 summonerName이나 tier가 없는 경우
    needsRiotRegister: user && (!user.summonerName || !user.tier),
  };
  
  console.log('인증 상태:', status);
  return status;
}; 