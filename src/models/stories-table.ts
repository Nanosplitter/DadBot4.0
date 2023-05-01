import { pool } from "./db";
import * as mysql from "mysql2";

export type StoryRow = mysql.RowDataPacket & {
  id: number;
  story: string;
};

export function getStories(): Promise<StoryRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(StoryRow & mysql.RowDataPacket)[]>("SELECT * FROM stories ORDER BY id DESC LIMIT 3", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function getAllStories(): Promise<StoryRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(StoryRow & mysql.RowDataPacket)[]>("SELECT * FROM stories", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

export function addStory(story: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO stories (story) VALUES (?)", [story], function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
