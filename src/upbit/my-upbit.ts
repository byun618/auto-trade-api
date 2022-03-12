import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import querystring from 'querystring'
import { v4 as uuidv4 } from 'uuid'
import Api from './public/api'
import { IBuyMarketOrder } from './interfaces/my-upbit.inerface'
import { IAccount, IOrderResult } from './interfaces/upbit-api.interface'

export default class MyUpbit extends Api {
  private readonly access: string
  private readonly secret: string

  /**
   *
   * @param access
   * @param secret
   */
  constructor(access: string, secret: string) {
    super()
    this.access = access
    this.secret = secret
  }

  getHeaders(data = null) {
    const payload = {
      access_key: this.access,
      nonce: uuidv4(),
    }

    if (data) {
      const query = querystring.encode(data) // 요청할 파라미터 세팅
      const hash = crypto.createHash('sha512')
      const queryHash = hash.update(query, 'utf-8').digest('hex')
      Object.assign(payload, {
        query_hash: queryHash,
        query_hash_alg: 'SHA512',
      })
    }

    const token = jwt.sign(payload, this.secret)
    return { Authorization: `Bearer ${token}` }
  }

  /**
   * 전체 계좌 잔고 조회
   * @returns Promise<IAccount[]>
   */
  async getBalances(): Promise<IAccount[]> {
    const url = 'https://api.upbit.com/v1/accounts'
    const headers = this.getHeaders()

    const { data } = await super.get<IAccount[]>(url, null, headers)

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

  /**
   * 특정 코인 시장가 매수
   * @param IBuyMarketOrder
   * @returns Promise<IOrderResult>
   */
  async buyMarketOrder({
    ticker,
    price,
  }: IBuyMarketOrder): Promise<IOrderResult> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'bid',
      price: String(price),
      ord_type: 'price',
    }
    const headers = this.getHeaders(data)

    const { data: result } = await super.post<IOrderResult>(url, data, headers)

    return result
  }
}
