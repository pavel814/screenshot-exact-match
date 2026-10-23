// Demo account values (frontend-only build, no backend connected yet).
export const TRIAL = { days: 3, limit: 1000 };
export const PAID = { priceByn: 30, days: 30, limit: 5000 };
export const USAGE = { used: 60, limit: TRIAL.limit };
export const ACCESS_UNTIL = (() => {
  const x = new Date();
  x.setDate(x.getDate() + 2);
  x.setHours(18, 48, 0, 0);
  return x;
})();
