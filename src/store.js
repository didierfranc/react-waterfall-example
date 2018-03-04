import { initStore } from 'react-stateful'
import { devTool } from './devtool'

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const store = {
  initialState: {
    count: 10,
    user: null
  },
  actions: {
    increment: ({ state: { count } }) => ({ count: count + 1 }),
    getUser: async ({ setState }, user) => {
      setState({ loading: true })
      const response = await fetch('https://api.github.com/users/' + user)
      await timeout(1000)
      const body = await response.json()
      return {
        loading: false,
        user: { avatar: body.avatar_url }
      }
    }
  }
}

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe,
} = initStore(store, devTool)
