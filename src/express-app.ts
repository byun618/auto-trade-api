import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import pino from 'express-pino-logger'
import helmet from 'helmet'
import routes from './routes'
import createError, { HttpError } from 'http-errors'

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

  app.use(
    (
      err: Error | HttpError,
      req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      if (createError.isHttpError(err) && err.statusCode < 500) {
        console.log(err)

        res.status(err.statusCode).json({
          error: {
            type: err.name,
            message: err.message,
            description: err.description,
          },
        })
      } else {
        console.error(err)

        res.status(500).json({
          type: 'Server Error',
          message: err.message,
          description: '개발팀에 문의하여 주세요.',
        })
      }
    },
  )

  return app
}
