import godmodoroClient from "./tempoteam";
import * as angular from 'angular';

import connector from './connector/connector';
import controller from './controller/controller';
import clockModule from './clock-component/clock-module';

angular.module('godmodoro', [clockModule])
    .controller('godmodoro', controller)
    .factory('connector', connector);

window.gmc = godmodoroClient();