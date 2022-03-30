import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import pino from 'express-pino-logger'
import helmet from 'helmet'
import routes from './routes'

export const initApp = () => {
  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(pino())

  for (const { url, router } of routes) {
    app.use(url, router)
  }

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    return res.json({
      error: {
        name: err.name,
        message: err.message,
      },
    })
  })

  return app
}
