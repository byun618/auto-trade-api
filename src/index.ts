import http from 'http'
import moment from 'moment-timezone'
import { Server } from 'socket.io'
import { initApp } from './express-app'
import { SocketProps } from './public/interfaces'
import { connectMongoDb } from './public/utils'
import { initVb, updateUserTicker } from './vb'

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
      const { userTickerId } = data
      const vb = await initVb(userTickerId)
      const target = vb.getTarget()

      await updateUserTicker({ userTickerId, ...target })

      console.log({ userTickerId, ...target })

      socket.emit('init-res')
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
