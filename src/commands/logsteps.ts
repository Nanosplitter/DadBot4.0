import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "logsteps",
      description: "Create the message to prompt logging of steps",
      type: "SLASH_COMMAND",
      category: "Other",
    });
  }

  async execute(interaction: CommandInteraction) {
    schedulerEmitter.emit("steplogger");
    await interaction.reply({ content: "Step logging request sent!", ephemeral: true });
  }
}
