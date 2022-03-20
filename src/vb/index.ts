import { UserTicker } from '../models/user-tickers'
import Vb from './vb'

const programList: any = {}

export const initVb = async (userTickerId: string): Promise<Vb> => {
  if (programList[userTickerId]) {
    return programList[userTickerId]
  }

  const userTicker = await UserTicker.findOne({
    id: userTickerId,
  })

  const vb = new Vb({
    ticker: userTicker.name,
    start: userTicker.start,
    elapse: userTicker.elapse,
    access: process.env.UPBIT_ACCESS_KEY,
    secret: process.env.UPBIT_SECRET_KEY,
  })

  vb.setTargetTime()
  await vb.setTargetPrice()

  programList[userTickerId] = vb
  return vb
}

export const updateUserTicker = async ({
  userTickerId,
  buyTime,
  sellTime,
  targetPrice,
}: {
  userTickerId: string
  buyTime: string
  sellTime: string
  targetPrice: number
}) => {
  const userTicker = await UserTicker.findOne({
    id: userTickerId,
  })

  userTicker.buyTime = buyTime
  userTicker.sellTime = sellTime
  userTicker.targetPrice = targetPrice
  await userTicker.save()
}

export const run = async () => {}
