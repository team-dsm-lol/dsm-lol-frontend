import { type ClassValue, clsx } from "clsx";
import type { Tier, Rank } from '@/types/api';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Tier 관련 유틸리티
export const getTierColor = (tier?: Tier): string => {
  if (!tier) return 'text-gray-500';
  
  const tierColors: Record<Tier, string> = {
    IRON: 'text-gray-600',
    BRONZE: 'text-orange-600',
    SILVER: 'text-gray-400',
    GOLD: 'text-yellow-500',
    PLATINUM: 'text-green-500',
    EMERALD: 'text-emerald-500',
    DIAMOND: 'text-blue-500',
    MASTER: 'text-purple-500',
    GRANDMASTER: 'text-red-500',
    CHALLENGER: 'text-pink-500'
  };
  
  return tierColors[tier];
};

export const getTierBgColor = (tier?: Tier): string => {
  if (!tier) return 'bg-gray-100';
  
  const tierBgColors: Record<Tier, string> = {
    IRON: 'bg-gray-100',
    BRONZE: 'bg-orange-100',
    SILVER: 'bg-gray-100',
    GOLD: 'bg-yellow-100',
    PLATINUM: 'bg-green-100',
    EMERALD: 'bg-emerald-100',
    DIAMOND: 'bg-blue-100',
    MASTER: 'bg-purple-100',
    GRANDMASTER: 'bg-red-100',
    CHALLENGER: 'bg-pink-100'
  };
  
  return tierBgColors[tier];
};

export const formatTierRank = (tier?: Tier, rank?: Rank): string => {
  if (!tier) return '언랭크';
  
  if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
    return tier;
  }
  
  return `${tier} ${rank || ''}`.trim();
};

export const getTierScore = (tier?: Tier, rank?: Rank, leaguePoints?: number): number => {
  if (!tier) return 0;
  
  const tierScores: Record<Tier, number> = {
    IRON: 100,
    BRONZE: 200,
    SILVER: 300,
    GOLD: 400,
    PLATINUM: 500,
    EMERALD: 600,
    DIAMOND: 700,
    MASTER: 800,
    GRANDMASTER: 900,
    CHALLENGER: 1000
  };
  
  const rankScores: Record<Rank, number> = {
    'IV': 0,
    'III': 25,
    'II': 50,
    'I': 75
  };
  
  let score = tierScores[tier] || 0;
  
  if (rank && (tier !== 'MASTER' && tier !== 'GRANDMASTER' && tier !== 'CHALLENGER')) {
    score += rankScores[rank] || 0;
  }
  
  if (leaguePoints && leaguePoints > 0) {
    score += Math.floor(leaguePoints / 10);
  }
  
  return score;
};

// 날짜 포맷팅
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 사용자 이름 포맷팅
export const formatUserName = (grade: number, classNum: number, num: number, name: string): string => {
  return `${grade}학년 ${classNum}반 ${num}번 ${name}`;
};

// 점수 색상
export const getScoreColor = (score: number): string => {
  if (score >= 800) return 'text-red-600 font-bold';
  if (score >= 600) return 'text-purple-600 font-semibold';
  if (score >= 400) return 'text-blue-600 font-medium';
  if (score >= 200) return 'text-green-600';
  return 'text-gray-600';
}; 