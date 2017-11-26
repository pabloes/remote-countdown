var socketServer = function () {
  //TODO when socket disconnect server goes down
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
  process.on('uncaughtException', function (err) {
    //TODO https://stackoverflow.com/questions/17245881/node-js-econnreset
    console.log("uncaughtException");
    console.error(err.stack);
    //process.exit();
  });

  function onConnection(socket) {
    var storeSocketAction = store.dispatch(actions.storeSocket(socket));

    socket.on('close', ()=>{
      const socketId = storeSocketAction.payload.id;
      const ownerSessions = store.getState().sessionCollection.filter((session)=>session.owner === socketId);
      ownerSessions.forEach((session)=>socketMessageCallbacks.CLOSE_SESSION({
        sessionId:session.id
      }));
      store.dispatch(actions.removeSocket(socketId));
    });
    socket.on('disconnect', function () {
     console.log('disconnect!!!!!!!!!!!!');
    });
    const socketMessageCallbacks = {
      CREATE: (data, socket) => {
        const createSessionAction = store.dispatch(actions.createSession(data.sessionId, storeSocketAction.payload.id));
        socket.send(JSON.stringify({ command: 'CREATE_SUCCESS', sessionId: createSessionAction.payload.sessionId }));
      },
      JOIN: (data, socket) => {
        const joinSessionAction = store.dispatch(actions.joinSession(data.sessionId, storeSocketAction.payload.id));

        const sessionIndex = _.findIndex(store.getState().sessionCollection, {id:joinSessionAction.payload.sessionId});
        const clockIds = store.getState().sessionCollection[sessionIndex].clocks;
        const sessionClocks = _.filter(store.getState().clocks, (clock) => {
          return clockIds.indexOf(clock.id) >= 0;
        });

        socket.send(JSON.stringify({ command: 'JOIN_SUCCESS', sessionId:joinSessionAction.payload.sessionId, clocks: sessionClocks }));
      },
      ADD_CLOCK: (data, socket) => {
        const addClockAction = store.dispatch(actions.addClock(data.sessionId));
        socket.send(JSON.stringify({ command: 'ADD_CLOCK', clockId: addClockAction.payload.clockId }));
      },
      ALIVE: ()=>socket.send(JSON.stringify({ command: 'ALIVE'})),//TODO
      CD: (data, socket) => {
        const countDownAction = store.dispatch(actions.countDown(data));
        socket.send(JSON.stringify({
          command: 'CD',
          clockId: data.clockId,
          initialServerDate: countDownAction.payload.initialServerDate,
          countdown: countDownAction.payload.countdown,
        }));
      },
      CLOSE_SESSION: (data)=>{
        const state = store.getState();
        const session = state.sessionCollection
          .find((session)=>session.id === data.sessionId);

        session.members.forEach((socketId)=>{
          state.socketCollection.find(item=>item.id===socketId).socket
            .send(JSON.stringify({
              command: 'CLOSE_SESSION',
              sessionId: data.sessionId,
            }))
        });

        store.dispatch(actions.closeSession(data.sessionId));
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
