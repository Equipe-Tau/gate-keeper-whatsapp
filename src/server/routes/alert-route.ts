import express from "express";
import WhatsappBotInstance from "../../utils/whatsapp-bot-instance";

const router = express.Router();

router.get('/send', async (req, res) => {
  await WhatsappBotInstance.getWhatsappBot().sendMessage('553171357942@s.whatsapp.net', 'Hello world!')
  res.send('Message sent!')
});

export default router