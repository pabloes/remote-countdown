import Clock from '../clock-component/clock-timer/clock';
import serverMessage from '../serverMessage/serverMessage';

export default function createGodmodoroClient() {
    var connectionDone = false;
    var imCreatorOfCurrentSession = false;
    var ws;
    var clock = new Clock({tickTime: 300});
    var onCreateSessionCallbacks = [];

    function startTimer(countdown) {
        //TODO manage if session, bad imCreatorOfCurrentSession
        if (connectionDone && imCreatorOfCurrentSession) {
            ws.send("cd:" + countdown);
        } else {
            clock.applyCountdown(countdown);
        }
    }

    function connect(host) {
        if (!host) {
            return;
        }
        ws = new WebSocket(host);

        connectionDone = true;

        ws.onopen = onOpenSocket;

        ws.onclose = onClosedSocket;

        ws.onmessage = onSocketMessage;

        function onClosedSocket() {
            console.log("disconnected");
        }

        function onOpenSocket() {
            console.log("open");
        }

        /*
         //TODO doubtful if we have to send something to still alive
         //TODO http://stackoverflow.com/questions/12054412/are-websockets-adapted-to-very-long-lived-connections
         //TODO https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=websocket%20keepalive
         setInterval(function () {
         ws.send("alive");
         }, 1000);*/

        function onSocketMessage(response) {
            //console.log("onmessage", response.data);
            var data = response.data;

            if (serverMessage.isNewSession(data)) {
                onCreateSessionCallbacks.forEach(function(onCreateSessionCallback){
                    onCreateSessionCallback(data.replace('new:', ''));
                });
            } else if (serverMessage.isCountDown(data) || serverMessage.isJoinSession(data)) {
                var timerDataFromServer = deserializeTimerDataFromServer(response.data);
                clock.applyCountdown(timerDataFromServer.serverCountDown, timerDataFromServer.serverInitialTime);
            }

            function deserializeTimerDataFromServer(data) {
                //TODO move to serverMessage
                var dataStrings = data.split(":");

                return {
                    serverCountDown: dataStrings[1],
                    serverTimeZone: dataStrings[2],
                    serverInitialTime: dataStrings[3]
                }
            }
        }
    }

    function createSession() {
        ws.send("create");
        imCreatorOfCurrentSession = true;
    }

    function onCreateSession(callback){
        onCreateSessionCallbacks.push(callback);
        //TODO return unregister function
    }

    function joinSession(sessionId) {
        ws.send("join:" + sessionId);
    }

    function registerClockElement(clockElement){
        clock.onTick(function (timeString) {
            clockElement.innerText = timeString;
        });
    }

    return {
        startTimer: startTimer,
        connect: connect,
        createSession: createSession,
        joinSession: joinSession,
        registerClockElement:registerClockElement,
        onCreateSession:onCreateSession
    };
}