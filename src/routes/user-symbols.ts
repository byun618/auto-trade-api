import { UserSymbol } from '@byun618/auto-trade-models'
import { NextFunction, Request, Response, Router } from 'express'
import { auth } from '../public/middlewares'

const url = '/user-symbols'
const router = Router()

router.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req

      const userSymbols = await UserSymbol.find({
        user: user._id,
      }).populate('symbol')

      res.json(userSymbols)
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/:_id',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params

      const userSymbol = await UserSymbol.findOne({
        _id,
      }).populate('symbol')

      res.json(userSymbol)
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
