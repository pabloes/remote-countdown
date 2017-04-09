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
    //TODO return a promise?
    return store.dispatch(connectorActions.createSession(sessionId, store.getState().socket));
  }

  function joinSession(sessionId) {
    //TODO return a promise?
    return store.dispatch(connectorActions.joinSession(sessionId, store.getState().socket));
  }

  function closeSession() {
    //TODO do we always need to do store.egtState().socket? shouldn't it be in other place or anything?
    return store.dispatch(connectorActions.closeSession(store.getState().socket));
  }

  function commandReceived(data) {
    return store.dispatch(connectorActions.commandReceived(data));
  }

  function leaveSession() {
    return store.dispatch(connectorActions.leaveSession(store.getState().socket));
  }

  return {
    connect: connect,
    closeConnection: closeConnection,
    createSession: createSession,
    joinSession: joinSession,
    closeSession: closeSession,
    leaveSession: leaveSession,
    getState: store.getState,
    subscribe: (callback) => store.subscribe(() => callback(store.getState())),
  };
}
