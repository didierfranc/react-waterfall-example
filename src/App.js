import React, { Component, Fragment } from 'react'
import { Provider, Consumer, actions, getState } from './store'

const Count = () => (
  <Consumer select={['count']}>
    {({ state, actions }) => (
      <Fragment>
        <span>{state.count}</span>
        <button onClick={actions.increment}>+</button>
      </Fragment>
    )}
  </Consumer>
)

const Time = () => (
  <Consumer select={['time']}>
    {({ state }) => <div>{state.time}</div>}
  </Consumer>
)

const User = () => (
  <Consumer select={['user']}>
    {({ state }) =>
      state.user && <img src={state.user.avatar_url} width={50} />
    }
  </Consumer>
)

class App extends Component {
  componentDidMount = () => {
    setInterval(actions.setTime, 1000)
    actions.getUser()
  }
  render() {
    return (
      <Provider>
        <Count />
        <Time />
        <User />
      </Provider>
    )
  }
}

export default App
