import path from 'path'

import makeWASocket, { useMultiFileAuthState, BaileysEventMap } from '@whiskeysockets/baileys'
import { WhatsappBot } from './index'

export class Socket {

  public instance: ReturnType<typeof makeWASocket>

  public constructor(
    public handler: WhatsappBot
  ) {

  }

  public async init() {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, "..", "..", "auth_info_data"))

    this.instance = makeWASocket({
      auth: state,
      printQRInTerminal: true
    })

    this.instance.ev.on('connection.update', (update) => {
      const { connection } = update
      if (connection === 'close') {
        console.log('[SOCKET] Disconnected from WhatsApp')
        console.log('[SOCKET] Reconnecting in 5 seconds')
        setTimeout(this.init, 5000)
      } else if (connection === 'open') {
        console.log('[SOCKET] Connected to WhatsApp')
        this.handler.init();
      }
    })

    this.instance.ev.on("creds.update", saveCreds);
  }

  public registerEvent<T extends keyof BaileysEventMap>(event: T, listener: (arg: BaileysEventMap[T]) => void) {
    this.instance.ev.on(event, listener)
  }

  public getInstance() {
    return this.instance
  }
}