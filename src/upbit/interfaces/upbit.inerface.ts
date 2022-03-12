export interface IBalancesProps {
  ticker?: string
}

export interface IBuyLimitOrder {
  ticker: string
  price: number
  volume: number
}

export interface IBuyMarketOrder {
  ticker: string
  price: number
}
