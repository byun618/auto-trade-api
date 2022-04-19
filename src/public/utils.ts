import { UserInterface } from '@byun618/auto-trade-models'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

export const okJson = { message: 'OK' }

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const makeJwtToken = (user: UserInterface) => {
  return jwt.sign({ userId: user.id }, process.env.AUTH_SALT, {
    expiresIn: '730 days',
  })
}
