import React from "react"
import Router from "next/router"
import ReactMarkdown from "react-markdown"
import { GameWorkspaceProps } from "types"

const GameWorkspace: React.FC<{ gameWorkspace: GameWorkspaceProps }> = ({ gameWorkspace }) => {
  const authorName = gameWorkspace.author ? gameWorkspace.author.name : "Unknown author"
  return (
    <div onClick={() => Router.push("/games/[id]", `/games/${gameWorkspace.id}`)}>
      <h2>{gameWorkspace.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={gameWorkspace.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  )
}

export default GameWorkspace
