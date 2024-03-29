import { CronJob } from "cron";
//import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default function runCronJob() {
  new CronJob({
    cronTime: "0 12 * * *",
    onTick: () => {
      //schedulerEmitter.emit("newstory");
    },
    timeZone: "America/New_York",
  }).start();
}
