import {createStore, applyMiddleware} from 'redux';
import clockReducers from './clock-reducers';
import clockActions from './clock-actions';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
const loggerMiddleware = createLogger();
import Clock from '../clock-constructor/clock';

export default function ($scope) {
  const clock = new Clock({ tickTime: 300 });
  const _this = this;

  let store = createStore(clockReducers, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware,
  ));
  this.timeString = '88:88';
  this.differenceInSeconds = 0;
  this.globalCountDown = 0;
  this.percentage = undefined;
  this.timeString = '88:88';
  this.getState = store.getState;

  clock.onTick((timeString, differenceInSeconds, globalCountDown) => {
    this.timeString = timeString;
    this.differenceInSeconds = differenceInSeconds;
    this.globalCountDown = globalCountDown;
    this.percentage = Math.floor(differenceInSeconds * 100 / globalCountDown);
    $scope.$apply();
  });

  $scope.$watch('initialServerDate', () => {
  });

  $scope.$watch('clock.countdownData',
    (countdownData) => {
      store.dispatch(clockActions.applyCountdown(countdownData));
      clock.applyCountdown(
        store.getState().countdownData.countdown,
        store.getState().countdownData.initialServerDate,
        [],
      );
    }
  );

  $scope.$watch('clock.getState().countdownData', (countdownData, oldCountdownData) => {
    if (countdownData) {

    }
  });
};