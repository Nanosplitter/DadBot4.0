import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "inspire",
      description: "Get some inspiration from Dad with a brand-new inspirational poster",
      type: "SLASH_COMMAND",
      category: "fun",
    });
  }

  async execute(interaction: CommandInteraction) {
    const url = "https://inspirobot.me/api?generate=true";
    const res = await fetch(url);
    const body = await res.text();

    await interaction.reply({ content: body });
  }
}
