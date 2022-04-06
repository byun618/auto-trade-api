import { UserProgram } from '@byun618/auto-trade-models'
import { NextFunction, Request, Response, Router } from 'express'
import { extractJwtToken, okJson } from '../public/utils'

const url = '/user-programs'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = extractJwtToken(req)

    const userPrograms = await UserProgram.find({
      user: userId,
    })

    res.json(userPrograms)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = extractJwtToken(req)
    const { ticker, startTime, timeInterval } = req.body

    console.log(ticker)

    await UserProgram.create({
      user: userId,
      ticker,
      startTime,
      timeInterval,
    })

    res.json(okJson)
  } catch (err) {
    next(err)
  }
})

router.get(
  '/:userProgramId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userProgramId } = req.params

      const userProgram = await UserProgram.findOne({
        _id: userProgramId,
      })

      if (!userProgram) {
        throw new Error('not found')
      }

      res.json(userProgram)
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
