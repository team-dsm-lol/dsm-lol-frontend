import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRiotRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const riotSchema = z.object({
  gameName: z.string().min(1, 'Riot ID를 입력해주세요'),
  tagLine: z.string().min(1, '태그를 입력해주세요'),
  summonerName: z.string().optional(),
});

type RiotFormData = z.infer<typeof riotSchema>;

export const RiotRegisterPage: React.FC = () => {
  const riotRegisterMutation = useRiotRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RiotFormData>({
    resolver: zodResolver(riotSchema),
  });

  const onSubmit = async (data: RiotFormData) => {
    try {
      await riotRegisterMutation.mutateAsync(data);
    } catch (error) {
      console.error('Riot register error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-toss-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="text-3xl mb-2">⚔️</div>
              <h1 className="text-2xl font-bold text-toss-gray-900 mb-2">
                Riot 계정 연동
              </h1>
              <p className="text-toss-gray-600">
                리그에 참여하기 위해 Riot 계정을 연동해주세요
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  {...register('gameName')}
                  label="Riot ID"
                  placeholder="Hide on bush"
                  error={errors.gameName?.message}
                  helperText="# 앞의 게임 이름을 입력하세요"
                />
              </div>

              <div>
                <Input
                  {...register('tagLine')}
                  label="태그"
                  placeholder="KR1"
                  error={errors.tagLine?.message}
                  helperText="# 뒤의 태그를 입력하세요"
                />
              </div>

              <div>
                <Input
                  {...register('summonerName')}
                  label="소환사명 (선택사항)"
                  placeholder="소환사명을 입력하세요"
                  error={errors.summonerName?.message}
                  helperText="비워두면 Riot ID로 자동 설정됩니다"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting || riotRegisterMutation.isPending}
                disabled={isSubmitting || riotRegisterMutation.isPending}
              >
                계정 연동
              </Button>

              {riotRegisterMutation.error && (
                <div className="text-center text-sm text-toss-red">
                  계정 연동에 실패했습니다. 입력 정보를 확인해주세요.
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-toss-gray-500 text-sm">
          <p>예시: Hide on bush#KR1</p>
        </div>
      </div>
    </div>
  );
}; 