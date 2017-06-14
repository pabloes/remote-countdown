function storeSocket(socket) {
  return {
    type: 'STORE_SOCKET',
    payload: {
      socket: socket,
    },
  };
}

module.exports = {
  storeSocket: storeSocket,
};