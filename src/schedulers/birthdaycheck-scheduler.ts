import { CronJob } from "cron";
import { birthdayEmitter } from "../emitters/birthday-emitter";

export default function runCronJob() {
  new CronJob({
    cronTime: "0 9 * * *",
    onTick: () => {
      birthdayEmitter.emit("checkbirthdays");
    },
    timeZone: "America/New_York",
  }).start();
}
