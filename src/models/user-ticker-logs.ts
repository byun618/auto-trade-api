import { Document, Schema, PopulatedDoc, model } from 'mongoose'
import { IUserTicker } from './user-tickers'

export interface IUserTickerLog extends Document {
  userTicker: PopulatedDoc<IUserTicker>
  message: string
  description: string

  createdAt: string
  updatedAt: string
}

const schema = new Schema<IUserTickerLog>(
  {
    userTicker: { type: Schema.Types.ObjectId, ref: 'UserTicker' },
    message: String,
    description: String,

    createdAt: String,
    updatedAt: String,
  },
  { timestamps: true },
)

export const UserTickerLog = model<IUserTickerLog>('UserTickerLog', schema)
