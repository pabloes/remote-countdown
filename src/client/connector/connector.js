import serverMessage from '../serverMessage/serverMessage';

export default function($q){
    function connect(host, options) {
        var defer = $q.defer();

        if (!host) {
            return defer.reject('missing host');
        }
        var ws = new WebSocket(host);

        ws.onopen = onOpenSocket;
        ws.onclose = onClosedSocket;
        ws.onmessage = onSocketMessage;

        return defer.promise;

        function onClosedSocket(closeEvent) {
            options.onConnectionClose(closeEvent);
        }

        function onOpenSocket() {
            defer.resolve({
                socket:ws
            });
        }

        /*
         //TODO doubtful if we have to send something to still alive
         //TODO http://stackoverflow.com/questions/12054412/are-websockets-adapted-to-very-long-lived-connections
         //TODO https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=websocket%20keepalive
         setInterval(function () {
         ws.send("alive");
         }, 1000);*/

        function onSocketMessage(response) {
            var data = JSON.parse(response.data);
            console.log("message received", data);
            if (data.command === 'NEW') {
                options.onSessionCreate(data.sessionId);
            } else if (data.command === 'CD') {
                options.onContDown(data);
            } else if( data.command === 'JOIN_SUCCESS'){
                options.onSessionJoin(data.sessionId);
            } else if( data.command === 'PAUSE'){
                options.onPause(data.pauseTime);
            } else if( data.command === 'RESUME'){
                options.onResume(data.resumeTime);
            } else if( data.command === 'CLOSE_SESSION'){
                options.onCloseSession();
            }
        }
    }

    function createSession(socket, sessionId){
        socket.send(JSON.stringify({command:'CREATE', sessionId:sessionId}));
    }

    function joinSession(socket, sessionId){
        socket.send(JSON.stringify({command:'JOIN', sessionId:sessionId}));
    }

    function closeSession(socket){
      socket.send(JSON.stringify({command:'CLOSE_SESSION'}));
    }

    function leaveSession(socket, sessionId){
        socket.send(JSON.stringify({command:'LEAVE_SESSION', sessionId}));
    }

    return {
        connect:connect,
        createSession:createSession,
        joinSession:joinSession,
        closeSession: closeSession,
      leaveSession:leaveSession
    };
}