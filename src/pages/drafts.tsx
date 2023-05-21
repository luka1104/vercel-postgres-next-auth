// pages/drafts.tsx

import React from "react"
import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import Layout from "components/Layout"
import GameWorkspace from "components/GameWorkspace"
import prisma from "lib/prisma"
import { GameWorkspaceProps } from "types"
import { options } from "pages/api/auth/[...nextauth]"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, options)
  if (!session) {
    res.statusCode = 403
    return { props: { drafts: [] } }
  }

  const drafts = await prisma.gameWorkspace.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  return {
    props: { drafts },
  }
}

type Props = {
  drafts: GameWorkspaceProps[]
}

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((gameWorkspace) => (
            <div key={gameWorkspace.id} className="post">
              <GameWorkspace gameWorkspace={gameWorkspace} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: var(--geist-background);
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Drafts
