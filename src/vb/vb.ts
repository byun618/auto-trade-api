import moment, { Moment } from 'moment-timezone'
import { SocketProps } from '../public/interfaces'
import { sleep } from '../public/utils'
import { Quotation, Upbit } from '../upbit'
import { ISettingsProps, IVbProps } from './interfaces'

export default class Vb {
  private socket: SocketProps
  private ticker: string
  private start: number
  private elapse: number
  private readonly quotation: Quotation
  private readonly upbit: Upbit
  private buyTime: Moment
  private sellTime: Moment
  private targetPrice: number
  private isStart: boolean
  private isHold: boolean
  private isSell: boolean

  /**
   * 프로그램 동작할 세팅으로 생성
   * @param IVbProps
   */
  constructor({ socket, access, secret, ticker, start, elapse }: IVbProps) {
    this.socket = socket
    this.quotation = new Quotation()
    this.upbit = new Upbit(access, secret)
    this.ticker = ticker
    this.start = start
    this.elapse = elapse
    this.isStart = false
  }

  /**
   * 세팅값 반환
   * @returns ISettingsProps
   */
  getSettings(): ISettingsProps {
    return {
      ticker: this.ticker,
      start: this.start,
      elapse: this.elapse,
    }
  }

  /**
   * 설정값을 세팅
   * @param ISettingsProps
   */
  setSettings({ ticker, start, elapse }: ISettingsProps): void {
    this.ticker = ticker
    this.start = start
    this.elapse = elapse
  }

  /**
   * 현재 프로그램 상태를 반환
   * @returns
   */
  getStatus() {
    return {
      isStart: this.isStart,
      isHold: this.isHold,
      isSell: this.isSell,
    }
  }

  /**
   * 소켓 연결을 업데이트
   * @param socket
   */
  setSocket(socket: SocketProps) {
    this.socket = socket
  }

  /**
   * 지정한 start와 elapse에 맞게 프로그램이 돌도록 시간 설정
   */
  setTargetTime(): { buyTime: string; sellTime: string } {
    if (!this.start || !this.elapse) {
      throw new Error('설정을 먼저 세팅해주세요')
    }

    const buyTime = moment().set({
      hour: this.start,
      minute: 5,
      second: 0,
      millisecond: 0,
    })

    // 프로그램 시작 시간 허용 한도
    if (moment().isAfter(buyTime.clone().add(1, 'hour'))) {
      // TODO: 아예 동작을 못하게
      buyTime.add(1, 'day')
    }

    const sellTime = buyTime
      .clone()
      .add(this.elapse, 'hour')
      .subtract(15, 'minute')

    this.buyTime = buyTime
    this.sellTime = sellTime

    return {
      buyTime: moment(this.buyTime).format('YYYY-MM-DD H시 m분'),
      sellTime: moment(this.sellTime).format('YYYY-MM-DD H시 m분'),
    }
  }

  /**
   * 설정값에 맞게 타겟 가격 설정
   */
  async setTargetPrice(): Promise<number> {
    if (!this.ticker || !this.start || !this.elapse) {
      throw new Error('설정을 먼저 세팅해주세요')
    }

    if (!this.buyTime || !this.sellTime) {
      throw new Error('시간을 먼저 세팅해주세요.')
    }

    const previousTime = this.buyTime
      .clone()
      .add({
        hour: this.elapse,
      })
      .subtract({
        day: 1,
        minute: 5,
      })

    const previousData = await this.quotation.getOhlcvRangeBase({
      ticker: this.ticker,
      to: previousTime.format('YYYY-MM-DD HH:mm:ss'),
      elapse: this.elapse,
    })

    // 반드시 start에서 한시간 이내에 실행해야 의도대로 동작함
    const [currentData] = await this.quotation.getOhlcv({
      ticker: this.ticker,
      interval: 'minute60',
      count: 1,
    })
    console.log(currentData)

    const { open, high, low, close } = previousData
    const range = high - low
    const noise = 1 - Math.abs(open - close) / range

    const targetPrice = range * noise + currentData.open

    this.targetPrice = targetPrice

    return this.targetPrice
  }

  async getCurrentPrice(): Promise<number> {
    const currentPrice = await this.quotation.getCurrentPrice({
      ticker: this.ticker,
    })

    return currentPrice
  }

  async run() {
    this.isStart = true

    if (!this.buyTime || !this.sellTime) {
      const { buyTime, sellTime } = await this.setTargetTime()

      this.socket.emit('set-target-time', {
        userTickerId: this.socket.userTickerId,
        message: '목표 매수 매도 시간이 설정되었습니다.',
        data: { buyTime, sellTime },
      })
    }

    while (this.isStart) {
      const now = moment()

      if (!this.isHold && now.isBetween(this.buyTime, this.sellTime)) {
        if (!this.targetPrice) {
          const targetPrice = await this.setTargetPrice()

          this.socket.emit('set-target-price', {
            userTickerId: this.socket.userTickerId,
            message: '목표가가 설정되었습니다.',
            data: { targetPrice },
          })
        }

        const currentPrice = await this.quotation.getCurrentPrice({
          ticker: this.ticker,
        })

        if (currentPrice >= this.targetPrice) {
          const { balance: cash } = await this.upbit.getBalance()
          const result = await this.upbit.buyMarketOrder({
            ticker: this.ticker,
            price: Number(cash) * 0.9995,
          })

          while (true) {
            const order = await this.upbit.getOrder(result.uuid)

            if (order && order.trades.length > 0) {
              const balance = await this.upbit.getBalance(this.ticker)

              if (balance) {
                // TODO: 메시지 전송 필요
                console.log(
                  `${this.ticker}(${balance.balance}) 매수 주문 처리 완료`,
                )
                break
              }
            } else {
              // TODO: 메시지 전송 필요
              console.log(`${this.ticker} 매수 주문 처리 대기중...`)
              await sleep(500)
            }
          }

          this.isHold = true
          this.isSell = false

          this.socket.emit('buy-market-order', {
            userTickerId: this.socket.userTickerId,
            message: '목표가에 도달해 시장가로 매수하였습니다.',
            data: { isHold: this.isHold, isSell: this.isSell },
          })
        }
      }

      if (this.isHold && !this.isSell && now.isAfter(this.sellTime)) {
        const { balance: volume } = await this.upbit.getBalance(this.ticker)

        const result = await this.upbit.sellMarketOrder({
          ticker: this.ticker,
          volume: Number(volume),
        })

        while (true) {
          const order = await this.upbit.getOrder(result.uuid)

          if (order && order.trades.length > 0) {
            const balance = await this.upbit.getBalance()

            if (balance) {
              // TODO: 메시지 전송 필요
              console.log(
                `${this.ticker}(${balance.balance}) 매도 주문 처리 완료`,
              )
              break
            } else {
              // TODO: 메시지 전송 필요
              console.log(`${this.ticker} 매수 주문 처리 대기중...`)
              await sleep(500)
            }
          }
        }

        this.isHold = false
        this.isSell = true

        this.socket.emit('buy-market-order', {
          userTickerId: this.socket.userTickerId,
          message: '목표가에 도달해 시장가로 매도하였습니다.',
          data: { isHold: this.isHold, isSell: this.isSell },
        })
      }

      // TODO: 중단 이후의 삶을 그려보자

      await sleep(1000)
    }
  }

  stop() {
    this.isStart = false
  }
}
