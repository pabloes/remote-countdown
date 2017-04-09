import Clock from '../clock-constructor/clock';

//TODO clock as component
//TODO in connector, separate sessionHandler as component
// with own state and inputs with proper interface,
// other component would be connectionHandler

export default function (connector, $rootScope, $scope) {
  const _this = this;
  const clock = new Clock({ tickTime: 300 });

  $scope.model = {};

  //$scope.model.host = 'ws://guarded-eyrie-7081.herokuapp.com';
  $scope.model.host = 'ws://localhost:5000';
  _this.timeString = '88:88';
  _this.differenceInSeconds = 0;
  _this.globalCountDown = 0;
  _this.percentage = undefined;
  _this.activeSessionId = undefined;

  clock.onTick(function (timeString, differenceInSeconds, globalCountDown) {
    _this.timeString = timeString;
    _this.differenceInSeconds = differenceInSeconds;
    _this.globalCountDown = globalCountDown;
    _this.percentage = Math.floor(differenceInSeconds * 100 / globalCountDown);
    $scope.$apply();
  });

  connector.subscribe((connectionState) => {

    //TODO review if it's the best way
    if (connectionState.sessionToCreate) {
      _this.sessionToCreate = connectionState.sessionToCreate;
    }

    //TODO review
    $scope.$applyAsync();
  });
  connector.onCommandReceived('CD',
    (countdownData) => clock.applyCountdown(
      countdownData.seconds,
      new Date(countdownData.startTime),
      countdownData.pauses)
  );
  connector.onCommandReceived('PAUSE',
    (pauseActionData) => clock.pause(new Date(pauseActionData.pauseTime))
  );
  connector.onCommandReceived('PAUSE', () => {
    _this.paused = true;
    $scope.$apply();
  });
  connector.onCommandReceived('RESUME',
    (resumeActionData) => clock.resume(
      new Date(resumeActionData.resumeTime)
    )
  );
  connector.onCommandReceived('RESUME', () => {
    _this.paused = false;
    $scope.$apply();
  });
  connector.onCommandReceived('CLOSE_SESSION', () => {
    clock.stop();

    resetClock();
    resetJoinSessionInputValue();

    $scope.$apply();
  });

  _this.paused = false;
  this.connect = (host) => {
    connector.connect(host).then((connection) => {
      connection.onDisconnect(() => {
        clock.stop();

        resetClock();
        resetJoinSessionInputValue();
        $scope.$apply();
      });
    }, (err) => {
      console.log(err);
    });
  };

  this.joinSession = connector.joinSession;
  this.createSession = (sessionToCreate) => connector.createSession(
    sessionToCreate || _this.sessionToCreate
  );
  this.closeSession = connector.closeSession;
  this.leaveSession = connector.leaveSession;
  this.startTimer = (seconds) => connector.sendCommand('CD', { seconds: seconds });
  this.pause = () => connector.sendCommand('PAUSE');
  this.resume = () => connector.sendCommand('RESUME');
  this.disconnect = connector.closeConnection;
  this.getConnectionState = connector.getState;
  this.getTimeColor = () => 'hsl(' + (_this.percentage < 0 ? 0 : _this.percentage) + ',100%,36%)';

  function resetJoinSessionInputValue() {
    $scope.model.sessionToJoin = undefined;
  }

  function resetClock() {
    _this.timeString = '88:88';
    _this.differenceInSeconds = 0;
    _this.globalCountDown = 0;
    _this.percentage = undefined;
  }
}