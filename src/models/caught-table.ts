import { pool } from "./db";
import * as mysql from "mysql2";

export type CaughtRow = {
  id: number;
  user: string;
  count: number;
};

export function getCaughtRows(): Promise<CaughtRow[]> {
  return new Promise((resolve, reject) => {
    pool.query<(CaughtRow & mysql.RowDataPacket)[]>("SELECT * FROM caught ORDER BY count DESC", function (err, results, fields) {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}
