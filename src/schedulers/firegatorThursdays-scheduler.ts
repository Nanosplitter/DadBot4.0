import { CronJob } from "cron";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default function runCronJob() {
  new CronJob({
    cronTime: "0 0 * * 4",
    onTick: () => {
      schedulerEmitter.emit("praiseFiregator");
    },
    timeZone: "America/New_York",
  }).start();
}
