import clockFormat from './clock-formatter';

describe('clock-formatter', function(){
    it('must transform seconds in clock format', function(){
        expect(clockFormat(0)).toBe('00:00');
        expect(clockFormat(1)).toBe('00:01');
        expect(clockFormat(100)).toBe('01:40');
        expect(clockFormat(-1)).toBe('-00:01');
        expect(clockFormat(-100)).toBe('-01:40');
    });
});