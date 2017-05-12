export default function (pauses){
    var pauseMilliseconds = 0;

    if(pauses.length){
        pauses.forEach(function(pauseItem){
            pauseMilliseconds += (pauseItem.resumeTime - pauseItem.pauseTime)||0
        });
    }

    return pauseMilliseconds;
}