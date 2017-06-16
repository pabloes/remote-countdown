var _ = require('lodash');

module.exports = function (state = { socketCollection: [] }, action) {
  switch (action.type) {
    case 'STORE_SOCKET':
      return Object.assign({}, state, {
        socketCollection: state.socketCollection.concat([{
          id: action.payload.id,
          socket: action.payload.socket
        }] )
      });
    //followind not working (--harmony?)
    //return {...state, socketCollection: [...socketCollection, action.payload.socket]});
    case 'REMOVE_SOCKET':
      return Object.assign({}, state, {
        socketCollection: _.filter(state.socketCollection, (socketItem) => {
          return socketItem.socket !== action.payload.socket;
        }),
      });

    default:
      return state;
  };
};