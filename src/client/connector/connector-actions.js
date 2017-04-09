export const sendConnection = (host, socket) => {
  return {
    type: 'CONNECT_SEND',
    host,
    socket,
  };
};

export const connectionSuccess = (host, socket) => {
  socket.onmesage = (response) => {
    console.log('MESSAGE', response);
  };

  return {
    type: 'CONNECT_SUCCESS',
    host,
    socket,
  };
};

export const closeConnection = (host, socket) => {
  if (socket) {
    socket.close();
  }

  return {
    type: 'CONNECT_CLOSE',
    host,
    socket,
  };
};

export const createSessionSend = (sessionId, socket) => {
  socket.send(JSON.stringify({ command: 'CREATE', sessionId: sessionId }));

  return {
    type: 'SESSION_CREATE_SEND',
  };
};

export const joinSessionSend = (sessionId, socket) => {
  socket.send(JSON.stringify({ command: 'JOIN', sessionId: sessionId }));

  return {
    type: 'SESSION_JOIN_SEND',
  };
};

export const closeSessionSend = (socket) => {
  socket.send(JSON.stringify({ command: 'CLOSE_SESSION' }));

  return {
    type: 'SESSION_CLOSE_SEND',
  };
};

export const commandReceived = (data) => {
  return {
    type: 'COMMAND_RECEIVED_' + data.command,
    data: data,
  };
};

export default {
  connect: connectAsyncMiddleware,
  closeConnection: closeConnection,
  createSession: createSessionSend,
  joinSession: joinSessionSend,
};

function connectAsyncMiddleware(host, $q) {
  return function (dispatch, getState) {
    let ws = new WebSocket(host);

    const defer = $q.defer();
    dispatch(sendConnection(host, ws));

    ws.onopen = () => {
      defer.resolve({ socket: ws });
      dispatch(connectionSuccess(host, ws));
    };

    ws.onclose = () => {
      dispatch(closeConnection(host, ws));
    };

    ws.onerror = function (event) {
      defer.reject(event);
    };

    ws.onmessage = function (response) {
      dispatch(commandReceived(JSON.parse(response.data)));
    };

    return defer.promise;
  };
}
