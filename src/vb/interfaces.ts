import { Socket } from 'socket.io'

export interface IVbProps {
  socket: Socket
  access: string
  secret: string
  ticker?: string
  start?: number
  elapse?: number
}

export interface ISettingsProps {
  ticker: string
  start: number
  elapse: number
}

export interface IGettarget {
  buyTime: string
  sellTime: string
  targetPrice: number
}
