import React, { Component } from 'react'
import { Provider, Consumer, actions, connect, subscribe } from './store'

const render = {
  root: 0,
  count: 0,
  user: 0,
}

subscribe((action, state) => console.log(action, state))

const Count = () => (
  <Consumer select={['count']}>
    {({ state, actions }) => {
      render.count++
      return (
        <div>
          <span>{state.count}</span>
          <button onClick={actions.increment}>+</button>
        </div>
      )
    }}
  </Consumer>
)

class User extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    actions.getUser(this.input.value)
  }

  render() {
    const { state } = this.props
    render.user++
    return (
      <div>
        {state.user && (
          <div>
            <img src={state.user.avatar} width={50} alt='avatar' />
          </div>
        )}
        <form onSubmit={this.handleSubmit}>
          <input type='text' ref={input => (this.input = input)} />
          <input
            type='submit'
            value={state.loading ? 'loading...' : 'load user'}
          />
        </form>
      </div>
    )
  }
}

User = connect(['user', 'loading'])(User)

class App extends Component {
  state = {
    date: new Date().toLocaleTimeString(),
  }
  componentDidMount = () => {
    actions.getUser('didierfranc')
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
