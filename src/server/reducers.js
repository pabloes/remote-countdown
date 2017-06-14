module.exports = function (state = {}, action) {
  switch (action.type) {
    case 'STORE_SOCKET':
      return Object.assign({}, state, {
        socketCollection: (state.socketCollection || []).concat([action.payload.socket]),
      });
    default:
      return state;
  }
};