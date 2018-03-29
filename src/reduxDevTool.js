/**
 * react-waterfall/redux-devtools-extension
 *
 * @description Use redux-devtools-extension to debug react-waterfall
 * @author Eli Sherer [github.com/elisherer]
 */
import { getState, actions } from './store'

const toolName = '[react-waterfall/redux-devtools-extension]'
const DEBUG = false

const extension = typeof window !== 'undefined' && (window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension)
const pageSource = '@devtools-page'
const extensionSource = '@devtools-extension'
const libConfig = {
  name: '[react-waterfall] ' + document.title,
  features: {
    jump: true,
    skip: false,
    dispatch: true
  }
}

const reduxDevTool = (instanceId = 1, maxAge = 50) =>
  // Check if the extension exists
  !extension
    ? () => {
      DEBUG && console.warn(`${toolName} You are trying to use redux-devtools without the extension installed.`)
      return () => {}
    }
    : (store, self) => {

      window.addEventListener('message', message => {
        if (message.data && message.data.source !== extensionSource) return
        const { type, payload } = message.data
        DEBUG && console.log(type, message.data)
        switch (type) {
          case 'ACTION': {
            const expression = payload.replace('this.','').split('(')
            if (typeof actions[expression[0]] === 'function') {
              const args = expression[1] ? expression[1].slice(0,-1).split(',') : []
              actions[expression[0]](...args)
              return
            }
            console.warn(`${toolName} The ACTION '${payload}' was not recognized.`)
            return
          }
          case 'DISPATCH': {
            switch (payload.type) {
              case 'COMMIT': {
                break // ?
              }
              case 'RESET': {
                self.setState(store.initialState)
                return
              }
              case 'ROLLBACK':
              case 'JUMP_TO_STATE':
              case 'JUMP_TO_ACTION': {
                const newState = message.data.state && JSON.parse(message.data.state)
                self.setState(newState)
                return
              }
              default:
                break
            }
            break
          }
          default:
            break
        }
        console.warn(`${toolName} The action ${type}.${payload ? payload.type : 'N/A'} is unsupported`)
      })

      let actionId = 0
      const getNextActionId = () => ++actionId
      const mockReduxDevToolsAction = (type, payload) => {
        window.postMessage({
          type: 'ACTION',
          action: JSON.stringify({
            type: "PERFORM_ACTION",
            action: {
              type
            },
            timestamp: Date.now()
          }),
          instanceId,
          maxAge,
          nextActionId: getNextActionId(),
          libConfig,
          payload,
          source: pageSource
        }, '*')
      }

      mockReduxDevToolsAction('@@INIT', store.initialState)

      return action => {
        // Since redux-devtools-extension was not initialized properly yet,
        // we need to add the @@INIT action again so it won't be overwritten
        if (actionId === 1) {
          mockReduxDevToolsAction('@@INIT', store.initialState)
        }
        mockReduxDevToolsAction(action, JSON.stringify(getState()))
      }
    }

export default reduxDevTool