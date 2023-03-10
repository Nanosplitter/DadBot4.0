import { CronJob } from "cron";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default function runCronJob() {
  new CronJob({
    cronTime: "0 9 * * *",
    onTick: () => {
      schedulerEmitter.emit("checkbirthdays");
    },
    timeZone: "America/New_York",
  }).start();
}
