# DSM LoL 멸망전 프론트엔드

> 대마고등학교 리그 오브 레전드 리그 시스템

## 프로젝트 개요

DSM LoL 멸망전은 대마고등학교 학생들을 위한 리그 오브 레전드 리그 시스템입니다. 학생들은 팀을 만들고, 다른 플레이어를 영입하여 리그에 참여할 수 있습니다.

## 주요 기능

### 인증 시스템
- 학교 계정 로그인
- Riot 계정 연동
- JWT 기반 인증
- 자동 토큰 갱신 및 만료 처리

### 팀 관리
- 팀 생성 및 관리
- 팀원 영입 시스템
- 팀장 권한 (강퇴, 팀 설정)
- 팀 정보 조회

### 사용자 관리
- 프로필 관리
- 티어 및 점수 시스템
- 영입 가능한 플레이어 조회

### UX 최적화
- 토스 디자인 시스템 기반 UI
- 반응형 디자인
- 모바일 친화적 인터페이스
- 실시간 상태 업데이트

## 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 서버
- **Tailwind CSS** - 유틸리티 우선 CSS
- **React Router** - 클라이언트 사이드 라우팅
- **React Query** - 서버 상태 관리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### API & State
- **Axios** - HTTP 클라이언트
- **js-cookie** - 쿠키 관리
- **Zustand** - 클라이언트 상태 관리

## 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치
```bash
# 저장소 클론
git clone <repository-url>
cd dsm-lol-league-frontend

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어서 필요한 값들을 설정하세요

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 값들을 설정하세요:

```env
# API 서버 URL (필수)
VITE_API_BASE_URL=http://localhost:8080
```

#### 환경별 설정 예시

**개발 환경 (로컬)**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**개발 환경 (네트워크)**
```env
VITE_API_BASE_URL=http://192.168.1.100:8080
```

**프로덕션 환경**
```env
VITE_API_BASE_URL=https://api.dsm-lol.com
```

> ⚠️ **주의**: Vite에서는 환경변수에 `VITE_` 접두사가 필요합니다. 이 접두사가 없으면 클라이언트 사이드에서 접근할 수 없습니다.

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── guards/         # 인증 가드
│   └── home/          # 홈페이지 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 React Hook
├── services/           # API 서비스
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── lib/               # 라이브러리 설정
```

## API 연동

### 인증
- `POST /api/users/login` - 학교 계정 로그인
- `POST /api/users/register-riot` - Riot 계정 연동
- `GET /api/users/me` - 내 정보 조회

### 팀 관리
- `POST /api/teams` - 팀 생성
- `GET /api/teams` - 팀 목록 조회
- `GET /api/teams/my-team` - 내 팀 조회
- `POST /api/teams/leave` - 팀 탈퇴
- `POST /api/teams/kick/{userId}` - 팀원 강퇴

### 영입 시스템
- `POST /api/recruits` - 영입 요청 보내기
- `POST /api/recruits/{requestId}/respond` - 영입 요청 응답
- `GET /api/recruits/pending` - 내게 온 영입 요청
- `GET /api/recruits/team-requests` - 팀에 온 영입 요청

### 사용자 조회
- `GET /api/users` - 전체 사용자 조회
- `GET /api/users/available` - 영입 가능한 사용자 조회

## 주요 페이지

### 📱 로그인 페이지 (`/login`)
- 학교 계정으로 로그인
- 토스 스타일의 그라데이션 배경
- 폼 검증 및 에러 처리

### ⚔️ Riot 연동 페이지 (`/riot-register`)
- Riot ID와 태그 입력
- 계정 연동 및 검증

### 🏠 홈페이지 (`/`)
- 사용자 환영 메시지
- 내 팀 정보 (있는 경우)
- 영입 요청 알림
- 영입 가능한 플레이어 목록
- 퀵 액션 버튼

### 👥 팀 생성 페이지 (`/team/create`)
- 팀 이름 입력
- 팀 생성 및 팀장 권한 부여

### 👤 프로필 페이지 (`/profile`)
- 개인 정보 조회
- 게임 정보 (티어, 점수)
- 팀 소속 정보

### 🏆 팀 목록 페이지 (`/teams`)
- 전체 팀 목록
- 영입 가능한 플레이어 목록
- 검색 및 필터링
- 영입 요청 기능

## 디자인 시스템

### 색상
- **Primary**: `#3182f6` (토스 블루)
- **Gray Scale**: `#f9fafb` ~ `#111827`
- **Tier Colors**: 각 LoL 티어별 고유 색상

### 컴포넌트
- **Button**: 4가지 variant (primary, secondary, outline, ghost)
- **Input**: 라벨, 에러, 도움말 텍스트 지원
- **Card**: 기본 카드 레이아웃
- **TierBadge**: LoL 티어 표시 배지

### 레이아웃
- **모바일 우선** 반응형 디자인
- **하단 네비게이션** (모바일)
- **토스 스타일** 둥근 모서리 및 그림자

## 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod

# 환경 변수 설정
vercel env add VITE_API_BASE_URL
```

### Netlify 배포
```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 업로드
# 환경 변수를 Netlify 대시보드에서 설정
```

## 라이센스

MIT License

## 개발팀

DSM Dev Team - dev@dsm.hs.kr 