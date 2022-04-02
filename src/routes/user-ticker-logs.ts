import { NextFunction, Request, Response, Router } from 'express'
// import { UserTickerLog } from '../models/user-ticker-logs'
import { UserTickerLog } from '@byun618/auto-trade-models'

const url = '/user-ticker-logs'
const router = Router()

router.get(
  '/:userTickerId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userTickerId } = req.params

      const userTickerLogs = await UserTickerLog.find(
        {
          userTicker: userTickerId,
        },
        {
          message: 1,
          createdAt: 1,
        },
      )

      res.json(userTickerLogs)
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
