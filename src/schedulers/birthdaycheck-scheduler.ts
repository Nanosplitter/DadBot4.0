import { CronJob } from "cron";

export default function runCronJob() {
  new CronJob({
    cronTime: "0 9 * * *",
    onTick: () => {
      console.log("Birthday check!");
    },
    timeZone: "America/New_York",
  }).start();
}
