import { UserProgram } from '@byun618/auto-trade-models'
import { NextFunction, Request, Response, Router } from 'express'
import { auth } from '../public/middlewares'
import { okJson } from '../public/utils'

const url = '/user-programs'
const router = Router()

router.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req

      const userPrograms = await UserProgram.find({
        user: user._id,
      }).populate('user')

      res.json(userPrograms)
    } catch (err) {
      next(err)
    }
  },
)

router.post(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req
      const { ticker, startTime, timeInterval } = req.body

      const userPrograms = await UserProgram.find({
        user: user._id,
      })

      await UserProgram.create({
        user: user._id,
        no: userPrograms.length + 1,
        ticker,
        startTime,
        timeInterval,
      })

      res.json(okJson)
    } catch (err) {
      next(err)
    }
  },
)

router.get(
  '/:userProgramId',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req
      const { userProgramId } = req.params

      const userProgram = await UserProgram.findOne({
        _id: userProgramId,
        user: user._id,
      }).populate('user')

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
