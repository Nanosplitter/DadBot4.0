import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Message } from "discord.js";
import { addCaughtRow } from "../models/caught-table";

export class ImChecker extends Event {
  constructor(client: ShewenyClient) {
    super(client, "messageCreate", {
      description: "Message was sent",
      once: false,
      emitter: client,
    });
  }

  async execute(message: Message) {
    if (message.author.bot) {
      return;
    }

    const regex = /^(?!Iam)(i\s*'?a?m)\b(?!\s*$)/gim;
    if (regex.test(message.content)) {
      const restOfMessage = message.content.replace(regex, "").trim();
      const randomNumber = Math.floor(Math.random() * 10) + 1;

      if (randomNumber == 1) {
        message.reply(`Hi ${restOfMessage}, I'm Dad.`);
        await addCaughtRow(`${message.author.username}#${message.author.discriminator}`);
      }
    }
  }
}
