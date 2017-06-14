//TODO rename itemTime -> itemDate/itemDateString when appropriate
var socketServer = function () {
  var http = require("http");
  var express = require("express");
  var app = express();
  var port = process.env.PORT || 5000;
//TODO wrap into socket.countdownData object the different related variables
  app.use(express.static(__dirname + "/"));
  var server = http.createServer(app);
  server.listen(port);

  var ws = require('websocket.io'),
    domain = require('domain'),
    socketDomain = domain.create(),
    md5 = require("md5");

  var { createStore, applyMiddleware } = require('redux');
  var createLogger = require('redux-node-logger');
  var loggerMiddleware = createLogger({});
  var reducers = require('./reducers');
  var actions = require('./actions');

  var store = createStore(reducers, applyMiddleware(
    loggerMiddleware
  ));

  socketListen(9000);

  function onConnection(socket) {
    store.dispatch(actions.storeSocket(socket));
  }

  function socketListen(port) {
    console.log("started on port:" + port);
    socketDomain.on('error', function (err) {
      console.log('Error caught in socket domain:' + err);
    });

    socketDomain.run(function () {
      var socketServer = ws.attach(server);//ws.listen(port);
      socketServer.on('connection', onConnection);
    });
  }
}();
