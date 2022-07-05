const schedule = require('node-schedule');

const createRegularJob = (job, { hour, minute }) => {
  const rule = new schedule.RecurrenceRule();

  rule.hour = hour;
  rule.minute = minute;
  rule.tz = 'Europe/Minsk';

  schedule.scheduleJob(rule, job);
};

module.exports = createRegularJob;
