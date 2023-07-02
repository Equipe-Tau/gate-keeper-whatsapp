import express from "express";
import WhatsappBotInstance from "../../utils/whatsapp-bot-instance";
import { ENV } from "../../utils/environment";
import { User } from "../utils/User";

const router = express.Router();

router.post('/send', async (req, res) => {
  const { message, to } = req.body
  await WhatsappBotInstance.getWhatsappBot().sendMessage(to ? `${to}@s.whatsapp.net` : ENV.get("BROADCAST_ID"), message)
  res.json({
    message: 'Message sent'
  })
});

router.post('/broadcast', async (req, res, next) => {

  const { user_id, state, id } = req.body

  try {
    const user = await User.find(user_id)

    await WhatsappBotInstance.getWhatsappBot().sendMessage(
      ENV.get("BROADCAST_ID"),
      {
        text: `${state ? '🟢' : '🔴'} ${user.data.name} ${state ? 'devolveu' : 'pegou'} a chave ${id}`,
        mentions: (await WhatsappBotInstance.getWhatsappBot().getSocket().getInstance().groupMetadata(ENV.get("BROADCAST_ID"))).participants.map((participant) => participant.id)
      }
    )
    res.json({
      message: 'Message sent'
    })
  } catch (error) {
    next(error)
  }


});

export default router