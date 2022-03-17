import express from 'express'
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

  return app
}
