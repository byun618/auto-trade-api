import { NextFunction, Request, Response, Router } from 'express'
import { Quotation } from '../upbit'

const url = '/tickers'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const quotation = new Quotation()
  const tickers = await quotation.getTickers({ fiat: 'KRW' })

  res.json(tickers)
})

export default { url, router }
