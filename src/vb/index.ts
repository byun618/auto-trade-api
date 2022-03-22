import { Socket } from 'socket.io'
import { UserTicker } from '../models/user-tickers'
import Vb from './vb'

const programList: {
  [key: string]: Vb
} = {}

export const initVb = async (userTickerId: string, socket: Socket) => {
  let vb = programList[userTickerId]

  if (vb) {
    const { isStart } = vb.getStatus()

    if (isStart) {
      socket.emit('init-res', { message: '이미 프로그램이 동작중입니다.' })
      vb.setSocket(socket)

      return
    }

    socket.emit('init-res', { message: '이미 프로그램이 초기화되었습니다.' })
    return
  }

  const userTicker = await UserTicker.findOne({
    id: userTickerId,
  })

  vb = new Vb({
    socket,
    ticker: userTicker.name,
    start: userTicker.start,
    elapse: userTicker.elapse,
    access: process.env.UPBIT_ACCESS_KEY,
    secret: process.env.UPBIT_SECRET_KEY,
  })

  programList[userTickerId] = vb
  // TODO: DB에 저장되어 있는 상태 그대로 이식 필요

  socket.emit('init-res', {
    userTickerId,
    message: '프로그램을 초기화합니다.',
  })
}

export const start = async (userTickerId: string, socket: Socket) => {
  const vb = programList[userTickerId]
  const { isStart } = vb.getStatus()

  if (isStart) {
    socket.emit('start-res', { message: '프로그램이 이미 시작되었습니다.' })
    return
  }

  socket.emit('start-res', { message: '프로그램을 시작합니다.' })

  vb.run()
}

export const stop = async (userTickerId: string, socket: Socket) => {
  const vb = programList[userTickerId]
  const { isStart } = vb.getStatus()

  if (!isStart) {
    socket.emit('start-res', { message: '프로그램이 이미 정지되었습니다.' })
    return
  }

  socket.emit('start-res', { message: '프로그램을 정지합니다.' })

  vb.stop()
  delete programList[userTickerId]
}

export const getCurrentPrice = async (userTickerId: string, socket: Socket) => {
  const vb = programList[userTickerId]
  const currentPrice = await vb.getCurrentPrice()

  socket.emit('current-price-res', { currentPrice })
}