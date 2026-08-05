class SocketClient {
  private socket: WebSocket | null = null

  connect(url: string) {
    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      console.log("Socket connected")
    }

    this.socket.onmessage = (event) => {
      console.log("Realtime event:", event.data)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(event: string, payload: any) {
    this.socket?.send(JSON.stringify({ event, payload }))
  }

  disconnect() {
    this.socket?.close()
  }
}

export const socketClient = new SocketClient()
