import moment, { Moment } from 'moment-timezone'
import { Socket } from 'socket.io'
import { sleep } from '../public/utils'
import { Quotation, Upbit } from '../upbit'
import { IGettarget, ISettingsProps, IVbProps } from './interfaces'

export default class Vb {
  private socket: Socket
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
   * 타겟 매수 매도 시간, 가격을 반환
   * @returns IGettarget
   */
  getTarget(): IGettarget {
    return {
      buyTime: this.buyTime.format('YYYY-MM-DD H시 m분'),
      sellTime: this.sellTime.format('YYYY-MM-DD H시 m분'),
      targetPrice: this.targetPrice,
    }
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
  setSocket(socket: Socket) {
    this.socket = socket
  }

  /**
   * 지정한 start와 elapse에 맞게 프로그램이 돌도록 시간 설정
   */
  setTargetTime(): void {
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
      buyTime.add(1, 'day')
    }

    const sellTime = buyTime
      .clone()
      .add(this.elapse, 'hour')
      .subtract(15, 'minute')

    this.buyTime = buyTime
    this.sellTime = sellTime
  }

  /**
   * 설정값에 맞게 타겟 가격 설정
   */
  async setTargetPrice(): Promise<void> {
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

    const [currentData] = await this.quotation.getOhlcv({
      ticker: this.ticker,
      interval: 'minute60',
      count: 1,
    })

    const { open, high, low, close } = previousData
    const range = high - low
    const noise = 1 - Math.abs(open - close) / range

    const targetPrice = range * noise + currentData.open

    this.targetPrice = targetPrice
  }

  async run() {
    this.isStart = true

    while (this.isStart) {
      console.log(this.socket.id)
      this.socket.emit('test', 'test')
      await sleep(1000)
    }
  }

  stop() {
    this.isStart = false
  }
}
