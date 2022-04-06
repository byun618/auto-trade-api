import { NextFunction, Request, Response, Router } from 'express'
import { Quotation, MarketAll } from '@byun618/upbit-node'

const url = '/tickers'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotation = new Quotation()
    const tickers = (await quotation.getTickers('KRW')) as string[]

    res.json(tickers)
  } catch (err) {
    next(err)
  }
})

router.get(
  '/verbose',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quotation = new Quotation()
      const tickers = (await quotation.getTickers('KRW', true)) as MarketAll[]

      res.json(tickers)
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
