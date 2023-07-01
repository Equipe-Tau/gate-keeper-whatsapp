
import { Server } from './server';
import { ENV } from './utils/environment';
import WhatsappBotInstance from './utils/whatsapp-bot-instance';

WhatsappBotInstance.init();

const server = new Server({
  port: ENV.get('PORT')
});

server.init()
