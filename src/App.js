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

class App extends Component {
  componentDidMount = () => {
    setInterval(actions.setTime, 1000)
  }
  render() {
    return (
      <Provider>
        <Count />
        <Time />
      </Provider>
    )
  }
}

export default App
