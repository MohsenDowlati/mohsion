import { useEffect } from "react"
import { socketClient } from "@/services/websocket/socketClient"

export function useWebSocket() {
  useEffect(() => {
    socketClient.connect("ws://localhost:4000")

    return () => socketClient.disconnect()
  }, [])
}
