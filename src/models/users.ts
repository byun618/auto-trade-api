import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string

  createdAt: string
  updatedAt: string
}

const schema = new Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
    createdAt: String,
    updatedAt: String,
  },
  { timestamps: true },
)

export const User = model<IUser>('User', schema)
