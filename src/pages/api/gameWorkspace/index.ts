import { getServerSession } from "next-auth/next"
import prisma from "lib/prisma"
import { options } from "pages/api/auth/[...nextauth]"

export default async function handle(req, res) {
  const { title, content } = req.body

  const session = await getServerSession(req, res, options)
  const result = await prisma.gameWorkspace.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  })
  res.json(result)
}
