import { Document, Schema, PopulatedDoc, model } from 'mongoose'
import { IUser } from './users'

export interface IUserTicker extends Document {
  user: PopulatedDoc<IUser>
  name: string
  start: number
  elapse: number

  createdAt: string
  updatedAt: string
}

const schema = new Schema<IUserTicker>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    start: Number,
    elapse: Number,
    createdAt: String,
    updatedAt: String,
  },
  { timestamps: true },
)

export const UserTicker = model<IUserTicker>('UserTicker', schema)
