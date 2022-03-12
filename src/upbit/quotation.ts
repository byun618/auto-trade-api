import CustomAxios from './custom-axios'
import moment from 'moment-timezone'

interface IMarketAll {
  market: string
  korean_name: string
  english_name: string
}

interface ITickersProps {
  fiat?: string
}

interface IOhlcvProps {
  ticker?: string
  interval?:
    | 'day'
    | 'days'
    | 'minute1'
    | 'minutes1'
    | 'minute3'
    | 'minutes3'
    | 'minute5'
    | 'minutes5'
    | 'minute15'
    | 'minutes15'
    | 'minute30'
    | 'minutes30'
    | 'minute60'
    | 'minutes60'
    | 'minute240'
    | 'minutes240'
    | 'week'
    | 'weeks'
    | 'month'
    | 'months'
  count?: number
  to?: string
}

interface ICandle {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_price: number
  candle_acc_trade_volume: number
  prev_closing_price: number
  change_price: number
  change_rate: number
}

interface IOhlcv {
  data: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  value: number
}

interface ICurrentPriceProps {
  ticker?: string
}

interface ISnapShot {
  market: string
  trade_date: string
  trade_time: string
  trade_date_kst: string
  trade_time_kst: string
  trade_timestamp: number
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: string
  change_price: number
  change_rate: number
  signed_change_price: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_price: number
  acc_trade_price_24h: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  timestamp: number
}

interface IOrderbookProps {
  ticker?: string
}

interface IOrderbook {
  market: string
  timestamp: number
  total_ask_size: number
  total_bid_size: number
  orderbook_units: {
    ask_price: number
    bid_price: number
    ask_size: number
    bid_size: number
  }
}

export default class Quotation extends CustomAxios {
  constructor() {
    super()
  }

  /**
   * @desc 업비트 TICKER 코드 조회 (ACCESS_KEY, SECRET_KEY 필요없음)
   * @param ITickersProps
   * @returns Promise<string[]>
   */
  async getTickers({ fiat = null }: ITickersProps): Promise<string[]> {
    const { data } = await super.getData<IMarketAll[]>({
      method: 'GET',
      url: 'https://api.upbit.com/v1/market/all',
    })

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
   * @desc 업비트 캔들 조회를 위한 URL 조회 (ACCESS_KEY, SECRET_KEY 필요없음)
   * @param interval: string
   * @returns string
   */
  getUrlOhlcv(interval: string) {
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
   * @desc 업비트 캔들 조회 (ACCESS_KEY, SECRET_KEY 필요없음)
   * @param IOhlcvProps
   * @returns Promise<IOhlcv[]>
   */
  async getOhlcv({
    ticker = 'KRW-BTC',
    interval = 'day',
    count = 200,
    to = null, // to 포맷 정형화 필요
  }: IOhlcvProps): Promise<IOhlcv[]> {
    try {
      const MAX_CALL_COUNT = 200
      if (count > MAX_CALL_COUNT) {
        throw new Error('count must be less than 200')
      }

      const url = this.getUrlOhlcv(interval)
      if (!url) {
        throw new Error('invalid interval')
      }

      const _to = moment(to).utc().format('YYYY-MM-DD HH:mm:ss')

      const { data } = await super.getData<ICandle[]>({
        method: 'GET',
        url: `${url}?market=${ticker}&count=${count}${to ? `&to=${_to}` : ''}`,
      })

      const out = []
      for (const item of data) {
        out.push({
          date: item.candle_date_time_kst,
          open: item.opening_price,
          high: item.high_price,
          low: item.low_price,
          close: item.trade_price,
          volume: item.candle_acc_trade_volume,
          value: item.candle_acc_trade_price,
        })
      }

      return out.reverse()
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * @desc 업비트 특정 TICKER 현재가 조회 (ACCESS_KEY, SECRET_KEY 필요없음)
   * @param ICurrentPriceProps
   * @returns Promise<number>
   */
  async getCurrentPrice({
    ticker = 'KRW-BTC',
  }: ICurrentPriceProps): Promise<number> {
    try {
      const url = 'https://api.upbit.com/v1/ticker'
      const { data } = await super.getData<ISnapShot[]>({
        method: 'GET',
        url: `${url}?markets=${ticker}`,
      })

      return data[0].trade_price
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * @desc 업비트 특정 TICKER 호가 조회 (ACCESS_KEY, SECRET_KEY 필요없음)
   * @param IOrderbookProps
   * @returns Promise<IOrderbook>
   */
  async getOrderbook({ ticker = 'KRW-BTC' }: IOrderbookProps) {
    try {
      const url = 'https://api.upbit.com/v1/orderbook'

      const { data } = await super.getData<IOrderbook[]>({
        method: 'GET',
        url: `${url}?markets=${ticker}`,
      })

      return data[0]
    } catch (err) {
      console.error(err)
    }
  }
}
