import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "pancakechan",
      description: "Make a new episode of pancake-chan",
      type: "SLASH_COMMAND",
      category: "pancake-chan",
      userPermissions: ["Administrator"],
    });
  }

  async execute(interaction: CommandInteraction) {
    schedulerEmitter.emit("pancakechan");
    await interaction.reply({ content: "Episode request sent!", ephemeral: true });
  }
}
