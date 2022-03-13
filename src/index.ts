import http from 'http'
import { Server, Socket } from 'socket.io'
import { initApp } from './express-app'

const PORT = process.env.APP_PORT || 3001

const app = initApp()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

io.on('connection', async (socket: Socket) => {
  // TODO: 소켓 연결시 처리
  console.log(`${socket.id} connected`)

  socket.on('disconnect', () => {
    console.log(`${socket.id}: disconnected`)
  })
})

server.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버가 시작되었습니다! 🚀  🚀`)
})
