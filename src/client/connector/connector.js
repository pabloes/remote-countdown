import { createStore, applyMiddleware } from 'redux';
import connectorReducers from './connector-reducers';
import connectorActions from './connector-actions';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
const loggerMiddleware = createLogger();
import _pull from 'lodash/pull';

export default function ($q) {
  let store = createStore(connectorReducers, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware,
  ));
  const commandReceivedCallbacks = {};

  function addCommandReceivedCallback(command, callback) {
    if (!commandReceivedCallbacks[command]) {
      commandReceivedCallbacks[command] = [callback];
    } else {
      commandReceivedCallbacks[command].push(callback);
    }

    return () => _pull(commandReceivedCallbacks[command], callback);
  }

  function connect(host) {
    return store.dispatch(connectorActions.connect(host, $q, commandReceivedCallbacks));
  }

  function closeConnection() {
    return store.dispatch(
      connectorActions.closeConnection(store.getState().host, store.getState().socket)
    );
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
    //TODO do we always need to do store.egtState().socket?
    // shouldn't it be in other place or anything?
    return store.dispatch(connectorActions.closeSession(store.getState().socket));
  }

  function leaveSession() {
    return store.dispatch(connectorActions.leaveSession(store.getState().socket));
  }

  function sendCommand(command, data) {
    return store.dispatch(
      connectorActions.sendCommand(
        Object.assign({}, data, { command: command }), store.getState().socket
      )
    );
  }

  return {
    connect: connect,
    closeConnection: closeConnection,
    createSession: createSession,
    joinSession: joinSession,
    closeSession: closeSession,
    leaveSession: leaveSession,
    sendCommand: sendCommand,
    getState: store.getState,
    onCommandReceived: addCommandReceivedCallback,
    subscribe: (callback) => store.subscribe(() => callback(store.getState())),
  };
}
