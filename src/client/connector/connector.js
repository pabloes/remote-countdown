import { createStore, applyMiddleware } from 'redux';
import connectorReducers from './connector-reducers';
import connectorActions from './connector-actions';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
const loggerMiddleware = createLogger();

export default function ($q) {
  let store = createStore(connectorReducers, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware,
  ));

  function connect(host) {
    return store.dispatch(connectorActions.connect(host, $q));
  }

  function closeConnection() {
    return store.dispatch(connectorActions.closeConnection(store.getState().host, store.getState().socket));
  }

  function createSession(sessionId) {
    return store.dispatch(connectorActions.createSession(sessionId, store.getState().socket));
  }

  function commandReceived(data){
    return store.dispatch(connectorActions.commandReceived(data));
  }

  return {
    connect: connect,
    closeConnection: closeConnection,
    createSession: createSession,
    getState: store.getState,
    subscribe: (callback) => {
      return store.subscribe(() => {
        callback(store.getState());
      });
    },
  };
}