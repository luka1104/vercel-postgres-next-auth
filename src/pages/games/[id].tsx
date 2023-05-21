import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "components/Layout"
import { GameWorkspaceProps } from "types"
import { useSession } from "next-auth/react"
import prisma from "lib/prisma"
import Router from "next/router"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const gameWorkspace = await prisma.gameWorkspace.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  return {
    props: gameWorkspace,
  }
}

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/gameWorkspace/publish/${id}`, {
    method: "PUT",
  })
  await Router.push("/")
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  })
  Router.push("/")
}

const GameWorkspace: React.FC<GameWorkspaceProps> = (props) => {
  const { data: session, status } = useSession()
  if (status === "loading") {
    return <div>Authenticating ...</div>
  }
  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.email === props.author?.email
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default GameWorkspace
