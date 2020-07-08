import { initStore } from 'react-waterfall'
//import { devTool } from './devtool'
import reduxDevTool from "react-waterfall-redux-devtools-middleware";

const store = {
  initialState: {
    count: 10,
    user: null,
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
  },
}

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe,
} = initStore(store, reduxDevTool())
