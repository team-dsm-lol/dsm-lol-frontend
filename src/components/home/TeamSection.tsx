import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MyTeamSection } from './MyTeamSection';
import type { TeamResponse } from '@/types/api';

interface TeamSectionProps {
  team: TeamResponse | null;
  isLoading: boolean;
}

const NoTeamSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-toss-gray-900">팀 생성 (팀원으로 참가하는 경우 팀을 생성하지 말아주세요.)</h2>
      </CardHeader>
      <CardContent>
        <p className="text-toss-gray-600 mb-4">
          아직 팀에 소속되지 않았습니다. 새로운 팀을 만들어보세요!
        </p>
        <Button onClick={() => navigate('/team/create')}>
          팀 만들기
        </Button>
      </CardContent>
    </Card>
  );
};

const LoadingTeamSection: React.FC = () => (
  <Card>
    <CardContent>
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    </CardContent>
  </Card>
);

export const TeamSection: React.FC<TeamSectionProps> = ({ team, isLoading }) => {
  if (isLoading) return <LoadingTeamSection />;
  if (team) return <MyTeamSection team={team} />;
  return <NoTeamSection />;
}; 