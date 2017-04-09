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

    connector.subscribe(function(connectionState){
        //TODO review if it's the best way
        if(connectionState.sessionToCreate){
            self.sessionToCreate = connectionState.sessionToCreate;
        }
        //TODO review
        $scope.$applyAsync();
    });

    this.sessionOwner = false;

    this.disconnect = function(){
        connector.closeConnection();
    };

    this.getConnectionState = () => {
        return connector.getState();
    };

    connector.onCommandReceived('CD', (countdownData) =>clock.applyCountdown(countdownData.seconds, new Date(countdownData.startTime), countdownData.pauses));
    connector.onCommandReceived('PAUSE', (pauseActionData) => clock.pause(new Date(pauseActionData.pauseTime)));
    connector.onCommandReceived('RESUME', (resumeActionData) => clock.resume(new Date(resumeActionData.resumeTime)));
    connector.onCommandReceived('CLOSE_SESSION', ()=>{
      clock.stop();

      resetClock();
      resetJoinSessionInputValue();

      $scope.$apply();
    });

    function resetJoinSessionInputValue(){
      $scope.model.sessionToJoin = undefined;
    }

    function resetClock () {
      self.timeString = '88:88';
      self.differenceInSeconds = 0;
      self.globalCountDown = 0;
      self.percentage = undefined;
    }

    this.connect = (host)=>{
        connector.connect(host).then((connection)=>{
            connection.onDisconnect(()=>{
              clock.stop();

              resetClock();
              resetJoinSessionInputValue();
              $scope.$apply();
            });
        }, function(err){
            console.log(err);
        });
    };

    this.paused = false;

    this.joinSession = (sessionId) => {
        connector.joinSession(sessionId);
    };

    this.createSession = (sessionToCreate) => {
        connector.createSession(sessionToCreate || self.sessionToCreate);
        self.sessionOwner = true;//TODO should it be on the websocket success?
    };

    this.closeSession = () => {
        connector.closeSession();
    };

    this.leaveSession = () => {
        connector.leaveSession();
    };

    this.startTimer = function(seconds){
        connector.sendCommand('CD', {seconds:seconds});
    };

    this.pause = function(){
        connector.sendCommand('PAUSE');
        self.paused = true;//TODO this should not be here, in the command received, ?
    };

    this.resume = function(){
        connector.sendCommand('RESUME');
        self.paused = false; //TODO shoild it be once commemandReceived ?
    };

    this.getTimeColor = function(){
        return "hsl(" + (self.percentage<0?0:self.percentage) + ",100%,36%)";
    };
}