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

  socketListen(9000);

  function onConnection(socket) {
    store.dispatch(actions.storeSocket(socket));

    socket.on('close', ()=>{
      store.dispatch(actions.removeSocket(socket));
    });
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
