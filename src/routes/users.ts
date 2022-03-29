import { PBKDF2 } from 'crypto-js'
import { NextFunction, Request, Response, Router } from 'express'
import { User } from '../models/users'
import { makeJwtToken } from '../public/utils'

const url = '/users'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.headers.authorization)

    const users = await User.find()

    res.json(users)
  } catch (err) {
    next(err)
  }
})

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

      res.json({ token: makeJwtToken(user) })
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
