import createError from 'http-errors'

export class Forbidden extends createError.Forbidden {
  name: string
  description: string

  constructor(
    message: string = 'forbidden',
    description: string = '로그인을 진행해주세요.',
  ) {
    super(message)
    this.name = 'Forbidden'
    this.description = description
  }
}
