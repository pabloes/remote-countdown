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

function removeSocket(socket) {
  return {
    type: 'REMOVE_SOCKET',
    payload: {
      socket: socket,
    },
  };
}

module.exports = {
  storeSocket,
  removeSocket
};