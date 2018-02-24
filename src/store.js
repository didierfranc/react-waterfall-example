import { initStore } from 'react-stateful'
import { createSelector } from 'reselect'
import { hacker } from 'faker'

const scoreComment = createSelector(
  [({ score }) => parseInt(score, 10) > 0],
  (positif) => ({
    comment: positif
      ? `Good job, but : ${hacker.phrase()}`
      : `Something seems wrong : ${hacker.phrase()}`,
    color: positif ? 'green' : 'red',
  })
)

const store = {
  initialState: {
    count: 10,
    time: new Date().toLocaleTimeString(),
    user: null,
    score: 0,
    comment: 'update scrore',
    color: 'black',
  },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
    setTime: () => ({ time: new Date().toLocaleTimeString() }),
    getUser: async () => {
      const response = await fetch('https://api.github.com/users/didierfranc')
      const body = await response.json()
      return {
        user: body,
      }
    },
    updateScore: (s, score) => ({ score }),
    scoreComment,
  },
}

export const { Provider, Consumer, actions, getState, connect } = initStore(
  store,
)
