import { WhatsappBot } from "../whatsapp";

export default class WhatsappBotInstance {
  public static instance: WhatsappBot;

  public static init = async () => {
    if (!this.instance) {
      this.instance = new WhatsappBot();
    }
  }

  public static getWhatsappBot(): WhatsappBot {
    if (!this.instance) {
      throw new Error('WhatsappBot not initialized');
    }

    return this.instance;
  }
}