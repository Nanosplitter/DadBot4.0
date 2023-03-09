import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { schedulerEmitter } from "../emitters/scheduler-emitter";
import { TextChannel } from "discord.js";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "praiseFiregator", {
      description: "PRAISE LORD FIREGATOR",
      emitter: schedulerEmitter,
      once: false,
    });
  }

  async execute() {
    const channelId = "856919399789625376";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    const message = "***PRAISE***";
    const firegatorGif = "https://tenor.com/bkiCL.gif";

    channel.send({ content: message });
    channel.send({ content: firegatorGif });
  }
}
