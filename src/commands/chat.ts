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
    try {
      await message.startThread({
        name: `${interaction.user.username}'s chat with Dad`,
        autoArchiveDuration: 60,
      });
    } catch (error) {
      await message.delete();
      await interaction.followUp({
        content: "I can't start a thread here! Make sure you're running this command in a channel.",
        ephemeral: true,
      });
    }
  }
}
