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

function joinSession(sessionId, socketId) {
  return {
    type: 'JOIN_SESSION',
    payload: {
      sessionId: sessionId,
      socketId: socketId,
    },
  };
}

function closeSession(sessionId) {
  return {
    type: 'CLOSE_SESSION',
    payload: {
      sessionId: sessionId,
    },
  };
}

function addClock(sessionId) {
  return {
    type: 'ADD_CLOCK',
    payload: {
      sessionId: sessionId,
      clockId: _.uniqueId('clock_'),
    },
  };
}

function countDown(data){
  return {
    type: 'COUNTDOWN',
    payload: {
      id:data.clockId,
      initialServerDate:new Date(),
      countdown:data.seconds,
    },
  };
}

module.exports = {
  storeSocket,
  removeSocket,
  createSession,
  joinSession,
  closeSession,
  addClock,
  countDown,
};