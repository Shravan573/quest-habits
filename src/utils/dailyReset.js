export function shouldRunCron(lastCronISO) {
  if (!lastCronISO) return true;
  const lastCron = new Date(lastCronISO);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return lastCron < todayMidnight;
}

export function daysMissed(lastCronISO) {
  if (!lastCronISO) return 0;
  const lastCron = new Date(lastCronISO);
  const now = new Date();
  const diffMs = now - lastCron;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isDailyDueToday(daily) {
  if (!daily || daily.type !== 'daily') return false;
  const today = new Date().getDay(); // 0 = Sun, 6 = Sat

  if (daily.frequency === 'weekly') {
    return (daily.daysOfWeek || []).includes(today);
  }
  // frequency === 'daily' — always due
  return true;
}
