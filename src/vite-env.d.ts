/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
  // 더 많은 환경 변수를 여기에 추가하세요...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 