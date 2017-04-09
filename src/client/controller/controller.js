import Clock from '../clock-constructor/clock';
//TODO clock as component
//TODO in connector, separate sessionHandler as component with own state and inputs with proper interface,
// other component would be connectionHandler

export default function(connector, $rootScope, $scope){
    const self = this;
    const clock = new Clock({tickTime: 300});

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
    connector.onCommandReceived('CD', (countdownData) =>clock.applyCountdown(countdownData.seconds, new Date(countdownData.startTime), countdownData.pauses));
    connector.onCommandReceived('PAUSE', (pauseActionData) => clock.pause(new Date(pauseActionData.pauseTime)));
    connector.onCommandReceived('PAUSE', () => {self.paused = true; $scope.$apply();});
    connector.onCommandReceived('RESUME', (resumeActionData) => clock.resume(new Date(resumeActionData.resumeTime)));
    connector.onCommandReceived('RESUME', () => { self.paused = false; $scope.$apply();});
    connector.onCommandReceived('CLOSE_SESSION', ()=>{
      clock.stop();

      resetClock();
      resetJoinSessionInputValue();

      $scope.$apply();
    });

    self.paused = false;
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
    this.joinSession = connector.joinSession;
    this.createSession = (sessionToCreate) => connector.createSession(sessionToCreate || self.sessionToCreate);
    this.closeSession = connector.closeSession;
    this.leaveSession = connector.leaveSession;
    this.startTimer = (seconds) => connector.sendCommand('CD', {seconds:seconds});
    this.pause = () => connector.sendCommand('PAUSE');
    this.resume = () => connector.sendCommand('RESUME');
    this.disconnect = connector.closeConnection;
    this.getConnectionState = connector.getState;
    this.getTimeColor = () => "hsl(" + (self.percentage<0?0:self.percentage) + ",100%,36%)";

  function resetJoinSessionInputValue(){
    $scope.model.sessionToJoin = undefined;
  }

  function resetClock () {
    self.timeString = '88:88';
    self.differenceInSeconds = 0;
    self.globalCountDown = 0;
    self.percentage = undefined;
  }
}