import React, { Component, Fragment } from 'react'
import { Provider, Consumer, actions, connect } from './store'

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

let User = ({ state }) =>
  state.user && <img src={state.user.avatar} width={50} alt="avatar" />

User = connect(['user'])(User)

class App extends Component {
  componentDidMount = () => {
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
