import React from 'react';
import { User, Crown, Star } from 'lucide-react';
import type { UserResponse } from '@/types/api';
import { 
  getTierColor, 
  getTierBgColor, 
  formatTierRank, 
  formatUserName,
  getScoreColor 
} from '@/lib/utils';
import Button from './ui/Button';

interface UserCardProps {
  user: UserResponse;
  showActions?: boolean;
  onRecruit?: (userId: number) => void;
  onKick?: (userId: number) => void;
  canKick?: boolean;
  isRecruiting?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  showActions = false,
  onRecruit,
  onKick,
  canKick = false,
  isRecruiting = false
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {formatUserName(user.grade, user.classNum, user.num, user.name)}
              </h3>
              {user.isTeamLeader && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            
            {user.summonerName && (
              <p className="text-sm text-gray-600 mt-1">
                소환사명: {user.summonerName}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2">
              {user.tier ? (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierBgColor(user.tier)} ${getTierColor(user.tier)}`}>
                  <Star className="w-3 h-3 mr-1" />
                  {formatTierRank(user.tier, user.rank)}
                  {user.leaguePoints > 0 && ` (${user.leaguePoints}LP)`}
                </div>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Riot 계정 미연동
                </span>
              )}
              
              <span className={`text-sm font-medium ${getScoreColor(user.score)}`}>
                {user.score}점
              </span>
            </div>
            
            {user.teamName && (
              <p className="text-sm text-blue-600 mt-1">
                팀: {user.teamName}
              </p>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            {onRecruit && !user.teamName && (
              <Button
                size="sm"
                onClick={() => onRecruit(user.id)}
                disabled={isRecruiting}
                isLoading={isRecruiting}
              >
                영입
              </Button>
            )}
            
            {onKick && canKick && user.teamName && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onKick(user.id)}
              >
                강퇴
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard; 