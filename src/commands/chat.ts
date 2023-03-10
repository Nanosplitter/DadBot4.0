import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction } from "discord.js";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "chat",
      description: "Have a chat with Dad",
      type: "SLASH_COMMAND",
      category: "fun",
      cooldown: 5,
    });
  }

  async execute(interaction: CommandInteraction) {
    const message = await interaction.reply({ content: "Hey there! Let's chat!", fetchReply: true });
    await message.startThread({
      name: `${interaction.user.username}'s chat with Dad`,
      autoArchiveDuration: 60,
    });
  }
}
