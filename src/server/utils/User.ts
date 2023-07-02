import { Prisma } from "@prisma/client";
import prismaClient from "../../utils/prisma";

export class User {
  constructor(public data: Prisma.UsersMinAggregateOutputType) {
  }

  static async find(id: number) {
    const user = await prismaClient.users.findFirst(
      {
        where: {
          finger_id: id
        }
      }
    )

    if (!user) {
      throw new Error('User not found')
    }

    return new User(user)
  }

  static async create(name: string, finger_id: number) {
    const user = await prismaClient.users.create({
      data: {
        name,
        finger_id
      }
    })

    return new User(user)
  }

  static async delete(fingerId: number) {

    const user = await User.find(fingerId)

    return await prismaClient.users.delete({
      where: {
        id: Number(user.data.id)
      }
    })
  }

  static async all() {
    const users = await prismaClient.users.findMany()
    return users.map(user => new User(user))
  }
}