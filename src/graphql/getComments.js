import {
  axiosGithub
} from '../util'

const getQL = (vars) => {
  const ql = `
  query getIssueAndComments(
    $id: Int!,
    $cursor: String,
    $pageSize: Int!
  ) {
    repository(owner: "tubone24", name: "blog") {
      issue(number: $id) {
        title
        url
        bodyHTML
        createdAt
        comments(first: $pageSize, after: $cursor) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            databaseId
            author {
              avatarUrl
              login
              url
            }
            bodyHTML
            body
            createdAt
            reactions(first: 100, content: HEART) {
              totalCount
              viewerHasReacted
              pageInfo{
                hasNextPage
              }
              nodes {
                id
                databaseId
                user {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
  `

  if (vars.cursor === null) delete vars.cursor

  return {
    operationName: 'getIssueAndComments',
    query: ql,
    variables: vars
  }
}

function getComments (issue) {
  const defaultAuthor = {
    avatarUrl: 'https://bit.ly/2McHd6Q',
    login: 'null',
    url: ''
  }
  const { cursor, comments } = this.state
  return axiosGithub.post(
    '/graphql',
    getQL(
      {
        id: issue.number,
        pageSize: 10,
        cursor
      },
    ), {
      headers: {
        Authorization: `bearer ${this.accessToken}`
      }
    }
  ).then(res => {
    const data = res.data.data.repository.issue.comments
    const items = data.nodes.map(node => {
      const author = node.author || defaultAuthor

      return {
        id: node.databaseId,
        gId: node.id,
        user: {
          avatar_url: author.avatarUrl,
          login: author.login,
          html_url: author.url
        },
        created_at: node.createdAt,
        body_html: node.bodyHTML,
        body: node.body,
        html_url: `https://github.com/tubone24/blog/issues/${issue.number}#issuecomment-${node.databaseId}`,
        reactions: node.reactions
      }
    })

    const cs = [...comments, ...items]

    const isLoadOver = data.pageInfo.hasPreviousPage === false || data.pageInfo.hasNextPage === false
    this.setState({
      comments: cs,
      isLoadOver,
      cursor: data.pageInfo.startCursor || data.pageInfo.endCursor
    })
    return cs
  })
}

export default getComments
