const db = require('../models');

const createGetClosestDateTime = async () => {
  await db.sequelize.query(`
    DELIMITER ;;
    DROP FUNCTION IF EXISTS getClosestDateTimeWithTime;
    CREATE FUNCTION getClosestDateTimeWithTime(string_time VARCHAR(8)) RETURNS DATETIME
    BEGIN

      DECLARE today_with_time datetime;
      DECLARE tomorrow_with_time datetime;

        SELECT STR_TO_DATE(CONCAT(curdate(), ' ', string_time), '%Y-%m-%d %H:%i:%s') INTO today_with_time;
        select STR_TO_DATE(CONCAT(date_add(curdate(), interval 1 day ), ' ', string_time), '%Y-%m-%d %H:%i:%s') into tomorrow_with_time;

        return if(today_with_time > now(), today_with_time, tomorrow_with_time);
    END;;
  `);
};

module.exports = createGetClosestDateTime;
