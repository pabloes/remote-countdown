//followind not working (--harmony?)
//return {...state, socketCollection: [...socketCollection, action.payload.socket]});

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
      return getExtendedState({
        socketCollection: state.socketCollection.filter(x => x.id !== action.payload.socketId),
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

    default:
      return state;
  }

  function getExtendedState(reduction) {
    return Object.assign({}, state, reduction);
  }
};
