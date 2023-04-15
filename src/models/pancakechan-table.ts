import { pool } from "./db";
import * as mysql from "mysql2";

export type PancakeChanRow = mysql.RowDataPacket & {
  id: number;
  story: string;
};

export function getStories(): Promise<PancakeChanRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(PancakeChanRow & mysql.RowDataPacket)[]>("SELECT * FROM pancakechan", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function addStory(story: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO pancakechan (story) VALUES (?)", [story], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
