import http from 'http'
import { Server } from 'socket.io'
import { initApp } from './express-app'
import { SocketProps } from './public/interfaces'
import { connectMongoDb } from './public/utils'
import { getCurrentPrice, initVb, start, stop } from './vb'

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
      start(String(socket.userTickerId), socket)
    })

    socket.on('stop', async () => {
      console.log(`${socket.id}|${socket.userTickerId} stop`)

      stop(String(socket.userTickerId), socket)
    })

    socket.on('current-price', async () => {
      getCurrentPrice(String(socket.userTickerId), socket)
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
