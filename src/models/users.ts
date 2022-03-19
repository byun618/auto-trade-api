import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  name: string

  createdAt: string
  updatedAt: string
}

const schema = new Schema<IUser>(
  {
    name: String,
    createdAt: String,
    updatedAt: String,
  },
  { timestamps: true },
)

export const User = model<IUser>('User', schema)
