import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const loginSchema = z.object({
  account_id: z.string().min(1, '학번을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const loginMutation = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-toss-blue to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-white mb-2">🎮</div>
          <h1 className="text-3xl font-bold text-white mb-2">DSM LoL 멸망전</h1>
          <p className="text-blue-100">대마고등학교 리그 오브 레전드 리그</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register('account_id')}
                label="학번"
                placeholder="학번을 입력하세요"
                error={errors.account_id?.message}
                autoComplete="username"
              />
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                error={errors.password?.message}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting || loginMutation.isPending}
              disabled={isSubmitting || loginMutation.isPending}
            >
              로그인
            </Button>

            {loginMutation.error && (
              <div className="text-center text-sm text-toss-red">
                로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.
              </div>
            )}
          </form>
        </Card>

        <div className="mt-6 text-center text-blue-100 text-sm">
          <p>DSM 학교 계정으로 로그인하세요</p>
        </div>
      </div>
    </div>
  );
}; 