//followind not working (--harmony?)
//return {...state, socketCollection: [...socketCollection, action.payload.socket]});
var _ = require('lodash');
//TODO unit tests would be good
module.exports = function (state = { socketCollection: [], sessionCollection: [] }, action) {
  switch (action.type) {
    case 'STORE_SOCKET':
      return getExtendedState({
        socketCollection: state.socketCollection.concat([
          {
            id: action.payload.id,
            socket: action.payload.socket,
          },
        ]),
      });

    case 'REMOVE_SOCKET':

      //TODO if socket is member of any session, remove the socketId from members

      return getExtendedState({
        socketCollection: state.socketCollection.filter(x => x.id !== action.payload.socketId),
        sessionCollection: state.sessionCollection.reduce(function(acc, current){

          //remove the session if owner disconnects
          if (current.owner !== action.payload.socketId) acc.push(current);
          return acc;
        }, []).reduce(function (acc, current) {

          //remove session member if it's disconnected socket
          if (current.members.indexOf(action.payload.socketId) >= 0) {
            current.members = _.without(current.members, action.payload.socketId);
          }

          acc.push(current);
          return acc;
        }, []),
      });

    case 'CREATE_SESSION':
      return getExtendedState({
        sessionCollection: state.sessionCollection.concat({
          id: action.payload.sessionId,
          owner: action.payload.owner,
          members: [],
          clocks: [],
        }),
      });

    case 'JOIN_SESSION':

      //TODO caution, we are modifying, not returning a new one, is that a problem for redux?
      var sessionIndex = _.findIndex(state.sessionCollection, { id: action.payload.sessionId });
      state.sessionCollection[sessionIndex].members.push(action.payload.socketId);

      return state;
    case 'CLOSE_SESSION':
      return getExtendedState({ sessionCollection:_.without(state.sessionCollection, { id: action.payload.sessionId }) });

    default:
      return state;
  }

  function getExtendedState(reduction) {
    return Object.assign({}, state, reduction);
  }
};
