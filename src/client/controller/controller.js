import Clock from '../clock-constructor/clock';
//TODO leave session
//TODO close session
export default function(connector, $rootScope, $scope){
    var self = this;
    var clock = new Clock({tickTime: 300});

    $scope.model = {};
    //$scope.model.host = 'ws://guarded-eyrie-7081.herokuapp.com';
    $scope.model.host = 'ws://localhost:5000';
    self.timeString = '88:88';
    self.differenceInSeconds = 0;
    self.globalCountDown = 0;
    self.percentage = undefined;
    self.activeSessionId = undefined;

    clock.onTick(function (timeString, differenceInSeconds, globalCountDown) {
        self.timeString = timeString;
        self.differenceInSeconds = differenceInSeconds;
        self.globalCountDown = globalCountDown;
        self.percentage = Math.floor(differenceInSeconds * 100 / globalCountDown);
        $scope.$apply();
    });

    self.state = {
        connected:false,
        connecting:false,
        joining:false,
        creating:false
    };

    this.sessionOwner = false;

    this.disconnect = function(){
        self.socket.close();
    };
    this.connect = (host)=>{
        connector.connect(host, {
            onSessionCreate:function(sessionId){
                self.state.creating = false;
                self.activeSessionId = sessionId;
                self.sessionToCreate = sessionId;
                $scope.$apply();
            },
            onContDown:function(countdownData){
                var timerDataFromServer = deserializeTimerDataFromServer(countdownData);
                clock.applyCountdown(timerDataFromServer.serverCountDown, timerDataFromServer.serverInitialTime, countdownData.pauses);

                function deserializeTimerDataFromServer(data) {
                    //TODO move to serverMessage
                    return {
                        serverCountDown: data.seconds,
                        serverTimeZone: data.timeZoneOffset,
                        serverInitialTime: new Date(data.startTime)
                    }
                }
            },
            onSessionJoin:function(sessionId){
                self.state.joining = false;
                self.activeSessionId = sessionId;
                $scope.$apply();
            },
            onPause:function(pauseDateString){
                //TODO in client, instead of doing always new Date for all ISOString, do it with a global interceptor
                clock.pause(new Date(pauseDateString));
            },
            onResume:function(resumeDateString){
                clock.resume(new Date(resumeDateString));
            },
            onConnectionClose:function(){
                clock.stop();

                resetConnection();
                resetClock();
                resetSession();

                $scope.$apply();
            },
            onCloseSession:function(){
                clock.stop();

                resetClock();
                resetSession();

                $scope.$apply();
            }
        }).then(onConnect, function(err){
            console.log(err);
            self.state.connecting = true;
            self.state.connected = false;
        });

        function resetConnection(){
            self.state.connected = false;
            self.state.connecting = false;
            self.socket = undefined;
        }

        function resetClock(){
            self.timeString = '88:88';
            self.differenceInSeconds = 0;
            self.globalCountDown = 0;
            self.percentage = undefined;
        }

        function resetSession(){
            self.session = undefined;
            self.activeSessionId = undefined;
            $scope.model.sessionToJoin = undefined;
            self.sessionOwner = false;
        }
    };

    this.paused = false;

    this.joinSession = (sessionId) => {
        self.state.joining = true;
        connector.joinSession(self.socket, sessionId);
    };

    this.createSession = (sessionId) => {
        self.state.creating = true;
        connector.createSession(self.socket, self.sessionToCreate);
        self.sessionOwner = true;//TODO should it be on the websocket success?
    };

    this.closeSession = () => {
        connector.closeSession(self.socket);
    };

    this.leaveSession = () => {
        connector.leaveSession(self.socket, self.activeSessionId);
    };

    this.startTimer = function(seconds){
        //self.socket.send("cd:" + seconds);
        self.socket.send(JSON.stringify({command:'CD', seconds:seconds}))
    };

    this.pause = function(){
        console.log("socket send pause");
       // self.socket.send('pause:' + JSON.stringify(self.pauses));
        self.socket.send(JSON.stringify({command:'PAUSE'}));
        self.paused = true;
    };

    this.resume = function(){
        console.log("socket send resume");
        //self.socket.send('resume:' + JSON.stringify(self.pauses));
        self.socket.send(JSON.stringify({command:'RESUME'}));
        self.paused = false;
    };

    this.getTimeColor = function(){
        return "hsl(" + (self.percentage<0?0:self.percentage) + ",100%,36%)";
    };

    function onConnect(connection){
        self.state.connected = true;
        self.socket = connection.socket;
    }

}