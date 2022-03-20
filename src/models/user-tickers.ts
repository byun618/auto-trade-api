import { Document, Schema, PopulatedDoc, model } from 'mongoose'
import { IUser } from './users'

export interface IUserTicker extends Document {
  user: PopulatedDoc<IUser>
  name: string
  start: number
  elapse: number
  buyTime: string
  sellTime: string
  targetPrice: number

  createdAt: string
  updatedAt: string
}

const schema = new Schema<IUserTicker>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    start: Number,
    elapse: Number,
    buyTime: String,
    sellTime: String,
    targetPrice: Number,
    createdAt: String,
    updatedAt: String,
  },
  { timestamps: true },
)

export const UserTicker = model<IUserTicker>('UserTicker', schema)
