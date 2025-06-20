 import React from 'react';
import { getTierKoreanName, getTierColorClass } from '@/utils/tier';
import type { Tier, Rank } from '@/types/api';
import { cn } from '@/utils/cn';

interface TierBadgeProps {
  tier: Tier;
  rank?: Rank;
  leaguePoints?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  rank,
  leaguePoints,
  size = 'md',
  className,
}) => {
  const tierName = getTierKoreanName(tier);
  const colorClass = getTierColorClass(tier);
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // 마스터 이상은 LP 표시
  const displayText = (() => {
    const tierOrder = {
      IRON: 1, BRONZE: 2, SILVER: 3, GOLD: 4, PLATINUM: 5,
      EMERALD: 6, DIAMOND: 7, MASTER: 8, GRANDMASTER: 9, CHALLENGER: 10
    };
    
    if (tierOrder[tier] >= 8) {
      return `${tierName} ${leaguePoints || 0}LP`;
    }
    
    return rank ? `${tierName} ${rank}` : tierName;
  })();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg font-medium',
        colorClass,
        sizes[size],
        className
      )}
    >
      {displayText}
    </span>
  );
}; 