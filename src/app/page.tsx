'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  Users, 
  Trophy, 
  Plus, 
  Search, 
  LogOut,
  Settings,
  Crown,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTeamStore } from '@/store/teamStore';
import { userApi, teamApi, recruitApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import UserCard from '@/components/UserCard';
import TeamCard from '@/components/TeamCard';
import AuthGuard from '@/components/AuthGuard';
import { formatTierRank, getTierColor, getScoreColor } from '@/lib/utils';
import type { UserResponse, Tier } from '@/types/api';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, setUser, setLoading } = useAuthStore();
  const { myTeam, allTeams, availableUsers, setMyTeam, setAllTeams, setAvailableUsers } = useTeamStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier | ''>('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [recruitingUsers, setRecruitingUsers] = useState<Set<number>>(new Set());

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated || !user) {
        console.log('HomePage: 인증되지 않았거나 사용자 정보 없음');
        return; // AuthGuard에서 이미 처리
      }

      console.log('HomePage: 초기 데이터 로드 시작');
      try {
        setIsLoadingData(true);
        
        // 내 팀 정보 가져오기
        let hasMyTeam = false;
        try {
          console.log('HomePage: 팀 정보 요청');
          const teamResponse = await teamApi.getMyTeam();
          console.log('HomePage: 팀 정보 응답:', teamResponse);
          if (teamResponse.success && teamResponse.data) {
            setMyTeam(teamResponse.data);
            hasMyTeam = true;
          }
        } catch (error) {
          // 팀이 없으면 에러가 발생할 수 있음
          console.log('HomePage: 팀 없음:', error);
        }

        // 팀이 없으면 모든 팀 목록 가져오기
        if (!hasMyTeam) {
          try {
            setIsLoadingTeams(true);
            console.log('HomePage: 모든 팀 목록 요청');
            const allTeamsResponse = await teamApi.getAllTeams();
            console.log('HomePage: 모든 팀 목록 응답:', allTeamsResponse);
            if (allTeamsResponse.success && allTeamsResponse.data) {
              setAllTeams(allTeamsResponse.data.teams);
            }
          } catch (error) {
            console.error('HomePage: 모든 팀 목록 가져오기 실패:', error);
            // API 호출이 실패해도 빈 배열로 설정하여 UI에 섹션은 표시되도록 함
            setAllTeams([]);
          } finally {
            setIsLoadingTeams(false);
          }
        }

        // 영입 가능한 사용자 목록 가져오기 (팀이 있는 경우만)
        if (user.teamName) {
          console.log('HomePage: 영입 가능한 사용자 목록 요청');
          const availableResponse = await userApi.getAvailableUsers();
          console.log('HomePage: 영입 가능한 사용자 응답:', availableResponse);
          if (availableResponse.success && availableResponse.data) {
            setAvailableUsers(availableResponse.data.users);
          }
        }

      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        console.log('HomePage: 데이터 로드 완료');
        setIsLoadingData(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user]); // user가 설정된 후에 실행

  // 검색 및 필터링된 사용자 목록
  const filteredUsers = availableUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.summonerName && user.summonerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = !selectedTier || user.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('로그아웃되었습니다.');
  };

  const handleRecruit = async (targetUserId: number) => {
    if (!user?.isTeamLeader) {
      toast.error('팀장만 영입 요청을 보낼 수 있습니다.');
      return;
    }

    setRecruitingUsers(prev => new Set(prev).add(targetUserId));
    
    try {
      const response = await recruitApi.sendRecruitRequest({
        targetUserId,
        message: `${user.name}님이 ${myTeam?.name} 팀으로 영입 요청을 보냈습니다.`
      });

      if (response.success) {
        toast.success('영입 요청을 보냈습니다.');
      } else {
        toast.error(response.message || '영입 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Recruit error:', error);
      toast.error('영입 요청 중 오류가 발생했습니다.');
    } finally {
      setRecruitingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  };

  const handleCreateTeam = () => {
    router.push('/create-team');
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Trophy className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">DSM LOL 멸망전</h1>
              </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name} ({user?.grade}학년 {user?.classNum}반)
                </p>
                {user?.tier && (
                  <p className={`text-xs ${getTierColor(user.tier)}`}>
                    {formatTierRank(user.tier, user.rank)} - {user.score}점
                  </p>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/profile')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Team Section */}
        {myTeam ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                내 팀: {myTeam.name}
              </h2>
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-bold ${getScoreColor(myTeam.totalScore)}`}>
                  총 점수: {myTeam.totalScore}점
                </span>
                <span className="text-sm text-gray-600">
                  {myTeam.memberCount}/5명
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeam.members.map((member) => (
                <UserCard
                  key={member.id}
                  user={member}
                  showActions={false}
                />
              ))}
            </div>

            {myTeam.canRecruit && user?.isTeamLeader && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  팀장으로서 아래 영입 가능한 선수들을 확인하고 영입 요청을 보낼 수 있습니다.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 팀 생성 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">팀이 없습니다</h2>
              <p className="text-gray-600 mb-4">
                새로운 팀을 생성하여 멸망전에 참여하세요!
              </p>
              <Button onClick={handleCreateTeam}>
                <Plus className="h-4 w-4 mr-2" />
                팀 생성하기
              </Button>
            </div>

            {/* 현재 생성된 팀 목록 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Trophy className="h-5 w-5 text-blue-500 mr-2" />
                  현재 생성된 팀들
                </h2>
                <span className="text-sm text-gray-600">
                  {allTeams.length}개 팀
                </span>
              </div>

              {isLoadingTeams ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">팀 목록을 불러오는 중...</p>
                </div>
              ) : allTeams.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {allTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      showJoinButton={false} // 나중에 팀 가입 요청 기능 추가 시 true로 변경
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">아직 생성된 팀이 없습니다.</p>
                  <p className="text-gray-500 text-sm">첫 번째 팀을 만들어보세요!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Available Users Section - 팀이 있고 영입 가능한 경우만 표시 */}
        {myTeam && myTeam.canRecruit && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Star className="h-5 w-5 text-blue-500 mr-2" />
                영입 가능한 선수들
              </h2>
              <span className="text-sm text-gray-600">
                {filteredUsers.length}명
              </span>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="이름 또는 소환사명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as Tier | '')}
                >
                  <option value="">모든 티어</option>
                  <option value="IRON">아이언</option>
                  <option value="BRONZE">브론즈</option>
                  <option value="SILVER">실버</option>
                  <option value="GOLD">골드</option>
                  <option value="PLATINUM">플래티넘</option>
                  <option value="EMERALD">에메랄드</option>
                  <option value="DIAMOND">다이아몬드</option>
                  <option value="MASTER">마스터</option>
                  <option value="GRANDMASTER">그랜드마스터</option>
                  <option value="CHALLENGER">챌린저</option>
                </select>
              </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((availableUser) => (
                  <UserCard
                    key={availableUser.id}
                    user={availableUser}
                    showActions={true}
                    onRecruit={user?.isTeamLeader ? handleRecruit : undefined}
                    isRecruiting={recruitingUsers.has(availableUser.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">검색 조건에 맞는 선수를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
                 )}
       </main>
     </div>
   </AuthGuard>
 );
};

export default HomePage;
