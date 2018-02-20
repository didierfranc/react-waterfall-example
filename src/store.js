import { initStore } from 'react-stateful'

const store = {
  initialState: { count: 10, time: new Date().toLocaleTimeString() },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
    setTime: () => ({ time: new Date().toLocaleTimeString() }),
  },
}

export const { Provider, Consumer, actions, getState } = initStore(store)
