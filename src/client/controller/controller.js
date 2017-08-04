import Clock from '../clock-component/clock-timer/clock';

//TODO clock as component
//TODO in connector, separate sessionHandler as component
// with own state and inputs with proper interface,
// other component would be connectionHandler

export default function (connector, $rootScope, $scope, $mdSidenav) {
  const _this = this;
  const clock = new Clock({ tickTime: 300 });

  $scope.model = {};

  $scope.model.host = WEBPACK.PRODUCTION ?
    'ws://remote-countdown.herokuapp.com/' :
    'ws://localhost:5000';

  connector.subscribe((connectionState) => {

    //TODO review if it's the best way
    if (connectionState.sessionToCreate) {
      _this.sessionToCreate = connectionState.sessionToCreate;
    }

    //TODO review
    $scope.$applyAsync();
  });
  connector.onCommandReceived('ADD_CLOCK',
    (data) => {
      console.log('received command data', data);
      clocks.push({ id: data.clockId });
    }
  );

  connector.onCommandReceived('CD',
    (countdownData) => {
      _this.countdownData = countdownData;
    }
  );

  connector.onCommandReceived('CLOSE_SESSION', () => {
    resetJoinSessionInputValue();
    _this.countdownData = {};
    $scope.$apply();
  });

  this.connect = (host) => {
    connector.connect(host).then((connection) => {
      connection.onDisconnect(() => {
        resetJoinSessionInputValue();
        _this.countdownData = {};
        $scope.$apply();
      });
    }, (err) => {
      console.log(err);
    });
  };

  const clocks = [];

  this.joinSession = connector.joinSession;
  this.createSession = connector.createSession;
  this.closeSession = connector.closeSession;
  this.leaveSession = connector.leaveSession;
  this.startTimer = (seconds) => connector.sendCommand('CD', { seconds: seconds });
  this.pause = () => connector.sendCommand('PAUSE');
  this.resume = () => connector.sendCommand('RESUME');
  this.disconnect = connector.closeConnection;
  this.getConnectionState = connector.getState;
  this.addClock = () => connector.sendCommand('ADD_CLOCK', { sessionId: this.getConnectionState().activeSessionId });
  this.getClocks = () => clocks;

  this.sideClose = () => {
    $mdSidenav('left').close();
  };
  this.sideOpen = () => {
    $mdSidenav('left').open();
  };

  $scope.$watch('godmodoro.getConnectionState().activeSessionId', (activeSessionId)=>{
      if(activeSessionId){
        $mdSidenav('left').close();
      } else {
        $mdSidenav('left').open();
      }
  });

  function resetJoinSessionInputValue() {
    $scope.model.sessionToJoin = undefined;
  }
}