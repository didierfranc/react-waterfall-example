import { initStore } from 'react-stateful'
import { createSelector } from 'reselect'
import { hacker } from 'faker'
import { devTool } from './devtool'

const scoreComment = createSelector(
  [({ score }) => parseInt(score, 10) > 0],
  (positive) => ({
    comment: positive
      ? `Good job, but : ${hacker.phrase()}`
      : `Something seems wrong : ${hacker.phrase()}`,
    color: positive ? 'green' : 'red',
  })
)

const store = {
  initialState: {
    count: 10,
    user: null,
    score: 0,
    comment: 'update scrore',
    color: 'black',
  },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
    getUser: async () => {
      const response = await fetch('https://api.github.com/users/didierfranc')
      const body = await response.json()
      return {
        user: { avatar: body.avatar_url },
      }
    },
    updateScore: (s, score) => ({ score }),
    scoreComment,
  },
}

export const { Provider, Consumer, actions, getState, connect } = initStore(
  store,
  devTool,
)
