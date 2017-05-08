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

  var data = null,
    sockets = [],
    socketServer = null,
    ws = require('websocket.io'),
    domain = require('domain'),
    socketDomain = domain.create(),
    md5 = require("md5");

  socketListen(9000);

  process.on('uncaughtException', function (err) {
    console.log("uncaughtException");
    console.error(err.stack);
    process.exit();
  });

  function socketListen(port) {
    console.log("started on port:" + port);
    socketDomain.on('error', function (err) {
      console.log('Error caught in socket domain:' + err);
    });

    socketDomain.run(function () {
      socketServer = ws.attach(server);//ws.listen(port);

      socketServer.on('listening', function () {
        console.log('SocketServer is running');
      });

      socketServer.on('connection', onConnection);
      socketServer.on('error', function (err) {
        console.log("ERROR", err);
      });
      socketServer.on('disconnect', (worker) => {
        console.log('disconnect!');
      });
    });
  }

  function onConnection(socket) {
    sockets.pauses = [];
    console.log('Connected to client');
    sockets.push(socket);

    socket.on('message', function (data) {
      console.log("message", data);
      onSocketMessageReceived(data, socket);
    });

    socket.on('close', function () {
      console.log("socket closed");
      onSocketClose(socket, sockets);
    });

    socket.on('error', function (err) {
      console.log("ERROR", err);
    });
  }

  function onSocketMessageReceived(dataString, socket) {
    console.log(dataString, socket.sessionId);

    console.log("received", dataString, socket.sessionId, socket.sessionIdJoined);
    var data = JSON.parse(dataString);
    if (data.command === "CREATE") {
      socket.pauses = [];
      socket.send(JSON.stringify({ command: 'NEW', sessionId: createSession(socket, data.sessionId) }))
    } else if (data.command === 'CD') {
      var startTime = new Date();
      var timeZoneOffset = startTime.getTimezoneOffset();
      socket.initialTime = startTime;
      socket.timeZoneOffset = timeZoneOffset;
      socket.countdown = data.seconds;
      socket.pauses = socket.pauses || [];
      socket.seconds = data.seconds;
      var socketOfTheSession = getSocketWithSessionId(data.sessionId, sockets);
      var messageData = {
        command: 'CD',
        seconds: data.seconds,
        timeZoneOffset: timeZoneOffset,
        startTime: startTime,
        pauses: socketOfTheSession.pauses
      };

      sendToMembersOfMySession(socket, messageData);

    } else if (data.command === 'JOIN') {
      var socketOfTheSession = getSocketWithSessionId(data.sessionId, sockets);
      socket.sessionIdJoined = socketOfTheSession.sessionId;
      if (socketOfTheSession) {
        socket.send(JSON.stringify({
          command: 'JOIN_SUCCESS',
          sessionId: socketOfTheSession.sessionId
        }));
        if (socketOfTheSession.countdown) {
          //TODO also send join_success

          socket.send(JSON.stringify({
            command: 'CD',
            seconds: socketOfTheSession.countdown,
            timeZoneOffset: socketOfTheSession.timeZoneOffset,
            startTime: socketOfTheSession.initialTime,
            pauses: socketOfTheSession.pauses
          }));
        }
      }
    } else if (data.command === 'PAUSE') {
      socket.pauses = socket.pauses || [];
      socket.pauses.push({
        pauseTime:new Date(),
        resumeTime:undefined
      });

      sendToMembersOfMySession(socket, {
        command: 'CD',
        pauses: socket.pauses,
        startTime: socket.initialTime,
        seconds: socket.seconds,
      });

    } else if (data.command === 'RESUME') {
      var resumeTime = new Date();
      socket.pauses[socket.pauses.length - 1].resumeTime = resumeTime;
      sendToMembersOfMySession(socket, {
        command: 'CD',
        pauses: socket.pauses,
        startTime: socket.initialTime,
        seconds: socket.seconds,
      })
    } else if (data.command === 'CLOSE_SESSION') {
      var messageData = {
        command: 'CLOSE_SESSION',
        sessionId: data.sessionId
      };

      sendToMembersOfMySession(socket, messageData);
      cleanSessionIdJoinedSockets(socket.sessionId);

      socket.pauses = [];
    } else if(data.command === 'LEAVE_SESSION'){
      var messageData = {
        command: 'CLOSE_SESSION',
        sessionId: data.sessionId
      };

      socket.sessionIdJoined = undefined;
      socket.send(JSON.stringify(messageData));
    }
  }

  function cleanSessionIdJoinedSockets(sessionId) {
    sockets.forEach(function (memberSocket) {
      if (memberSocket.sessionIdJoined === sessionId) {
        memberSocket.sessionIdJoined = undefined;
      }
      if(memberSocket.sessionId === sessionId) {
        memberSocket.sessionId = undefined;
      }
    });
  }

  function sendToMembersOfMySession(socket, messageData) {
    socket.send(JSON.stringify(messageData));
    sockets.forEach(function (memberSocket) {
      if (memberSocket.sessionIdJoined === socket.sessionId) {
        memberSocket.send(JSON.stringify(messageData));
      }
    });
  }

  function createSession(socket, sessionId) {
    var newSessionID = sessionId || md5(Math.random());
    while (getSocketWithSessionId(newSessionID, sockets)) {
      newSessionID = md5(Math.random());
    }
    socket.sessionId = newSessionID;
    socket.countdown = null;
    socket.initialTime = null;

    return newSessionID;
  }

  function onSocketClose(socket, sockets) {
    try {
      //TODO if socket is owner of session send RESET to all socket members
      if (socket.sessionId) {
        sockets.forEach(function (memberSocket) {
          if (memberSocket.sessionIdJoined) {
            memberSocket.sessionIdJoined = undefined;
            memberSocket.send(JSON.stringify({ command: 'CLOSE_SESSION' }));
          }
        });
      }
      socket.close();
      socket.destroy();
      console.log('Socket closed!');
      for (var i = 0; i < sockets.length; i++) {
        if (sockets[i] == socket) {
          sockets.splice(i, 1);
          console.log('Removing socket from collection. Collection length: ' + sockets.length);
          break;
        }
      }

      if (sockets.length == 0) {
        //  clearInterval(timerID);
        //  data = null;
      }
    }
    catch (e) {
      console.log("ERROR:", e);
    }
  }

  function getSocketWithSessionId(sessionId, colletion) {
    var i = colletion.length;
    while (i--) {
      if (colletion[i].sessionId === sessionId) {
        return colletion[i];
      }
    }
    return false;
  }
}();
