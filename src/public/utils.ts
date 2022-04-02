import jwt from 'jsonwebtoken'
import { IUser } from '@byun618/auto-trade-models'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

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
