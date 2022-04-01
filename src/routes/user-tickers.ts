import { NextFunction, Request, Response, Router } from 'express'
import { UserTicker } from '../models/user-tickers'
import { User } from '../models/users'
import { extractJwtToken } from '../public/utils'

const url = '/user-tickers'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = extractJwtToken(req)

    const userTickers = await UserTicker.find({
      user: userId,
    })

    res.json(userTickers)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = extractJwtToken(req)
    const { name, start, elapse } = req.body

    await UserTicker.create({
      user: userId,
      name,
      start,
      elapse,
    })

    res.json({ message: 'OK' })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const userTicker = await UserTicker.findOne({
      _id: id,
    })

    res.json(userTicker)
  } catch (err) {
    next(err)
  }
})

export default { url, router }
