import React from 'react';
import { useAuthStatus } from '@/hooks/useAuth';
import { useMyTeam } from '@/hooks/useTeam';
import { usePendingRequests } from '@/hooks/useRecruit';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { TeamSection } from '@/components/home/TeamSection';
import { AvailablePlayersSection } from '@/components/home/AvailablePlayersSection';
import { PendingRequestsSection } from '@/components/home/PendingRequestsSection';
import { QuickActionsSection } from '@/components/home/QuickActionsSection';

export const HomePage: React.FC = () => {
  const { user } = useAuthStatus();
  const { data: myTeam, isLoading: teamLoading } = useMyTeam();
  const { data: pendingRequests } = usePendingRequests();

  if (!user) {
    return <LoadingSpinner size="lg" />;
  }

  const hasPendingRequests = pendingRequests?.requests && pendingRequests.requests.length > 0;
  const canRecruit = myTeam?.canRecruit;

  return (
    <div className="space-y-6 pb-20">
      <WelcomeSection user={user} />
      
      <TeamSection team={myTeam ?? null} isLoading={teamLoading} />

      {hasPendingRequests && pendingRequests?.requests && (
        <PendingRequestsSection requests={pendingRequests.requests} />
      )}

      {canRecruit && <AvailablePlayersSection />}

      <QuickActionsSection />
    </div>
  );
}; 