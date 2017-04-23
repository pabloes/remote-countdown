import clockController from './clock-controller';

export default {
  restrict: 'E',
  controller: clockController,
  controllerAs: 'clock',
  template: '<div id="content" ng-bind="clock.timeString" ng-class="{blink: clock.differenceInSeconds < 0}" ng-style="{color:clock.getTimeColor()}">88:88</div>' +
    '<div id="main-controls" ng-if="clock.editable">' +
      '<input ng-disabled="clock.paused || !clock.editable" id="button-start-1min" class="control control--time-button" type="button" ng-click="clock.onCountdown({seconds:60})" value="1 Min"/>' +
      '<input ng-disabled="clock.paused || !clock.editable" id="button-start-5min" class="control control--time-button" type="button" ng-click="clock.onCountdown({seconds:5*60})" value="5 Min"/>' +
  '<input id="text-custom-time" ng-disabled="clock.paused || !clock.editable" ng-model="model.typedTime" class="control" type="text" ng-init="model.typedTime = 10"/>' +
    '<input ng-disabled="clock.paused || !clock.editable" id="button-start-custom" class="control control&#45;&#45;time-button control-time-button&#45;&#45;play" type="button" ng-click="clock.onCountdown({seconds:model.typedTime*60})"' +
  ' value=">" />' +
  '<input ng-disabled="!clock.editable" id="button-pause" type="button" ng-click="clock.paused?clock.resume():clock.pause()" value="{{clock.paused?\'resume\':\'pause\'}}" />' +
  '</div>',
  bindings: {
    countdownData: '<',
    onPause: '&',
    onCountdown: '&',
    onResume: '&',
    editable: '<',
  },
};