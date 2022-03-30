import { PBKDF2 } from 'crypto-js'
import { NextFunction, Request, Response, Router } from 'express'
import { User } from '../models/users'
import { extractJwtToken, makeJwtToken } from '../public/utils'

const url = '/users'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = extractJwtToken(req)
    const user = await User.findOne(
      {
        _id: userId,
      },
      { name: 1, email: 1 },
    )

    res.json(user)
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
