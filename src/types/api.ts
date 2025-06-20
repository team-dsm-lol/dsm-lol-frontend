// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// User Types
export type Tier = 
  | "IRON" 
  | "BRONZE" 
  | "SILVER" 
  | "GOLD" 
  | "PLATINUM" 
  | "EMERALD" 
  | "DIAMOND" 
  | "MASTER" 
  | "GRANDMASTER" 
  | "CHALLENGER";

export type Rank = "IV" | "III" | "II" | "I";

export type UserRole = "SCH" | "STU" | "DOR";

export interface UserResponse {
  id: number;
  accountId: string;
  name: string;
  grade: number;
  classNum: number;
  num: number;
  userRole: UserRole;
  summonerName?: string;
  tier?: Tier;
  rank?: Rank;
  leaguePoints: number;
  score: number;
  teamName?: string;
  isTeamLeader: boolean;
}

export interface UserListResponse {
  users: UserResponse[];
  totalCount: number;
}

// Team Types
export interface TeamResponse {
  id: number;
  name: string;
  leader: UserResponse;
  members: UserResponse[];
  totalScore: number;
  memberCount: number;
  canRecruit: boolean;
  createdAt: string;
}

export interface TeamListResponse {
  teams: TeamResponse[];
  totalCount: number;
}

// Recruit Types
export type RecruitStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface RecruitResponse {
  id: number;
  team: TeamResponse;
  targetUser: UserResponse;
  requester: UserResponse;
  status: RecruitStatus;
  message?: string;
  createdAt: string;
}

export interface RecruitListResponse {
  requests: RecruitResponse[];
  totalCount: number;
}

// Request Types
export interface SchoolLoginRequest {
  account_id: string;
  password: string;
}

export interface RiotAccountRequest {
  gameName: string;
  tagLine: string;
  summonerName?: string;
}

export interface TeamCreateRequest {
  name: string;
}

export interface RecruitRequestDto {
  targetUserId: number;
  message?: string;
}

export interface RecruitDecisionRequest {
  accept: boolean;
} 