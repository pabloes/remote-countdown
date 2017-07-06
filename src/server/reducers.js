var _ = require('lodash');

module.exports = function (state = { socketCollection: [], sessionCollection: [] }, action) {
  switch (action.type) {
    case 'STORE_SOCKET':
      return Object.assign({}, state, {
        socketCollection: state.socketCollection.concat([{
          id: action.payload.id,
          socket: action.payload.socket
        }])});
    //followind not working (--harmony?)
    //return {...state, socketCollection: [...socketCollection, action.payload.socket]});
    case 'REMOVE_SOCKET':
      return Object.assign({}, state, {
        socketCollection: state.socketCollection.filter(x =>
          x.id !== action.payload.socketId
        )
      });

      case 'CREATE_SESSION':
      return Object.assign({}, state, {
        sessionCollection: state.sessionCollection.concat({
          id: action.payload.sessionId,
          owner: action.payload.owner,
          members: [],
          clocks: []
        })
      });

    default:
      return state;
  };
};