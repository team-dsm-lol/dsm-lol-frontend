'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogIn, GamepadIcon } from 'lucide-react';
import { userApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { SchoolLoginRequest, RiotAccountRequest, UserResponse } from '@/types/api';

type LoginFormData = SchoolLoginRequest;

type RiotFormData = RiotAccountRequest;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, setUser } = useAuthStore();
  const [step, setStep] = useState<'school' | 'riot'>('school');
  const [isLoading, setIsLoading] = useState(false);

  // 학교 로그인 폼
  const {
    register: registerSchool,
    handleSubmit: handleSchoolSubmit,
    formState: { errors: schoolErrors }
  } = useForm<LoginFormData>();

  // Riot 계정 연동 폼
  const {
    register: registerRiot,
    handleSubmit: handleRiotSubmit,
    formState: { errors: riotErrors }
  } = useForm<RiotFormData>();

  const onSchoolLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('로그인 시도:', data);
      const response = await userApi.login(data);
      console.log('로그인 응답:', response);
      
      if (response.success && response.data) {
                         // API 문서에 따르면 data는 Map<String, String> 형태
        const tokenData = response.data as { access_token?: string; token?: string; accessToken?: string };
        const token = tokenData.access_token || tokenData.token || tokenData.accessToken;
        
        if (token) {
          console.log('토큰 받음:', token);
          
          // 먼저 토큰을 설정
          login(token, {} as UserResponse); // 임시로 빈 객체 전달
          
          // 토큰 설정 후 사용자 정보 가져오기
          try {
            const userResponse = await userApi.getMyInfo();
            console.log('사용자 정보 응답:', userResponse);
            
            if (userResponse.success && userResponse.data) {
              // 사용자 정보로 업데이트
              login(token, userResponse.data);
              
              // Riot 계정이 연동되어 있지 않으면 연동 단계로
              if (!userResponse.data.summonerName || !userResponse.data.tier) {
                setStep('riot');
                toast.success('학교 로그인 성공! Riot 계정을 연동해주세요.');
              } else {
                toast.success('로그인 성공!');
                router.push('/');
              }
            } else {
              toast.error('사용자 정보를 가져오는데 실패했습니다.');
            }
          } catch (userError) {
            console.error('사용자 정보 가져오기 실패:', userError);
            toast.error('사용자 정보를 가져오는데 실패했습니다.');
          }
        } else {
          console.error('토큰을 찾을 수 없음:', response.data);
          toast.error('로그인 토큰을 받지 못했습니다.');
        }
      } else {
        toast.error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // 네트워크 연결 오류 처리
      const axiosError = error as { code?: string; message?: string; response?: { status?: number } };
      if (axiosError.code === 'ECONNREFUSED' || axiosError.message?.includes('Network Error') || axiosError.code === 'ERR_NETWORK') {
        toast.error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      } else if (axiosError.response?.status === 401) {
        toast.error('로그인 정보가 올바르지 않습니다.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRiotRegister = async (data: RiotFormData) => {
    setIsLoading(true);
    try {
      const response = await userApi.registerRiot(data);
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Riot 계정 연동 완료!');
        router.push('/');
      } else {
        toast.error(response.message || 'Riot 계정 연동에 실패했습니다.');
      }
    } catch (error) {
      console.error('Riot register error:', error);
      toast.error('Riot 계정 연동 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const skipRiotRegistration = () => {
    toast.success('로그인 완료! 나중에 Riot 계정을 연동할 수 있습니다.');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {step === 'school' ? (
                <LogIn className="h-8 w-8 text-white" />
              ) : (
                <GamepadIcon className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {step === 'school' ? 'DSM LOL 멸망전' : 'Riot 계정 연동'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'school' 
                ? '학교 계정으로 로그인하세요' 
                : 'Riot 계정을 연동하여 티어 정보를 가져오세요'
              }
            </p>
          </div>

          {step === 'school' ? (
            <form className="mt-8 space-y-6" onSubmit={handleSchoolSubmit(onSchoolLogin)}>
              <Input
                label="학교 계정 ID"
                type="text"
                placeholder="학번을 입력하세요"
                error={schoolErrors.account_id?.message}
                {...registerSchool('account_id', {
                  required: '학교 계정 ID를 입력하세요'
                })}
              />

              <Input
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                error={schoolErrors.password?.message}
                {...registerSchool('password', {
                  required: '비밀번호를 입력하세요'
                })}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                로그인
              </Button>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleRiotSubmit(onRiotRegister)}>
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p>예시: gameName은 &quot;Hide on bush&quot;, tagLine은 &quot;KR1&quot;</p>
                <p>소환사명#태그 형태로 입력해주세요.</p>
              </div>

              <Input
                label="게임 이름 (Game Name)"
                type="text"
                placeholder="Hide on bush"
                error={riotErrors.gameName?.message}
                {...registerRiot('gameName', {
                  required: '게임 이름을 입력하세요'
                })}
              />

              <Input
                label="태그 라인 (Tag Line)"
                type="text"
                placeholder="KR1"
                error={riotErrors.tagLine?.message}
                {...registerRiot('tagLine', {
                  required: '태그 라인을 입력하세요'
                })}
              />

              <Input
                label="소환사명 (선택사항)"
                type="text"
                placeholder="소환사명을 입력하세요"
                helperText="Riot ID와 다른 경우에만 입력하세요"
                {...registerRiot('summonerName')}
              />

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  isLoading={isLoading}
                >
                  계정 연동
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={skipRiotRegistration}
                  disabled={isLoading}
                >
                  나중에
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 