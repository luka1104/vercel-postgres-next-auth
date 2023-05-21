import React from "react"
import { GetServerSideProps } from "next"
import Layout from "components/Layout"
import GameWorkspace from "components/GameWorkspace"
import prisma from "lib/prisma"
import { GameWorkspaceProps } from "types"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const feed = await prisma.gameWorkspace.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  return {
    props: { feed },
    // revalidate: 10,
  }
}

type Props = {
  feed: GameWorkspaceProps[]
}

const Index: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((gameWorkspace) => (
            <div key={gameWorkspace.id} className="post">
              <GameWorkspace gameWorkspace={gameWorkspace} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
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

export default Index
