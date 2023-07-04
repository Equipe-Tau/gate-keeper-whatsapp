import { AnyMessageContent, MiscMessageGenerationOptions } from "@whiskeysockets/baileys"
import { Socket } from "./socket"
import { ENV } from "../utils/environment"
import { User } from "../server/utils/User"

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

    this.socket.registerEvent("messages.upsert", async ({ messages }) => {
      messages.forEach(async (message) => {

        if (!message.message?.conversation || message.key.remoteJid !== ENV.get("BROADCAST_ID")) {
          return;
        }

        const { conversation } = message.message

        if (conversation.startsWith('!')) {
          const [command, ...args] = conversation.slice(1).split(' ')
          const from = message.key.remoteJid

          if (command === 'adduser') {
            if (args.length !== 2) {
              return this.sendMessage(from, 'Defina o *Nome* e *FingerId* do usuário!')
            }

            const [name, finger_id] = args

            try {
              await User.create(name.replace(/_/g, " "), Number(finger_id))
              this.sendMessage(from, 'Usuário adicionado com sucesso!')
            } catch (error) {
              this.sendMessage(from, 'Erro ao adicionar usuário!')
            }
          }

          if (command === 'listusers') {
            const users = (await User.all()).map(user => user.data);
            this.sendMessage(from, `*Usuários cadastrados:*\n\n${users.map(user => `*Nome:* ${user.name}\n*FingerId:* ${user.finger_id}\n\n`).join('')}`)
          }

          if (command === 'deleteuser') {
            if (args.length !== 1) {
              return this.sendMessage(from, 'Defina o *FingerId* do usuário!')
            }

            const [finger_id] = args

            try {
              await User.delete(Number(finger_id))
              this.sendMessage(from, 'Usuário deletado com sucesso!')
            } catch (error) {
              this.sendMessage(from, 'Erro ao deletar usuário!')
            }
          }

          if (command === 'dumpid') {
            this.sendMessage(from, `*Group ID:* ${from}`)
          }

        }
      });
    })

    console.log(`[WhatsappBot] Bot initialized ${Date.now() - start}ms`)
  }

  public getSocket() {
    return this.socket
  }

  public sendMessage = (to: string, message: AnyMessageContent | string, extraMessageData?: AnyMessageContent, options?: MiscMessageGenerationOptions) => {

    if (typeof message === 'string') {
      message = {
        text: message
      }
    }

    return this.socket.getInstance().sendMessage(to, {
      ...message,
      ...extraMessageData
    }, options)
  }
}