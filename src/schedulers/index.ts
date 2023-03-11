import { default as remindercheck } from "./remindercheck-scheduler";
import { default as birthdaycheck } from "./birthdaycheck-scheduler";
import { default as apod } from "./apod-scheduler";
import { default as firegator } from "./firegatorThursdays-scheduler";

export default function runSchedulers() {
  remindercheck();
  birthdaycheck();
  apod();
  firegator();
}
