import { initStore } from 'react-stateful'

const store = {
  initialState: {
    count: 10,
    time: new Date().toLocaleTimeString(),
    user: null,
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
  },
}

export const { Provider, Consumer, actions, getState, connect } = initStore(
  store,
)
