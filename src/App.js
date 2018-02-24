import React, { Component, Fragment } from 'react'
import { Provider, Consumer, actions, getState, connect } from './store'

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
  state.user && <img src={state.user.avatar_url} width={50} />

User = connect(['user'])(User)

const Score = () => (
  <Consumer select={['score']}>
    {({ state, actions }) => {
      const handleChange = e => {
        actions.updateScore(e.target.value)
        setTimeout(actions.scoreComment, 0)
      }

      return <input type="number" value={state.score} onChange={handleChange} />
    }}
  </Consumer>
)

const Comment = () => (
  <Consumer select={['comment', 'color']}>
    {({ state, actions }) => (
      <p style={{ color: state.color }}>{state.comment}</p>
    )}
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
        <Score />
        <Comment />
        <Count />
        <Time />
        <User />
      </Provider>
    )
  }
}

export default App
