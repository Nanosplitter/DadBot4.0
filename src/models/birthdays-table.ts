import { pool } from "./db";
import * as mysql from "mysql2";

export type BirthdayRow = {
  id: number;
  author: string;
  mention: string;
  channel_id: string;
  month: number;
  day: number;
};

// add birthday by first deleting all birthdays where author is the same as the new birthday and the channel_id is the same as the new birthday
export function deleteExistingBirthdays(author: string, channel_id: string) {
  return new Promise((resolve, reject) => {
    pool.query<(BirthdayRow & mysql.RowDataPacket)[]>("DELETE FROM birthdays_4 WHERE author = ? AND channel_id = ?", [author, channel_id], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

// add birthday
export function addBirthday(author: string, mention: string, channel_id: string, month: number, day: number) {
  return new Promise((resolve, reject) => {
    pool.query<(BirthdayRow & mysql.RowDataPacket)[]>(
      "INSERT INTO birthdays_4 (author, mention, channel_id, month, day) VALUES (?, ?, ?, ?, ?)",
      [author, mention, channel_id, month, day],
      function (err, results, fields) {
        if (err) {
          reject(err);
        }
        resolve(results);
      }
    );
  });
}

// get birthdays by month and day
export function getBirthdaysByMonthAndDay(month: number, day: number): Promise<BirthdayRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(BirthdayRow & mysql.RowDataPacket)[]>("SELECT * FROM birthdays_4 WHERE month = ? AND day = ?", [month, day], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

// migrate birthdays from the birthdays table to the birthdays_4 table
export function migrateBirthdays() {
  return new Promise((resolve, reject) => {
    pool.query<(BirthdayRow & mysql.RowDataPacket)[]>(
      "INSERT INTO `birthdays_4` (`id`, `author`, `mention`, `channel_id`, `month`, `day`) SELECT `id`, `author`, `mention`, `channel_id`, MONTH(`birthday`) as `month`, DAY(`birthday`) as `day` FROM `birthdays`;",
      function (err, results, fields) {
        if (err) {
          reject(err);
        }
        resolve(results);
      }
    );
  });
}
