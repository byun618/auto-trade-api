import { NextFunction, Request, Response, Router } from 'express'
import { User } from '../models/users'
import crpyto, { PBKDF2 } from 'crypto-js'

const url = '/users'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find()

  res.json(users)
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

      res.json(user)
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
