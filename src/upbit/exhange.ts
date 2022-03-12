import CustomAxios from './custom-axios'
import { IAccount } from './interfaces/upbit-api'

export default class Exchange extends CustomAxios {
  /**
   * ACCESS_KEY, SECRET_KEY 필요함
   * @param UBIT_ACCESS_KEY
   * @param UBIT_SECRET_KEY
   */
  constructor(UBIT_ACCESS_KEY: string, UBIT_SECRET_KEY: string) {
    super(UBIT_ACCESS_KEY, UBIT_SECRET_KEY)
  }

  /**
   * 전체 계좌 잔고 조회
   * @returns Promise<IAccount[]>
   */
  async getBalances(): Promise<IAccount[]> {
    const url = 'https://api.upbit.com/v1/accounts'

    const { data } = await super.getAuthData<IAccount[]>({
      method: 'GET',
      url,
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
