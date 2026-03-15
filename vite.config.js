import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리의 모든 환경 변수를 로드합니다.
  const env = loadEnv(mode, process.cwd(), '')
  
  let allowedHost = []
  try {
    if (env.VITE_API_BASE_URL) {
      // VITE_API_BASE_URL에서 도메인 부분만 추출
      const url = new URL(env.VITE_API_BASE_URL)
      allowedHost = [url.hostname]
    }
  } catch (error) {
    console.error('Failed to parse VITE_API_BASE_URL', error)
  }

  return {
    plugins: [react()],
    server: {
      allowedHosts: allowedHost.length > 0 ? allowedHost : ["viraltube.ap-northeast-2.arkain.site"]
    }
  }
})
