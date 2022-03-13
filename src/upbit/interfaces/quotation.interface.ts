import { Moment } from 'moment-timezone'

export interface ITickersProps {
  fiat?: string
}

export interface IOhlcvProps {
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

export interface IOhlcvRangeBaseProps {
  ticker: string
  to: string
  elapse: number
}

export interface IOhlcv {
  datetime: Moment
  open: number
  high: number
  low: number
  close: number
  volume: number
  value: number
}

export interface ICurrentPriceProps {
  ticker?: string
}

export interface IOrderbookProps {
  ticker?: string
}
