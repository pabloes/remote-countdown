export default function (seconds) {
    var negative = false, minutes;

    if (seconds < 0){
        negative = true;
        seconds *= -1;
    }

    minutes = Math.floor(seconds / 60);
    seconds = (seconds - minutes * 60);

    return (negative?'-':'')+ (minutes<=9?'0':'')+minutes + ':' + (seconds<=9?'0':'')+seconds ;
}
