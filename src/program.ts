import { UserTicker } from './models/user-tickers'
import { SocketProps } from './public/interfaces'
import Vb from './vb/vb'

interface IProgramList {
  [key: string]: Vb
}

export default class Program {
  private programList: IProgramList = {}

  private isVbExist(userTickerId: string): boolean {
    return !!this.programList[userTickerId]
  }

  async initVb(socket: SocketProps) {
    try {
      const { userTickerId } = socket

      // TODO: 디비를 기준으로 할 것이냐 코드 및 메모리를 기준으로 볼 것이냐
      if (this.isVbExist(userTickerId)) {
        const vb = this.programList[userTickerId]
        const { isStart } = vb.getStatus()

        let message = '프로그램이 이미 초기화 되었습니다.'

        if (isStart) {
          message = '프로그램이 이미 동작 중입니다.'
        }

        vb.setSocket(socket)
        socket.emit('message', { message })
        return
      }

      const userTicker = await UserTicker.findOne({ _id: userTickerId })

      const vb = new Vb({
        socket,
        ticker: userTicker.name,
        start: userTicker.start,
        elapse: userTicker.elapse,
        access: process.env.UPBIT_ACCESS_KEY,
        secret: process.env.UPBIT_SECRET_KEY,
      })

      this.programList[userTickerId] = vb

      socket.emit('message', { message: '프로그램을 초기화합니다.' })
    } catch (err) {
      console.error(err)
      socket.emit('error', {
        message: err.message,
        description: '프로그램 초기화 중 오류가 발생했습니다.',
      })
    }
  }

  async start(socket: SocketProps) {
    try {
      const vb = this.programList[socket.userTickerId]
      const { isStart } = vb.getStatus()

      if (isStart) {
        socket.emit('message', { message: '프로그램이 이미 동작 중입니다.' })
        return
      }

      socket.emit('message', { message: '프로그램을 시작합니다.' })
      vb.run()
    } catch (err) {
      console.error(err)
      socket.emit('error', {
        message: err.message,
        description: '프로그램 시작 중 오류가 발생했습니다.',
      })
    }
  }

  async stop(socket: SocketProps) {
    try {
      const { userTickerId } = socket
      const vb = this.programList[userTickerId]
      const { isStart } = vb.getStatus()

      if (!isStart) {
        socket.emit('message', { message: '프로그램이 이미 정지되었습니다.' })
        return
      }

      const userTicker = await UserTicker.findOne({
        _id: userTickerId,
      })
      userTicker.buyTime = null
      userTicker.isHold = null
      userTicker.isSell = null
      userTicker.sellTime = null
      userTicker.targetPrice = null
      await userTicker.save()

      socket.emit('message', { message: '프로그램을 정지합니다.' })
      vb.stop()
      delete this.programList[userTickerId]
    } catch (err) {
      console.error(err)
      socket.emit('error', {
        message: err.message,
        description: '프로그램 정지 중 오류가 발생했습니다.',
      })
    }
  }

  async getCurrentPrice(socket: SocketProps) {
    try {
      const vb = this.programList[socket.userTickerId]
      const currentPrice = await vb.getCurrentPrice()

      socket.emit('message', { message: `현재가: ${currentPrice}` })
    } catch (err) {
      console.error(err)
      socket.emit('error', {
        message: err.message,
        description: '현재가 불러오는 중 오류가 발생했습니다.',
      })
    }
  }
}
