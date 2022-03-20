import http from 'http'
import { Server } from 'socket.io'
import { initApp } from './express-app'
import { SocketProps } from './public/interfaces'
import { connectMongoDb } from './public/utils'
import { initVb, start, stop, updateUserTicker } from './vb'

const PORT = process.env.APP_PORT || 3001

const serve = async () => {
  const app = initApp()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  await connectMongoDb()

  io.on('connection', async (socket: SocketProps) => {
    const query = socket.handshake.query
    socket.userTickerId = query.userTickerId

    console.log(`${socket.id}|${socket.userTickerId} connected`)

    socket.on('init', async (data) => {
      console.log(`${socket.id}|${socket.userTickerId} init`)
      const { userTickerId } = data
      await initVb(userTickerId, socket)
    })

    socket.on('start', async () => {
      console.log(`${socket.id}|${socket.userTickerId} start`)

      await updateUserTicker({
        userTickerId: socket.userTickerId,
        isStart: true,
      })

      socket.emit('start-res', { message: '프로그램을 시작합니다.' })

      start(String(socket.userTickerId))
    })

    socket.on('stop', async () => {
      console.log(`${socket.id}|${socket.userTickerId} stop`)

      stop(String(socket.userTickerId))
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id}|${socket.userTickerId}: disconnected`)
    })
  })

  server.listen(PORT, () => {
    console.log(`${PORT} 포트에서 서버가 시작되었습니다! 🚀  🚀`)
  })
}

serve()
