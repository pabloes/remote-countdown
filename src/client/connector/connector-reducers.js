export default (state = {}, action) => {
  switch (action.type) {
    case 'CONNECT_SEND':
      return Object.assign({}, state, {
        connecting: true,
        connected: false,
        host: action.host,
        socket: action.socket
      });
    case 'CONNECT_SUCCESS':
      return Object.assign({}, state, {
        connecting: false,
        connected: true,
        host: action.host,
        socket: action.socket
      });
    case 'CONNECT_CLOSE':
      return Object.assign({}, state, {
        connecting: false,
        connected: false,
        host: action.host,
        socket: null,
      });
    case 'SESSION_CREATE_SEND':
      return Object.assign({}, state, {
        creatingSession: true,
        joiningSession: false,
        activeSessionId: undefined,
        sessionId: undefined,
        sessionOwner: true,//TODO should it be placed in the success?
      });
    case 'SESSION_CREATE_RECEIVED':
      return Object.assign({}, state, {
        creatingSession: false,
        joiningSession: false,
        activeSessionId: action.sessionId,
        sessionToCreate: action.sessionId,
        sessionId: action.sessionId,
        sessionOwner: false
      });
    case 'COMMAND_RECEIVED_NEW':
      return Object.assign({}, state, {
        activeSessionId: action.data.sessionId,
        sessionToCreate: action.data.sessionId,
      });
    default:
      return state;
  };
};
