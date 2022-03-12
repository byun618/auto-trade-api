import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import Api from './api'
import { IGetMarketOrder } from './interfaces/my-upbit.inerface'
import { IAccount } from './interfaces/upbit-api.interface'

export default class MyUpbit extends Api {
  private readonly access: string
  private readonly secret: string
  private readonly authorization: string

  /**
   *
   * @param access
   * @param secret
   */
  constructor(access: string, secret: string) {
    super()
    this.access = access
    this.secret = secret

    const token = jwt.sign(
      {
        access_key: this.access,
        nonce: uuidv4(),
      },
      this.secret,
    )
    this.authorization = `Bearer ${token}`
  }

  /**
   * 전체 계좌 잔고 조회
   * @returns Promise<IAccount[]>
   */
  async getBalances(): Promise<IAccount[]> {
    const url = 'https://api.upbit.com/v1/accounts'

    const { data } = await super.get<IAccount[]>(url, null, {
      Authorization: this.authorization,
    })

    return data
  }

  /**
   * 특정 코인/원화의 잔고 조회
   * @param ticker: string
   * @returns Promise<IAccount[]>
   */
  async getBalance(ticker: string = 'KRW'): Promise<IAccount> {
    const balances = await this.getBalances()
    const balance = balances.find(({ currency }) => currency === ticker)

    if (!balance) {
      throw new Error('보유한 코인이 아닙니다.')
    }

    return balance
  }
}
