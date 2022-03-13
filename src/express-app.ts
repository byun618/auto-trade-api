import express from 'express'
import cors from 'cors'

export const initApp = () => {
  const app = express()

  app.use(cors())

  return app
}
