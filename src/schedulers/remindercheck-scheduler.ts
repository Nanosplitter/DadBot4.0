import { CronJob } from "cron";
import { reminderEmitter } from "../emitters/reminder-emitter";

export default function runCronJob() {
  new CronJob("*/5 * * * * *", () => {
    reminderEmitter.emit("checkreminders");
  }).start();
}
