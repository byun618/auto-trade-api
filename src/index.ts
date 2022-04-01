import http from 'http'
import { initApp } from './express-app'
import { connectMongoDb } from './public/utils'

const PORT = process.env.APP_PORT || 3010

const serve = async () => {
  const app = initApp()
  const server = http.createServer(app)

  await connectMongoDb()

  server.listen(PORT, () => {
    console.log(`${PORT} 포트에서 서버가 시작되었습니다! 🚀  🚀`)
  })
}

serve()
