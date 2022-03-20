import { Socket } from 'socket.io'
import { UserTicker } from '../models/user-tickers'
import Vb from './vb'

const programList: {
  [key: string]: Vb
} = {}

export const initVb = async (userTickerId: string, socket: Socket) => {
  let vb = programList[userTickerId]

  // if (vb) {
  //   const status = vb.getStatus()
  //   if (status.isStart) {
  //     socket.emit('init-res', { message: '이미 프로그램이 동작 중 입니다.' })
  //     return
  //   }

  //   socket.emit('init-res', { message: '이미 프로그램이 초기화되었습니다.' })
  //   return
  // }

  const userTicker = await UserTicker.findOne({
    id: userTickerId,
  })

  vb = new Vb({
    ticker: userTicker.name,
    start: userTicker.start,
    elapse: userTicker.elapse,
    access: process.env.UPBIT_ACCESS_KEY,
    secret: process.env.UPBIT_SECRET_KEY,
  })

  vb.setTargetTime()
  await vb.setTargetPrice()

  programList[userTickerId] = vb

  const target = vb.getTarget()

  socket.emit('init-res', {
    userTickerId,
    message: '프로그램을 초기화합니다.',
    data: target,
  })
}

export const updateUserTicker = async ({
  userTickerId,
  buyTime,
  sellTime,
  targetPrice,
  isStart,
  isHold,
  isSell,
}: {
  userTickerId: string | string[] | undefined
  buyTime?: string
  sellTime?: string
  targetPrice?: number
  isStart?: boolean
  isHold?: boolean
  isSell?: boolean
}) => {
  const updateObj = {}

  if (buyTime) {
    Object.assign(updateObj, { buyTime })
  }
  if (sellTime) {
    Object.assign(updateObj, { sellTime })
  }
  if (targetPrice) {
    Object.assign(updateObj, { targetPrice })
  }
  if (isStart) {
    Object.assign(updateObj, { isStart })
  }
  if (isHold) {
    Object.assign(updateObj, { isHold })
  }
  if (isSell) {
    Object.assign(updateObj, { isSell })
  }

  await UserTicker.updateOne(
    {
      id: userTickerId,
    },
    updateObj,
  )
}

export const start = async (userTickerId: string) => {
  const vb = programList[userTickerId]
  vb.run()
}

export const stop = async (userTickerId: string) => {
  const vb = programList[userTickerId]
  vb.stop()

  delete programList[userTickerId]
}
