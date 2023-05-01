import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "newstory",
      description: "Make a new episode of the story",
      type: "SLASH_COMMAND",
      category: "story",
      userPermissions: ["Administrator"],
    });
  }

  async execute(interaction: CommandInteraction) {
    schedulerEmitter.emit("newstory");
    await interaction.reply({ content: "Episode request sent!", ephemeral: true });
  }
}
