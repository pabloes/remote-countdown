import * as angular from 'angular';
import ngMaterial from 'angular-material';
import clipboard from 'angular-clipboard';

import connector from './connector/connector';
import controller from './controller/controller';
import clockModule from './clock-component/clock-module';

angular.module('godmodoro', [clockModule, ngMaterial, clipboard.name])
    .controller('godmodoro', controller)
    .factory('connector', connector);