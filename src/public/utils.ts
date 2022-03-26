import mongoose from 'mongoose'

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
