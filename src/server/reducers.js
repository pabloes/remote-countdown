
module.exports = function (state = { socketCollection: [] }, action) {
  switch (action.type) {
    case 'STORE_SOCKET':
      return Object.assign({}, state, {
        socketCollection: state.socketCollection.concat( [{
          id:id++,
          socket:action.payload.socket
        }] )
      });
      //return {...state, socketCollection: [...socketCollection, action.payload.socket]});

    default:
      return state;
  }
};