import clockController from './clock-controller';
import clockTemplate from './clock.tpl.html';
export default {
  restrict: 'E',
  controller: clockController,
  controllerAs: 'clock',
  template: clockTemplate,
  bindings: {
    countdownData: '<',
    onPause: '&',
    onCountdown: '&',
    onResume: '&',
    editable: '<',
  },
};