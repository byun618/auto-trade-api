import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { IUser } from '../models/users'

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
