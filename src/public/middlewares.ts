import { User } from '@byun618/auto-trade-models'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Forbidden } from './error.helper'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization

    if (!auth || typeof auth !== 'string') {
      throw new Forbidden('no token', '토큰이 없습니다.')
    }

    const token = auth.split(' ')[1]

    if (!token) {
      throw new Forbidden('no token', '토큰이 없습니다.')
    }

    const { userId } = jwt.verify(token, process.env.AUTH_SALT as string) as {
      userId: string
    }

    const user = await User.findOne({
      id: userId,
    })

    req.user = user

    next()
  } catch (err) {
    next(err)
  }
}
