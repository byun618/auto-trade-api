export interface IBalancesProps {
  ticker?: string
}

export interface ILimitOrder {
  ticker: string
  price: number
  volume: number
}

export interface IMarketOrder {
  ticker: string
  price?: number
  volume?: number
}
