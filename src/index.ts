import http from 'http'
import { initApp } from './express-app'

const PORT = process.env.APP_PORT || 3010

const serve = async () => {
  const app = initApp()
  const server = http.createServer(app)

  server.listen(PORT, () => {
    console.log(`${PORT} 포트에서 서버가 시작되었습니다! 🚀  🚀`)
  })
}

serve()
