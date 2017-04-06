import clockFormatter from './clock-formatter';
import getTotalPauseTime from './get-total-pause-time';
import _map from 'lodash/map';

export default function (options) {

    const TICK_TIME = (options || {}).tickTime || 300;

    var globalCountdown,
        isTimerRunning = false,
        globalLocalTime,
        paused = false,
        stopped = false,
        pauses = [];

    var onTickCallbacks = [];

    var self = this;
    this.applyCountdown = applyCountdown;
    this.onTick = onTick;
    this.updateCountDown = updateCountDown;
    this.pause = pause;
    this.resume = resume;
    this.pauses = pauses;

    this.stop = function(){
        stopped = true;
    };
    function resume(resumeDate){
        pauses[pauses.length -1].resumeTime = resumeDate.getTime();
        paused = false;
        applyTick();
    }

    function pause(pauseDate){
        var secondsBetweenInitialTimeAndPause = Math.floor( (pauseDate.getTime() - globalLocalTime )/1000 );
        var differenceInSeconds = globalCountdown-secondsBetweenInitialTimeAndPause;
        differenceInSeconds += Math.floor(getTotalPauseTime(pauses)/1000);
        paused = true;
        triggerOnTick(clockFormatter(differenceInSeconds), differenceInSeconds, globalCountdown);
        pauses.push({
            pauseTime:pauseDate.getTime()
        });
    }

    function updateCountDown(countDown, initialTime){
        //TODO not used?
        globalCountdown = countDown;
        globalLocalTime = initialTime;
    }

    function convertPausesFromDateToTime(pauses){
        return _map(pauses, function(pauseItem){
            return {
                pauseTime:(new Date(pauseItem.pauseTime)).getTime(),
                resumeTime:(new Date(pauseItem.resumeTime)).getTime(),
            }
        });
    }
    function applyCountdown(countdown, initialDate, serverPauses) {

        pauses = convertPausesFromDateToTime(serverPauses) || [];
        paused = false;

        globalCountdown = countdown;
        globalLocalTime = initialDate.getTime() || (new Date()).getTime();
        if(pauses.length && !pauses[pauses.length-1].resumeTime){
            paused = true;
            var pauseTime = pauses[pauses.length-1].pauseTime;
            var secondsBetweenInitialTimeAndPause = Math.floor( (pauseTime - globalLocalTime )/1000 );
            var differenceInSeconds = globalCountdown-secondsBetweenInitialTimeAndPause;
            differenceInSeconds += Math.floor(getTotalPauseTime(pauses)/1000);
            triggerOnTick(clockFormatter(differenceInSeconds), differenceInSeconds, globalCountdown);
        }
        if (!isTimerRunning && !paused) {
            setTimeout(function () {
                applyTick();
            }, TICK_TIME);
        }
    }

    function onTick(callback) {
        onTickCallbacks.push(callback);

        return function () {
            //TODO return an unregister function, remove callback
        };
    }

    function triggerOnTick(timeString, differenceInSeconds, globalCountdown) {
        onTickCallbacks.forEach(function (onTickCallback) {
            onTickCallback(timeString, differenceInSeconds, globalCountdown);
        });
    }

    function applyTick() {
        if(!paused && !stopped){
            var now = new Date();

            var differenceInSeconds = Math.floor(globalCountdown - (now.getTime() - globalLocalTime) / 1000);
            differenceInSeconds += Math.floor(getTotalPauseTime(pauses)/1000);
            isTimerRunning = true;

            triggerOnTick(clockFormatter(differenceInSeconds), differenceInSeconds, globalCountdown);

            setTimeout(function () {
                applyTick();
            }, TICK_TIME);
        }

        if(stopped){
            isTimerRunning = false;
            stopped = false;
        }
    }
}