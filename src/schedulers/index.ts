import { default as remindercheck } from "./remindercheck-scheduler";
import { default as birthdaycheck } from "./birthdaycheck-scheduler";

export default function runSchedulers() {
  remindercheck();
  birthdaycheck();
}
