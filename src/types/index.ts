export type GameWorkspaceProps = {
  id: string
  title: string
  author: {
    name: string
    email: string
  } | null
  content: string
  published: boolean
}
