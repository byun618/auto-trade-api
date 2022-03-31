import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { IUser } from '../models/users'
import { SocketProps } from './interfaces'
import { UserTickerLog } from '../models/user-ticker-logs'

interface LogSocketMessagePayload {
  socket: SocketProps
  message: string
}

interface LogSocketErrorPayload {
  err: Error
  socket: SocketProps
  description?: string
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const connectMongoDb = async () => {
  if ((process.env.VERSION as string) !== 'DEV') {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/auto-trade`,
    )
  } else {
    await mongoose.connect('mongodb://localhost:27017/auto-trade')
  }
  console.log('mongoDB connected')
}

export const makeJwtToken = (user: IUser) => {
  return jwt.sign({ userId: user.id }, process.env.AUTH_SALT, {
    expiresIn: '730 days',
  })
}

export const extractJwtToken = (
  req: any,
): {
  userId: string
} => {
  const auth = req.headers.authorization
  if (!auth) {
    throw new Error('No Auth Header')
  }

  const token = auth.split(' ')[1]
  const decoded = jwt.verify(token, process.env.AUTH_SALT as string)

  return decoded as { userId: string }
}

export const logSocketMessage = async ({
  socket,
  message,
}: LogSocketMessagePayload) => {
  await UserTickerLog.create({
    userTicker: socket.userTickerId,
    message,
  })
  socket.emit('message', { message })
}

export const logScoketError = async ({
  err,
  socket,
  description,
}: LogSocketErrorPayload) => {
  console.error(err)
  await UserTickerLog.create({
    userTicker: socket.userTickerId,
    message: err.message,
    description,
  })
  socket.emit('error', { message: err.message, description })
}
