import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateTeam } from '@/hooks/useTeam';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const teamSchema = z.object({
  name: z.string()
    .min(2, '팀 이름은 2글자 이상이어야 합니다')
    .max(20, '팀 이름은 20글자 이하여야 합니다'),
});

type TeamFormData = z.infer<typeof teamSchema>;

export const TeamCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createTeamMutation = useCreateTeam();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      await createTeamMutation.mutateAsync(data);
      alert('팀이 성공적으로 생성되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('Team creation error:', error);
      alert('팀 생성에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <h1 className="text-2xl font-bold text-toss-gray-900 mb-2">
              새 팀 만들기
            </h1>
            <p className="text-toss-gray-600">
              함께 멸망전에 참여할 팀을 만들어보세요
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register('name')}
                label="팀 이름"
                placeholder="팀 이름을 입력하세요"
                error={errors.name?.message}
                helperText="2-20글자 사이로 입력해주세요"
                maxLength={20}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={isSubmitting || createTeamMutation.isPending}
                disabled={isSubmitting || createTeamMutation.isPending}
              >
                팀 만들기
              </Button>
            </div>

            {createTeamMutation.error && (
              <div className="text-center text-sm text-toss-red">
                팀 생성에 실패했습니다. 다시 시도해주세요.
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-toss-gray-500 text-sm">
        <p>팀장이 되어 멸망전을 이끌어보세요! 🏆</p>
      </div>
    </div>
  );
}; 