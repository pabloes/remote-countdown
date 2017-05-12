export default (state = {timeString:'88:88'}, action) => {
  switch(action.type){
    case 'APPLY_COUNTDOWN':
      return Object.assign({}, state, {countdownData:{
        countdown:action.countdownData && action.countdownData.seconds,
        initialServerDate:action.countdownData && new Date(action.countdownData.startTime),
        pauses:action.countdownData.pauses,
      }});
    default:
      return state;
  }
}