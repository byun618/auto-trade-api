import {
  UserProgramLog,
  UserProgramLogInterface,
} from '@byun618/auto-trade-models'
import { NextFunction, Request, Response, Router } from 'express'
import _ from 'lodash'
import moment from 'moment-timezone'
import { okJson } from '../public/utils'

const url = '/user-program-logs'
const router = Router()

router.get(
  '/:userProgramId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userProgramId } = req.params
      const userProgramLogs = await UserProgramLog.find({
        userProgram: userProgramId,
      }).populate('userProgram')

      const groups: {
        [key: string]: UserProgramLogInterface[]
      } = _.groupBy(userProgramLogs.reverse(), (userProgramLog) => {
        return moment(userProgramLog.createdAt)
          .startOf('day')
          .format('YYYY-MM-DD')
      })

      const out = []

      for (const [date, logs] of Object.entries(groups)) {
        out.push({
          date,
          logs: logs.map((log) => {
            return {
              message: log.message,
              createdAt: moment(log.createdAt).format('HH:mm:ss'),
            }
          }),
        })
      }

      res.json(out)
    } catch (err) {
      next(err)
    }
  },
)

router.delete(
  '/:userProgramId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userProgramId } = req.params

      await UserProgramLog.deleteMany({
        userProgram: userProgramId,
      })

      res.json(okJson)
    } catch (err) {
      next(err)
    }
  },
)

export default { url, router }
