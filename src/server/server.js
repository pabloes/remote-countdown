var socketServer = function () {
  var http = require("http");
  var express = require("express");
  var _ = require('lodash');
  var app = express();
  var port = process.env.PORT || 5000;
  app.use(express.static(__dirname + "/"));
  var server = http.createServer(app);
  server.listen(port);

  var ws = require('websocket.io'),
    domain = require('domain'),
    socketDomain = domain.create();

  var { createStore, applyMiddleware } = require('redux');
  var reducers = require('./reducers');
  var actions = require('./actions');

  var store = createStore(reducers, applyMiddleware(
    easyLogger
  ));

  socketListen();

  function onConnection(socket) {
    var storeSocketAction = store.dispatch(actions.storeSocket(socket));

    socket.on('close', ()=>{
      store.dispatch(actions.removeSocket(storeSocketAction.payload.id));
    });

    const socketMessageCallbacks = {
      CREATE: (data, socket) => {
        const createSessionAction = store.dispatch(actions.createSession(data.sessionId, storeSocketAction.payload.id));
        socket.send(JSON.stringify({ command: 'CREATE_SUCCESS', sessionId: createSessionAction.payload.sessionId }));
      },
      JOIN: (data, socket) => {
        const joinSessionAction = store.dispatch(actions.joinSession(data.sessionId, storeSocketAction.payload.id));
        socket.send(JSON.stringify({ command: 'JOIN_SUCCESS', sessionId: joinSessionAction.payload.sessionId }));
      },
      ALIVE: ()=>socket.send(JSON.stringify({ command: 'ALIVE'})),//TODO
      CD: ()=>{},
      CLOSE_SESSION: ()=>{
        const closeSessionActions = store.dispatch(actions.closeSession(data.sessionId));
        /*TODO old:
         sendToMembersOfMySession(socket, messageData);
         cleanSessionIdJoinedSockets(socket.sessionId);
         socket.pauses = [];
         */
      },
      LEAVE_SESSION: ()=>{
        /*TODO OLD:
         var messageData = {
         command: 'CLOSE_SESSION',
         sessionId: data.sessionId
         };

         socket.sessionIdJoined = undefined;
         socket.send(JSON.stringify(messageData));
         */
      },
    };

    socket.on('message', _.flow(
      JSON.parse,
      ensureCommandExists,
      data => data?socketMessageCallbacks[data.command](data, socket):_.noop()
    ));

    function ensureCommandExists(data){
      if(!socketMessageCallbacks[data.command]){
        console.log('command does not exists',data.command);
        return false;
      }
      return data;
    }
  }

  function socketListen() {
    socketDomain.on('error', function (err) {
      console.log('Error caught in socket domain:' + err);
    });

    socketDomain.run(function () {
      var socketServer = ws.attach(server);
      socketServer.on('connection', onConnection);
    });
  }

  function easyLogger(store) {
    return function (next) {
      return function (action) {
        var nextState = next(action);
        var withoutSocketContent = _.cloneDeepWith(store.getState(), function(value, name){
          if(name === 'socket') {
            return '_WebSocket_';
          }
        });
        console.log('--- ' + action.type + ' ---');
        console.log(JSON.stringify(withoutSocketContent,null, '  '));

        return nextState
      };
    };
  };
}();
