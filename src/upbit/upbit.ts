import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import querystring from 'querystring'
import { v4 as uuidv4 } from 'uuid'
import { IAccount, IOrderResult } from './interfaces/upbit-api.interface'
import { ILimitOrder, IMarketOrder } from './interfaces/upbit.inerface'
import Api from './api'

export default class Upbit extends Api {
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
    const balance = balances.find(
      ({ currency }) => currency === ticker.split('-')[1],
    )

    if (!balance) {
      throw new Error('보유한 코인이 아닙니다.')
    }

    return balance
  }

  /**
   * 지정가 매수
   * @param ILimitOrder
   * @returns Promise<IOrderResult>
   */
  async buyLimitOrder({
    ticker,
    price,
    volume,
  }: ILimitOrder): Promise<IOrderResult> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'bid',
      volume: String(volume),
      price: String(price),
      ord_type: 'limit',
    }
    const headers = this.getHeaders(data)

    const { data: result } = await super.post<IOrderResult>(url, data, headers)

    return result
  }

  /**
   * 시장가 매수
   * @param IMarketOrder
   * @returns Promise<IOrderResult>
   */
  async buyMarketOrder({ ticker, price }: IMarketOrder): Promise<IOrderResult> {
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

  /**
   * 지정가 매도
   * @param ILimitOrder
   * @returns Promise<IOrderResult>
   */
  async sellLimitOrder({
    ticker,
    price,
    volume,
  }: ILimitOrder): Promise<IOrderResult> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'ask',
      volume: String(volume),
      price: String(price),
      ord_type: 'limit',
    }

    const headers = this.getHeaders(data)

    const { data: result } = await super.post<IOrderResult>(url, data, headers)

    return result
  }

  /**
   * 시장가 매도
   * @param IMarketOrder
   * @returns Promise<IOrderResult>
   */
  async sellMarketOrder({
    ticker,
    volume,
  }: IMarketOrder): Promise<IOrderResult> {
    const url = 'https://api.upbit.com/v1/orders'
    const data = {
      market: ticker,
      side: 'ask',
      volume: String(volume),
      ord_type: 'market',
    }
    const headers = this.getHeaders(data)

    const { data: result } = await super.post<IOrderResult>(url, data, headers)

    return result
  }
}
