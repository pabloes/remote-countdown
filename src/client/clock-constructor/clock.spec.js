import Clock from './clock';

describe('Clock', function () {
    const TICK_TIME = 300;
    describe('onTick', function(){
        var clock;
        beforeEach(function(){
            jasmine.clock().install();
            var baseTime = new Date(1983, 5, 6);
            jasmine.clock().mockDate(baseTime);
            clock = new Clock({tickTime: TICK_TIME});
        });
        afterEach(function(){
            jasmine.clock().uninstall();
        });

        it('must register a callback that will be executed after each TICK time', function () {
            var tickSpy = jasmine.createSpy('tick');

            clock.onTick(tickSpy);
            clock.applyCountdown(60);

            expect(tickSpy).not.toHaveBeenCalled();
            jasmine.clock().tick(300);
            expect(tickSpy.calls.mostRecent().args[0]).toBe('00:59');
            jasmine.clock().tick(1700);
            expect(tickSpy.calls.mostRecent().args[0]).toBe('00:58');
            jasmine.clock().tick(1000);
            expect(tickSpy.calls.mostRecent().args[0]).toBe('00:57');
        });

        it('callback must receive appropriate format when time is negative', function(){
            var tickSpy = jasmine.createSpy('tick');

            clock.onTick(tickSpy);
            clock.applyCountdown(1);

            jasmine.clock().tick(3000);

            expect(tickSpy.calls.mostRecent().args[0]).toBe('-00:02');

            jasmine.clock().tick(57000);

            expect(tickSpy.calls.mostRecent().args[0]).toBe('-00:59');
        });
    });
});