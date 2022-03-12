import moment from 'moment-timezone'
import Api from './api'
import {
  ICurrentPriceProps,
  IOhlcv,
  IOhlcvProps,
  IOhlcvRangeBaseProps,
  IOrderbookProps,
  ITickersProps,
} from './interfaces/quotation.interface'
import {
  ICandle,
  IMarketAll,
  IOrderbook,
  ISnapShot,
} from './interfaces/upbit-api.interface'

export default class Quotation extends Api {
  /**
   * ACCESS_KEY, SECRET_KEY 필요없음
   */
  constructor() {
    super()
  }

  /**
   * 업비트 TICKER 코드 조회
   * @param ITickersProps
   * @returns Promise<string[]>
   */
  async getTickers({ fiat = null }: ITickersProps): Promise<string[]> {
    const url = 'https://api.upbit.com/v1/market/all'
    const { data } = await super.get<IMarketAll[]>(url)

    const out = []
    for (const item of data) {
      const _fiat = item.market.split('-')[0]

      if (!fiat || fiat === _fiat) {
        out.push(item.market)
      }
    }

    return out
  }

  /**
   * 업비트 캔들 조회를 위한 URL 조회
   * @param interval: string
   * @returns string
   */
  private getUrlOhlcv(interval: string) {
    if (['day', 'days'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/days'
    } else if (['minute1', 'minutes1'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/1'
    } else if (['minute3', 'minutes3'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/3'
    } else if (['minute5', 'minutes5'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/5'
    } else if (['minute10', 'minutes10'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/10'
    } else if (['minute15', 'minutes15'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/15'
    } else if (['minute30', 'minutes30'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/30'
    } else if (['minute60', 'minutes60'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/60'
    } else if (['minute240', 'minutes240'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/minutes/240'
    } else if (['week', 'weeks'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/weeks'
    } else if (['month', 'months'].includes(interval)) {
      return 'https://api.upbit.com/v1/candles/months'
    }
  }

  /**
   * 업비트 캔들 조회
   * @param IOhlcvProps
   * @returns Promise<IOhlcv[]>
   */
  async getOhlcv({
    ticker = 'KRW-BTC',
    interval = 'day',
    count = 200,
    to = null, // to 포맷 정형화 필요
  }: IOhlcvProps): Promise<IOhlcv[]> {
    const MAX_CALL_COUNT = 200
    if (count > MAX_CALL_COUNT) {
      throw new Error('200을 넘게 조회할 수 없습니다.')
    }

    const url = this.getUrlOhlcv(interval)
    if (!url) {
      throw new Error('잘못된 시간 간격 입니다.')
    }

    const _to = moment(to).utc().format('YYYY-MM-DD HH:mm:ss')

    const { data } = await super.get<ICandle[]>(
      `${url}?market=${ticker}&count=${count}${to ? `&to=${_to}` : ''}`,
    )

    const out = []
    for (const item of data) {
      const datetime = moment(item.candle_date_time_kst)

      out.push({
        datetime,
        open: item.opening_price,
        high: item.high_price,
        low: item.low_price,
        close: item.trade_price,
        volume: item.candle_acc_trade_volume,
        value: item.candle_acc_trade_price,
      })
    }

    return out.reverse()
  }

  async getOhlcvRangeBase({
    ticker,
    start,
    elapse,
  }: IOhlcvRangeBaseProps): Promise<IOhlcv> {
    const date = moment()
      .set({
        hour: start,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .subtract(1, 'day')

    const result = await this.getOhlcv({
      ticker,
      interval: 'minute60',
      to: date.add(elapse, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      count: elapse,
    })

    if (result.length <= 0) {
      throw new Error('잘못된 범위 입니다.')
    }

    return {
      datetime: result[0].datetime,
      open: result[0].open,
      high: Math.max(...result.map(({ high }) => high)),
      low: Math.min(...result.map(({ low }) => low)),
      close: result[result.length - 1].close,
      volume: result.reduce((acc, { volume }) => acc + volume, 0),
      value: result.reduce((acc, { value }) => acc + value, 0),
    }
  }

  /**
   * 업비트 특정 TICKER 현재가 조회
   * @param ICurrentPriceProps
   * @returns Promise<number>
   */
  async getCurrentPrice({
    ticker = 'KRW-BTC',
  }: ICurrentPriceProps): Promise<number> {
    const url = 'https://api.upbit.com/v1/ticker'
    const { data } = await super.get<ISnapShot[]>(`${url}?markets=${ticker}`)

    return data[0].trade_price
  }

  /**
   * 업비트 특정 TICKER 호가 조회
   * @param IOrderbookProps
   * @returns Promise<IOrderbook>
   */
  async getOrderbook({
    ticker = 'KRW-BTC',
  }: IOrderbookProps): Promise<IOrderbook> {
    const url = 'https://api.upbit.com/v1/orderbook'

    const { data } = await super.get<IOrderbook[]>(`${url}?markets=${ticker}`)

    return data[0]
  }
}
