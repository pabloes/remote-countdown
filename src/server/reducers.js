//followind not working (--harmony?)
//return {...state, socketCollection: [...socketCollection, action.payload.socket]});
var _ = require('lodash');

//TODO unit tests would be good
module.exports = function (state = { socketCollection: [], sessionCollection: [], clocks: [] }, action) {
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
      const isOwnerOfSessions = [];
      state.sessionCollection.forEach((session) => {
        if (action.payload.socketId === session.owner) {
          isOwnerOfSessions.push(session);
        }
      });
      return getExtendedState({
        socketCollection: state.socketCollection.filter(x => x.id !== action.payload.socketId),
        clocks: _.filter(state.clocks, clock => {
          const sessionOwnerClocks = _.flatMap(isOwnerOfSessions, (session) => session.clocks);
          return !!sessionOwnerClocks.find((clockId) => clock.id === clockId);
        }),//TODO remove clocks from the removed session if it's an owner
        sessionCollection: _.without(state.sessionCollection, ...isOwnerOfSessions)
          .reduce(function (acc, current) {
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

      //TODO we are modifying, not returning a new one, is that a problem for redux?
      var sessionIndex = _.findIndex(state.sessionCollection, { id: action.payload.sessionId });
      state.sessionCollection[sessionIndex].members.push(action.payload.socketId);

      return state;
    case 'CLOSE_SESSION':
      return getExtendedState({
        sessionCollection: _.without(state.sessionCollection, { id: action.payload.sessionId }),
        clocks: state.clocks.filter(clock=>clock.sessionId === action.payload.sessionId)
      });

    case 'ADD_CLOCK':
      return getExtendedState({
        clocks: state.clocks.concat([{
          id: action.payload.clockId,
          pauses: [],
          initialServerDate: null,
          countdown: null,
        }]),
        sessionCollection: state.sessionCollection.reduce(
          function (acc, current) {
            //TODO we are modifying, problem with redux immutable?
            current.clocks.push(action.payload.clockId);
            acc.push(current);
            return acc;
          }, []),
      });

    case 'COUNTDOWN':
      return getExtendedState({
        clocks: state.clocks.reduce((acc, clock) => {
          if (clock.id === action.payload.id) {
            Object.assign(clock, action.payload);//modifying an object
          }
          acc.push(clock);

          return acc;
        }, []),
      });
    default:
      return state;
  }

  function getExtendedState(reduction) {
    return Object.assign({}, state, reduction);
  }
};
