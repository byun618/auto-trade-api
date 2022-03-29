import { NextFunction, Request, Response, Router } from 'express'
import { Quotation } from '../upbit'

const url = '/tickers'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotation = new Quotation()
    const tickers = await quotation.getTickers({ fiat: 'KRW' })

    res.json(tickers)
  } catch (err) {
    next(err)
  }
})

export default { url, router }
