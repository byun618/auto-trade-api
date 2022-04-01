import http from 'http'
import { Server } from 'socket.io'
import { initApp } from './express-app'
import Program from './program'
import { SocketProps } from './public/interfaces'
import { connectMongoDb } from './public/utils'

const PORT = process.env.APP_PORT || 3010

const serve = async () => {
  const app = initApp()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  await connectMongoDb()
  const program = new Program()

  // TODO: 프로그램 에러시 소켓 통신 어떻게 해야하나
  io.on('connection', async (socket: SocketProps) => {
    const query = socket.handshake.query
    socket.userTickerId = query.userTickerId as string

    socket.on('init', async () => {
      await program.initVb(socket)
    })

    socket.on('start', async () => {
      await program.start(socket)
    })

    socket.on('stop', async () => {
      await program.stop(socket)
    })

    socket.on('current-price', async () => {
      await program.getCurrentPrice(socket)
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
