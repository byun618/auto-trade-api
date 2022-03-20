import { NextFunction, Request, Response, Router } from 'express'
import { UserTicker } from '../models/user-tickers'
import { User } from '../models/users'

const url = '/user-tickers'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ name: '변상현' })

  const userTickers = await UserTicker.find({
    user: user._id,
  })

  res.json(userTickers)
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { name, start, elapse } = req.body

  const user = await User.findOne({ name: '변상현' })

  await UserTicker.create({ user: user._id, name, start, elapse })

  res.json({ message: 'OK' })
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  const userTicker = await UserTicker.findOne({
    _id: id,
  })

  res.json(userTicker)
})

export default { url, router }
