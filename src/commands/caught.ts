import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export default class  extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
        name: "caught",
        description: "Find out how many times each server member has been caught by dad",
        type: "SLASH_COMMAND",
        category: "Other",
        
        
      }
    );
  }

  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: "Pong" });
  }
};
