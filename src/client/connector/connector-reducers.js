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
        activeSessionId: undefined,
        host: action.host,
        socket: null,
        sessionOwner: false,
      });
    case 'SESSION_CREATE_SEND':
      return Object.assign({}, state, {
        creatingSession: true,
        joiningSession: false,
        activeSessionId: undefined,
        sessionOwner: true,//TODO should it be placed in the success?
      });
    case 'COMMAND_RECEIVED_CREATE_SUCCESS':
      return Object.assign({}, state, {
        activeSessionId: action.data.sessionId,
        sessionToCreate: action.data.sessionId,
        sessionOwner: true,
      });
    case 'SESSION_JOIN_SEND':
      return Object.assign({}, state, {
        creatingSession: false,
        joiningSession: true,
        activeSessionId: undefined,
        sessionOwner: false,
      });
    case 'COMMAND_RECEIVED_JOIN_SUCCESS':
      return Object.assign({}, state, {
        activeSessionId: action.data.sessionId,
        joiningSession: false,
        creatingSession: false,
        sessionOwner: false,
      });
    case 'COMMAND_RECEIVED_CLOSE_SESSION':
      return Object.assign({}, state, {
        activeSessionId: undefined,
        sessionOwner: undefined,
      });
    default:
      return state;
  };
};
