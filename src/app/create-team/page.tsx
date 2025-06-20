'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Users } from 'lucide-react';
import { teamApi } from '@/lib/api';
import { useTeamStore } from '@/store/teamStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthGuard from '@/components/AuthGuard';
import type { TeamCreateRequest } from '@/types/api';

type TeamFormData = TeamCreateRequest;

const CreateTeamPage: React.FC = () => {
  const router = useRouter();
  const { setMyTeam } = useTeamStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TeamFormData>();

  const onSubmit = async (data: TeamFormData) => {
    setIsLoading(true);
    try {
      const response = await teamApi.createTeam(data);
      if (response.success && response.data) {
        setMyTeam(response.data);
        toast.success('팀이 성공적으로 생성되었습니다!');
        router.push('/');
      } else {
        toast.error(response.message || '팀 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Team creation error:', error);
      
      // 네트워크 연결 오류 처리
      const axiosError = error as { code?: string; message?: string; response?: { status?: number; data?: { message?: string } } };
      if (axiosError.code === 'ECONNREFUSED' || axiosError.message?.includes('Network Error') || axiosError.code === 'ERR_NETWORK') {
        toast.error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      } else if (axiosError.response?.status === 400) {
        toast.error(axiosError.response?.data?.message || '팀 생성에 실패했습니다.');
      } else {
        toast.error('팀 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">팀 생성</h1>
            </div>
          </div>
        </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">새 팀 생성</h2>
            <p className="mt-2 text-sm text-gray-600">
              LOL 멸망전에 참여할 팀을 생성하세요
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">팀 생성 규칙</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 팀 이름은 2~20자로 설정해야 합니다</li>
                <li>• 팀을 생성하면 자동으로 팀장이 됩니다</li>
                <li>• 팀은 최대 5명까지 구성할 수 있습니다</li>
                <li>• 생성 후 팀원을 영입하여 팀을 완성하세요</li>
              </ul>
            </div>

            <Input
              label="팀 이름"
              type="text"
              placeholder="팀 이름을 입력하세요 (2~20자)"
              error={errors.name?.message}
              {...register('name', {
                required: '팀 이름을 입력하세요',
                minLength: {
                  value: 2,
                  message: '팀 이름은 최소 2자 이상이어야 합니다'
                },
                maxLength: {
                  value: 20,
                  message: '팀 이름은 최대 20자까지 가능합니다'
                }
              })}
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>주의:</strong> 팀을 생성한 후에는 팀 이름을 변경할 수 없습니다. 
                신중하게 결정해주세요.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                취소
              </Button>
              
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="flex-1"
              >
                팀 생성
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
};

export default CreateTeamPage; 