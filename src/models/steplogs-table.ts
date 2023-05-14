import { pool } from "./db";
import * as mysql from "mysql2";

export type StepLogRow = {
  id: number;
  server_id: string;
  user: string;
  steps: number;
  submit_time: Date;
};

export function getAllStepLogs(): Promise<StepLogRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(StepLogRow & mysql.RowDataPacket)[]>("SELECT * FROM steplogs;", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function getCurrentLeaderboard(): Promise<StepLogRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(StepLogRow & mysql.RowDataPacket)[]>("SELECT user, SUM(steps) as steps FROM steplogs GROUP BY user ORDER BY steps DESC;", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function getHighestDailySteps(): Promise<StepLogRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(StepLogRow & mysql.RowDataPacket)[]>("SELECT * FROM steplogs WHERE steps = (SELECT MAX(steps) FROM steplogs) LIMIT 1", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function addStepLogRow(stepLog: Omit<StepLogRow, "id">): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO steplogs SET ?", [stepLog], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
