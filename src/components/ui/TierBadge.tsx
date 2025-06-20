import React from 'react';
import { cn } from '@/utils/cn';
import { getTierKoreanName, getTierColorClass, isMasterOrAbove } from '@/utils/tier';
import type { Tier, Rank } from '@/types/api';

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

  // 마스터 이상은 LP 표시, 그 외는 랭크 표시
  const displayText = isMasterOrAbove(tier)
    ? `${tierName} ${leaguePoints || 0}LP`
    : rank 
      ? `${tierName} ${rank}` 
      : tierName;

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