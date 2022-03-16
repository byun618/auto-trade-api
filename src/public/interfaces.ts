import { Socket } from 'socket.io'

export interface SocketProps extends Socket {
  identifier?: string | string[]
}
