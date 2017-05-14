import clockController from './clock-controller';

export default {
  restrict: 'E',
  controller: clockController,
  controllerAs: 'clock',
  template:
  '<div flex layout="row">' +
  '<div flex class="clock" ng-bind="clock.timeString" ng-class="{blink: clock.differenceInSeconds < 0}" ng-style="{color:clock.getTimeColor()}">88:88</div>' +
    '<div flex ng-if="clock.editable">' +
      '<md-button flex="10" ' +
  'ng-disabled="clock.paused || !clock.editable" ' +
  ' class="control control--time-button" ' +
  ' ng-click="clock.onCountdown({seconds:60})">1 m</md-button>' +
      '<md-button flex="10" ng-disabled="clock.paused || !clock.editable" ng-click="clock.onCountdown({seconds:5*60})">5 m</md-button>' +

    '<div layout="row" flex>' +
  '<md-input-container flex>' +
  '<label>Minutes</label>' +
  '<input flex id="text-custom-time" ng-disabled="clock.paused || !clock.editable" ng-model="model.typedTime" class="control" type="text" ng-init="model.typedTime = 10"/></md-input-container>' +
    '<md-button flex ng-disabled="clock.paused || !clock.editable" type="button" ng-click="clock.onCountdown({seconds:model.typedTime*60})"' +
  ' >></md-button></div>' +


  '<md-button flex="10" ng-disabled="!clock.editable" ng-click="clock.isPaused()?clock.onResume():clock.onPause()">{{clock.isPaused()?\'resume\':\'pause\'}}</md-button>' +
  '</div>' +
  '</div>',
  bindings: {
    countdownData: '<',
    onPause: '&',
    onCountdown: '&',
    onResume: '&',
    editable: '<',
  },
};