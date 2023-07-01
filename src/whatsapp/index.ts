import { AnyMessageContent, MiscMessageGenerationOptions } from "@whiskeysockets/baileys"
import { Socket } from "./socket"

export class WhatsappBot {

  private socket: Socket

  public constructor(
    public configuration?: { [key: string]: any }
  ) {
    this.socket = new Socket(this)
    this.socket.init()
  }

  public async init() {
    if (!this.socket) {
      throw new Error('Socket not initialized')
    }

    const start = Date.now()

    console.log(`[WhatsappBot] Bot initialized ${Date.now() - start}ms`)
  }

  public sendMessage = (to: string, message: AnyMessageContent | string, options?: MiscMessageGenerationOptions) => {

    if (typeof message === 'string') {
      message = {
        text: message
      }
    }

    return this.socket.getInstance().sendMessage(to, message, options)
  }
}