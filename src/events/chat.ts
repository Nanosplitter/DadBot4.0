import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Message } from "discord.js";
import { chatgpt } from "../functions/chatgpt";

export class Chat extends Event {
  constructor(client: ShewenyClient) {
    super(client, "messageCreate", {
      description: "Message was sent",
      once: false,
      emitter: client,
    });
  }

  async execute(message: Message) {
    await chatgpt(message);
  }
}
