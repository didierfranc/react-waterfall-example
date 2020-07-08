import React, { Component } from 'react'
import { Provider, Consumer, actions, connect, subscribe } from './store'

const render = {
  root: 0,
  count: 0,
  user: 0,
}

subscribe((action, state) => console.log(action, state))

const Count = () => (
  <Consumer mapStateToProps={state => ({ count: state.count })}>
    {({ count, actions }) => {
      render.count++
      return (
        <div>
          <span>{count}</span>
          <button onClick={actions.increment}>+</button>
        </div>
      )
    }}
  </Consumer>
)

let User = ({ user }) => {
  render.user++
  return user && <img src={user.avatar} width={50} alt="avatar" />
}

User = connect(state => ({ user: state.user }))(User)

class App extends Component {
  state = {
    date: new Date().toLocaleTimeString(),
  }
  componentDidMount = () => {
    actions.getUser()
    // re-render app every second
    setInterval(
      () => this.setState({ date: new Date().toLocaleTimeString() }),
      1000,
    )
  }
  render() {
    render.root++
    return (
      <Provider>
        <div>{this.state.date}</div>
        <h1>Connected components</h1>
        <div className="flex examples">
          <Count />
          <User />
        </div>
        <h1>Rendering</h1>
        <p>
          App <i>{render.root}</i>
        </p>
        <p>
          Count <i>{render.count}</i>
        </p>
        <p>
          User <i>{render.user}</i>
        </p>
      </Provider>
    )
  }
}

export default App
