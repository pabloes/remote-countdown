import clock from './clock-component';
import angular from 'angular';

export default angular.module('remote-countdown.clock', [])
  .component('clock', clock).name;

