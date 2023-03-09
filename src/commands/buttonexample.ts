import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "buttonexample",
      description: "An example for how buttons work",
      type: "SLASH_COMMAND",
      category: "fun",
    });
  }

  async execute(interaction: CommandInteraction) {
    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId("primaryId").setLabel("Accept").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("secondaryId").setLabel("Reject").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("successId").setLabel("Success").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("dangerId").setLabel("Danger").setStyle(ButtonStyle.Danger),
    ]);

    // @ts-ignore
    await interaction.reply({ content: "Buttons!", components: [row] });
  }
}
