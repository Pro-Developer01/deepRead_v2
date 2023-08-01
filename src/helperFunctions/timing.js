const tokenRefreshIntervalHours = 4;
export const amazonBookSyncIntervalMinutes = 5;
const hoursToMilliseconds = 1000 * 60 * 60;
const minutesToMilliseconds = 1000 * 60;

export const isTokenFresh = (authenticatedTime) => {
  return hasIntervalPassed(authenticatedTime, tokenRefreshIntervalHours);
};

export const getHoursInMilliseconds = (hours) => {
  return hours * hoursToMilliseconds;
};

export const getMinutesInMilliseconds = (minutes) => {
  return minutes * minutesToMilliseconds;
};

export const hasIntervalPassed = (
  compareTime,
  intervalHours,
  intervalMinutes
) => {
  const timeNow = new Date().getTime();
  const timePassed = timeNow - compareTime;
  let intervalTime = getHoursInMilliseconds(intervalHours);
  if (intervalMinutes) {
    intervalTime += getMinutesInMilliseconds(intervalMinutes);
  }

  if (timePassed < intervalTime) return true;
  return false;
};

export const formatDateString = (date) => {
  if (date) return date.toString().substring(0, 24);
  return "";
};

export const formatTimeString = (date) => {
  if (date) return date.toString().substring(16, 24);
  return "";
};
