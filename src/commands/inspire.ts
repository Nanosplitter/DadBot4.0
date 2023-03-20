import axios from "axios";
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
    await interaction.deferReply();
    const request = await axios.get("https://inspirobot.me/api?generate=true");
    const { data } = request;
    const body = data;

    await interaction.followUp({ content: body });
  }
}
