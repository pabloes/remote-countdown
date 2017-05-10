import getTotalPauseTime from './get-total-pause-time';

describe('get-total-pause-time', function () {
    it('must sum differences between resumeTime and pauseTime', function () {
        var pauses = [
            {
                pauseTime: 1000,
                resumeTime: 2000
            }, {
                pauseTime: 4000,
                resumeTime: 5500
            }];

        expect(getTotalPauseTime(pauses)).toBe(2500);
    });

    it('must sum differences between resumeTime and pauseTime excluding not completed pause', function () {
        var pauses = [
            {
                pauseTime: 1000,
                resumeTime: 2000
            }, {
                pauseTime: 4000,
                resumeTime: 5500
            },
            {
                pauseTime: 6000
            }];

        expect(getTotalPauseTime(pauses)).toBe(2500);
    });
});