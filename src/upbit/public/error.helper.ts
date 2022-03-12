import createError from 'http-errors'

export class UpbitError extends createError.BadRequest {
  name: string

  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}
