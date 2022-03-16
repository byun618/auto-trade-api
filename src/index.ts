import http from 'http'
import { Server } from 'socket.io'
import { initApp } from './express-app'
import { SocketProps } from './public/interfaces'
// import Vb from './vb/vb'

const PORT = process.env.APP_PORT || 3001

const app = initApp()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})
// const tickerList = {}

io.on('connection', async (socket: SocketProps) => {
  // TODO: 소켓 연결시 처리
  const query = socket.handshake.query
  socket.identifier = query.identifier

  console.log(`${socket.id}|${socket.identifier} connected`)

  // socket.on('init', (data) => {
  //   const { ticker, start, elapse } = data

  //   tickerList[`${ticker}-${start}-${elapse}`] = new Vb({
  //     ticker,
  //     start,
  //     elapse,
  //     access: process.env.UPBIT_ACCESS_KEY,
  //     secret: process.env.UPBIT_SECRET_KEY,
  //   })
  // })

  socket.on('disconnect', () => {
    console.log(`${socket.id}|${socket.identifier}: disconnected`)
  })
})

server.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버가 시작되었습니다! 🚀  🚀`)
})
