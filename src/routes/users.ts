import { User } from '@byun618/auto-trade-models'
import { PBKDF2 } from 'crypto-js'
import { NextFunction, Request, Response, Router } from 'express'
import { auth } from '../public/middlewares'
import { makeJwtToken } from '../public/utils'

const url = '/users'
const router = Router()

router.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req

      res.json(user)
    } catch (err) {
      next(err)
    }
  },
)

// TODO: 로그인 개망이네?
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({
        email,
        password: PBKDF2(password, process.env.SALT, {
          keySize: 512 / 32,
        }).toString(),
      })

      if (!user) {
        throw new Error('User not Found')
      }

      res.json(makeJwtToken(user))
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
