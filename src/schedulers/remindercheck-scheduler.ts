import { CronJob } from "cron";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default function runCronJob() {
  new CronJob("*/5 * * * * *", () => {
    schedulerEmitter.emit("checkreminders");
  }).start();
}
