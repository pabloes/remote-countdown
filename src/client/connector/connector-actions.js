import _noop from 'lodash/noop';

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

export const leaveSessionSend = (socket) => {
  socket.send(JSON.stringify({ command: 'LEAVE_SESSION' }));

  return {
    type: 'LEAVE_SESSION',
  };
};

export const commandReceived = (data) => {
  return {
    type: 'COMMAND_RECEIVED_' + data.command,
    data: data,
  };
};

export const sendCommand = (data, socket) => {
  socket.send(JSON.stringify(data));

  return {
    type: 'COMMAND_SEND_' + data.command,
    data: data,
  };
};

export default {
  connect: connectAsyncMiddleware,
  closeConnection: closeConnection,
  createSession: createSessionSend,
  closeSession: closeSessionSend,
  joinSession: joinSessionSend,
  leaveSession: leaveSessionSend,
  sendCommand: sendCommand,
};

function connectAsyncMiddleware(host, $q, commandReceivedCallbacks) {
  //TODO not the proper way to pass callback here?
  return function (dispatch, getState) {
    const defer = $q.defer();
    const setDisconnectCallback = (callback) => {
      onDisconnectCallback = callback;
    };
    let ws = new WebSocket(host);
    let onDisconnectCallback = _noop;

    dispatch(sendConnection(host, ws));
    ws.onopen = () => {
      defer.resolve({ socket: ws, onDisconnect:setDisconnectCallback });
      dispatch(connectionSuccess(host, ws));

      //TODO unregister, test alive to avoid idle connection message
      setInterval(()=>{
        console.log("alive interval");
        ws.send(JSON.stringify({
          command:'ALIVE',
          value:Math.floor(Math.random()*1000)
        }));
      },1000);
    };

    ws.onclose = () => {
      dispatch(closeConnection(host, ws));
      onDisconnectCallback();
    };

    ws.onerror = function (event) {
      defer.reject(event);
    };

    ws.onmessage = function (response) {
      const data = JSON.parse(response.data);
      dispatch(commandReceived(data));
      (commandReceivedCallbacks[data.command] || []).forEach((callback) => callback(data));
    };

    return defer.promise;
  };
}
