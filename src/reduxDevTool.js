/* eslint-disable */
import { getState } from './store'
import {initStore} from "react-waterfall"

const DEBUG = false;
const libName = '[react-waterfall/redux-devtools-extension]'
const pageSource = '@devtools-page'
const instanceId = 1

const notImplemented = action => () => {
  console.log(`${libName} ${action} not implemented!`)
  return { then: () => {} } //mock promise
}
const liftedStoreInit = {
  initialState: {
    actionsById: {},
    currentStateIndex: 0,
    isLocked:false,
    isPaused:false,
    monitorState:{},
    nextActionId:1,
    skippedActionIds:[],
    stagedActionIds:[0]
  },
  actions: 'COMMIT,JUMP_TO_STATE,JUMP_TO_ACTION,TOGGLE_ACTION,REORDER_ACTION,IMPORT_STATE,LOCK_CHANGES,PAUSE_RECORDING'.split(',')
    .reduce((actions,action) => {
      actions[action] = notImplemented(action)
      return actions
    }, {})
}
const liftedStore = initStore(liftedStoreInit)
liftedStore.dispatch = act => liftedStore.actions[act.type](act.payload)
new liftedStore.Provider() //initialize the lifted store

const reduxDevTool =
  // Check if the extension exsits
  typeof window === 'undefined' || (!window.__REDUX_DEVTOOLS_EXTENSION__ && !window.devToolsExtension)
    ? () => {
      if (process.env.NODE_ENV !== 'production') console.log(libName + ' You are trying to use redux devtool without the extension installed.')
      return () => {};
    }
    : (storeInit, self) => {
      let i = 0
      let snapshots = [{ state: storeInit.initialState }]

      const style = `
        font-size: 12px;
        color: #673AB7;
      `

      console.log('%ctime travel with: ⌥ + ←', style)

      window.addEventListener('keydown', e => {
        if (e.altKey && e.key === 'ArrowLeft') {
          self.state = {}
          i = i > 0 ? i - 1 : i
          self.setState(snapshots[i].state)
        }

        if (e.altKey && e.key === 'ArrowRight') {
          self.state = {}
          i = i < snapshots.length - 1 ? i + 1 : i
          self.setState(snapshots[i].state)
        }
      })

      DEBUG && window.addEventListener('message', message => {
        if (message.data && message.data.source.startsWith('react-devtools')) return // ignore react-devtool
        console.log(message.data.type, message.data)
      })

      let actionId = 0
      const getNextActionId = () => actionId++
      const mockReduxDevToolsAction = (type, payload) => {
        window.postMessage({
          type: 'ACTION',
          action: JSON.stringify({
            type: "PERFORM_ACTION",
            action: {
              type,
              payload: {dummy: false},
            },
            timestamp: Date.now()
          }),
          instanceId,
          maxAge: 50,
          nextActionId: getNextActionId(),
          libConfig: {name: document.title },
          payload,
          source: pageSource
        }, '*')
      }

      mockReduxDevToolsAction('@@INIT', storeInit.initialState)

      return action => {
        // Since redux-devtools-extension was not initialized properly yet,
        // we need to add the @@INIT action again so it won't be overwritten
        if (actionId === 1) {
          mockReduxDevToolsAction('@@INIT', storeInit.initialState)
        }
        mockReduxDevToolsAction(action, JSON.stringify(getState()))

        snapshots.push({ action, state: self.state })
        i = snapshots.length - 1
      }
    }

export default reduxDevTool