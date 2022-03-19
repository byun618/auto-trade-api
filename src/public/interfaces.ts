import { Socket } from 'socket.io'

export interface SocketProps extends Socket {
  myTickerId?: string | string[]
}
