export default (state = {timeString:'88:88'}, action) => {
  switch(action.type){
    case 'APPLY_COUNTDOWN':
      return Object.assign({}, state, {countdownData:{
        countdown:action.countdownData && (action.countdownData.seconds || action.countdownData.countdown),
        initialServerDate:action.countdownData && new Date(action.countdownData.initialServerDate),
        pauses:action.countdownData.pauses,
      }});
    default:
      return state;
  }
}