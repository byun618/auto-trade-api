import { Socket } from 'socket.io'

export interface SocketProps extends Socket {
  userTickerId?: string | string[]
}
