import godmodoroClient from "./tempoteam";
import * as angular from 'angular';

import connector from './connector/connector';
import controller from './controller/controller';

angular.module('godmodoro', [])
    .controller('godmodoro', controller)
    .factory('connector', connector);

window.gmc = godmodoroClient();