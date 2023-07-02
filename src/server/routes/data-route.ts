import express from "express";
import prismaClient from "../../utils/prisma";
import { User } from "../utils/User";

const router = express.Router();

router.get('/user', async (req, res) => {

  const { id } = req.query

  const user = await prismaClient.users.findFirst(
    {
      where: {
        finger_id: Number(id)
      }
    }
  )

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  res.send(user)
});

router.post('/create', async (req, res) => {

  const { name, finger_id } = req.body

  const user = await prismaClient.users.create({
    data: {
      name,
      finger_id
    }
  })

  res.send(user)
});

router.delete('/delete', async (req, res) => {

  const { id } = req.query as Record<string, any>

  await User.delete(id);

  res.json({
    message: 'User deleted'
  })
});

router.get('/list', async (req, res) => {

  const users = (await User.all()).map(user => user.data);

  res.json({
    users
  })
});


export default router