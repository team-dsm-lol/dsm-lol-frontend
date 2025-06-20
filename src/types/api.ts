// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 티어 타입
export type Tier = 
  | 'IRON'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'EMERALD'
  | 'DIAMOND'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'CHALLENGER';

// 랭크 타입
export type Rank = 'IV' | 'III' | 'II' | 'I';

// 사용자 역할 타입
export type UserRole = 'SCH' | 'STU' | 'DOR';

// 영입 상태 타입
export type RecruitStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// 사용자 타입
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

// 팀 타입
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

// 영입 요청 타입
export interface RecruitResponse {
  id: number;
  team: TeamResponse;
  targetUser: UserResponse;
  requester: UserResponse;
  status: RecruitStatus;
  message?: string;
  createdAt: string;
}

// 로그인 응답 타입 (실제 API 응답에 맞게 수정)
export interface LoginResponse {
  token: string;
}

// 요청 타입들
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

// 리스트 응답 타입들
export interface UserListResponse {
  users: UserResponse[];
  totalCount: number;
}

export interface TeamListResponse {
  teams: TeamResponse[];
  totalCount: number;
}

export interface RecruitListResponse {
  requests: RecruitResponse[];
  totalCount: number;
} 