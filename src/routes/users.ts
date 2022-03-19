import { NextFunction, Request, Response, Router } from 'express'
import { User } from '../models/users'

const url = '/users'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find()

  res.json(users)
})

export default { url, router }
