import { Tier, Rank } from '@/types/api';

// 티어 순서 정의
const TIER_ORDER: Record<Tier, number> = {
  IRON: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  EMERALD: 6,
  DIAMOND: 7,
  MASTER: 8,
  GRANDMASTER: 9,
  CHALLENGER: 10,
};

// 랭크 순서 정의
const RANK_ORDER: Record<Rank, number> = {
  IV: 1,
  III: 2,
  II: 3,
  I: 4,
};

// 티어 한글 이름
export const getTierKoreanName = (tier: Tier): string => {
  const tierNames: Record<Tier, string> = {
    IRON: '아이언',
    BRONZE: '브론즈',
    SILVER: '실버',
    GOLD: '골드',
    PLATINUM: '플래티넘',
    EMERALD: '에메랄드',
    DIAMOND: '다이아몬드',
    MASTER: '마스터',
    GRANDMASTER: '그랜드마스터',
    CHALLENGER: '챌린저',
  };
  return tierNames[tier];
};

// 티어 색상 클래스 반환
export const getTierColorClass = (tier: Tier): string => {
  const colorClasses: Record<Tier, string> = {
    IRON: 'text-tier-iron bg-tier-iron/10',
    BRONZE: 'text-tier-bronze bg-tier-bronze/10',
    SILVER: 'text-tier-silver bg-tier-silver/10',
    GOLD: 'text-tier-gold bg-tier-gold/10',
    PLATINUM: 'text-tier-platinum bg-tier-platinum/10',
    EMERALD: 'text-tier-emerald bg-tier-emerald/10',
    DIAMOND: 'text-tier-diamond bg-tier-diamond/10',
    MASTER: 'text-tier-master bg-tier-master/10',
    GRANDMASTER: 'text-tier-grandmaster bg-tier-grandmaster/10',
    CHALLENGER: 'text-tier-challenger bg-tier-challenger/10',
  };
  return colorClasses[tier];
};

// 티어 비교 함수 (높은 티어일수록 큰 값)
export const compareTier = (
  tier1: Tier, 
  rank1: Rank | undefined, 
  lp1: number,
  tier2: Tier, 
  rank2: Rank | undefined, 
  lp2: number
): number => {
  const tier1Order = TIER_ORDER[tier1];
  const tier2Order = TIER_ORDER[tier2];
  
  if (tier1Order !== tier2Order) {
    return tier1Order - tier2Order;
  }
  
  // 마스터 이상은 LP로만 비교
  if (tier1Order >= 8) {
    return lp1 - lp2;
  }
  
  // 같은 티어인 경우 랭크 비교
  if (rank1 && rank2) {
    const rank1Order = RANK_ORDER[rank1];
    const rank2Order = RANK_ORDER[rank2];
    
    if (rank1Order !== rank2Order) {
      return rank1Order - rank2Order;
    }
  }
  
  // 같은 티어, 같은 랭크인 경우 LP 비교
  return lp1 - lp2;
};

// 티어 표시 문자열 생성
export const getTierDisplayString = (
  tier: Tier, 
  rank?: Rank, 
  leaguePoints?: number
): string => {
  const tierName = getTierKoreanName(tier);
  
  // 마스터 이상은 LP만 표시
  if (TIER_ORDER[tier] >= 8) {
    return `${tierName} ${leaguePoints || 0}LP`;
  }
  
  // 그 외는 티어 + 랭크
  return rank ? `${tierName} ${rank}` : tierName;
};

// 점수 기반 예상 티어 계산 (대략적)
export const getEstimatedTier = (score: number): Tier => {
  if (score >= 2400) return 'CHALLENGER';
  if (score >= 2200) return 'GRANDMASTER';
  if (score >= 2000) return 'MASTER';
  if (score >= 1800) return 'DIAMOND';
  if (score >= 1600) return 'EMERALD';
  if (score >= 1400) return 'PLATINUM';
  if (score >= 1200) return 'GOLD';
  if (score >= 1000) return 'SILVER';
  if (score >= 800) return 'BRONZE';
  return 'IRON';
}; 