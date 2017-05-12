import {createStore, applyMiddleware} from 'redux';
import clockReducers from './clock-reducers';
import clockActions from './clock-actions';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
const loggerMiddleware = createLogger();
import Clock from './clock-timer/clock';

export default function ($scope) {
  const clockTimer = new Clock({ tickTime: 300 });
  const _this = this;

  let store = createStore(clockReducers, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware,
  ));
  this.timeString = '88:88';
  this.differenceInSeconds = 0;
  this.globalCountDown = 0;
  this.percentage = undefined;
  this.getState = store.getState;
  this.pauses = [];
  this.getTimeColor = () => 'hsl(' + (_this.percentage < 0 ? 0 : _this.percentage) + ',100%,36%)';

  this.isPaused = () => clockTimer.isPaused;

  clockTimer.onTick((timeString, differenceInSeconds, globalCountDown) => {
    this.timeString = timeString;
    this.differenceInSeconds = differenceInSeconds;
    this.globalCountDown = globalCountDown;
    this.percentage = Math.floor(differenceInSeconds * 100 / globalCountDown);

    $scope.$applyAsync();
  });

  $scope.$on('$destroy', () => {
    clockTimer.destroy();
    store.dispatch(clockActions.applyCountdown({}));
  });

  $scope.$watch('clock.countdownData',
    (countdownData) => {
      if(countdownData){
        store.dispatch(clockActions.applyCountdown(countdownData));
        clockTimer.applyCountdown(
          store.getState().countdownData.countdown,
          store.getState().countdownData.initialServerDate,
          store.getState().countdownData.pauses,
        );
      }
    }
  );
};