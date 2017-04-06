export default {
    isNewSession:isNewSession,
    isCountDown:isCountDown,
    isJoinSession:isJoinSession
}

function isJoinSession(data){
    return data.indexOf("join:") === 0;
}

function isCountDown(data){
    return data.indexOf("cd:") === 0;
}

function isNewSession(data){
    return data.indexOf("new:") === 0;
}