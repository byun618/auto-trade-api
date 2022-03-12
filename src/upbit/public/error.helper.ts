import createError from 'http-errors'
import { IUpbitError } from '../interfaces/upbit-api.interface'

export class UpbitError extends createError.BadRequest {
  name: string

  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}
