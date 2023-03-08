import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { reminderEmitter } from "../emitters/reminder-emitter";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "checkreminders", {
      description: "Event to run whenever a reminder needs to happen",
      emitter: reminderEmitter,
      once: false,
    });
  }

  execute() {
    console.log("Event called !");
  }
}
