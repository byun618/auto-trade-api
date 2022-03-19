import mongoose from 'mongoose'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const connectMongoDb = async () => {
  await mongoose.connect('mongodb://localhost:27017/auto-trade')
  console.log('mongoDB connected')
}
