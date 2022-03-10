const FindTimeBetween = (before, after) => {
  const difference = after - before;
  const difference_in_months = difference / (1000 * 3600 * 24 * 31);
  if (difference_in_months > 1) {
    return Math.floor(difference_in_months) + " months";
  }

  const difference_in_days = difference_in_months * 31;
  if (difference_in_days > 1) {
    return Math.floor(difference_in_days) + " days";
  }

  const difference_in_hours = difference_in_days * 24;
  if (difference_in_hours > 1) {
    return Math.floor(difference_in_hours) + " hours";
  }

  const difference_in_minutes = difference_in_hours * 60;
  if (difference_in_minutes > 1) {
    return Math.floor(difference_in_minutes) + " minutes";
  }

  const difference_in_seconds = difference_in_minutes * 60;
  return Math.floor(difference_in_seconds) + " seconds";
};

export default FindTimeBetween;
