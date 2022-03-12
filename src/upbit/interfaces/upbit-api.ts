export interface IMarketAll {
  market: string
  korean_name: string
  english_name: string
}

export interface ICandle {
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

export interface ISnapShot {
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

export interface IOrderbook {
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

export interface IAccount {
  currency: string
  balance: string
  locked: string
  avg_buy_price: string
  avg_buy_price_modified: boolean
  unit_currency: string
}
