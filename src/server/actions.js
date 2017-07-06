var _ = require('lodash');

function storeSocket(socket) {
  return {
    type: 'STORE_SOCKET',
    payload: {
      socket: socket,
      id: _.uniqueId('socket_'),
    },
  };
}

function removeSocket(socketId) {
  return {
    type: 'REMOVE_SOCKET',
    payload: {
      socketId,
    },
  };
}

function createSession(sessionId, owner){
  return {
    type: 'CREATE_SESSION',
    payload: {
      sessionId: sessionId || _.uniqueId('SESSION_'),
      owner
    }
  }
}

module.exports = {
  storeSocket,
  removeSocket,
  createSession
};