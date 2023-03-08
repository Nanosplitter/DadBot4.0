import { pool } from "./db";
import * as mysql from "mysql2";

export type ReminderRow = {
  id: number;
  who: string;
  who_id: string;
  what: string;
  time: Date;
  channel: string;
};

export function getRemindersBeforeNow(): Promise<ReminderRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(ReminderRow & mysql.RowDataPacket)[]>("SELECT * FROM remindme WHERE time <= UTC_TIMESTAMP();", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function deleteOldReminders(): Promise<ReminderRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(ReminderRow & mysql.RowDataPacket)[]>("DELETE FROM remindme WHERE time <= UTC_TIMESTAMP();", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function addReminder(who: string, who_id: string, what: string, time: string, channel: string) {
  return new Promise((resolve, reject) => {
    pool.query<(ReminderRow & mysql.RowDataPacket)[]>(
      "INSERT INTO remindme (who, who_id, what, time, channel) VALUES (?, ?, ?, ?, ?)",
      [who, who_id, what, time, channel],
      function (err, results, fields) {
        if (err) {
          reject(err);
        }
        resolve(results);
      }
    );
  });
}

export function getReminderById(id: string): Promise<ReminderRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(ReminderRow & mysql.RowDataPacket)[]>("SELECT * FROM remindme WHERE id = ?", [id], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function deleteReminder(id: string) {
  return new Promise((resolve, reject) => {
    pool.query<(ReminderRow & mysql.RowDataPacket)[]>("DELETE FROM remindme WHERE id = ?", [id], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}
