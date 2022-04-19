import { UserInterface } from '@byun618/auto-trade-models'
import { Request } from 'express'

declare module 'express' {
  interface Request extends Request {
    user?: UserInterface
  }
}
