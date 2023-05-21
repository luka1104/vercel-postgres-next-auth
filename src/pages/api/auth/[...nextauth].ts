import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import prisma from "lib/prisma"

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // pages: {
  //   signIn: "/signin",
  // },
  secret: process.env.SECRET,
}

export default (req, res) => NextAuth(req, res, options)
