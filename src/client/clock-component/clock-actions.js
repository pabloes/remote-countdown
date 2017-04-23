export const applyCountdown = (countdownData) => {
  return {
    type: 'APPLY_COUNTDOWN',
    countdownData
  };
};

export default {
  applyCountdown
}