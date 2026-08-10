import { io, Socket } from "socket.io-client"
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000/api"
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? API_URL.replace(/\/api$/, "")
class SocketClient {
  private socket: Socket | null = null
  connect(token: string) { if (this.socket) { this.socket.auth = { token }; if (!this.socket.connected) this.socket.connect(); return this.socket } this.socket = io(SOCKET_URL, { auth:{token}, transports:["websocket","polling"], reconnection:true }); return this.socket }
  get() { return this.socket }
  disconnect() { this.socket?.disconnect(); this.socket = null }
}
export const socketClient = new SocketClient()
