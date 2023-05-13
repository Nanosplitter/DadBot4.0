import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default class GeoguessButton extends Button {
  constructor(client: ShewenyClient) {
    super(client, ["geoguess"]);
  }

  async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder().setCustomId("geoguess").setTitle("GeoGuess");

    const guessInput = new TextInputBuilder().setCustomId("location").setLabel("Where is this picture taken?").setPlaceholder("The moon").setRequired(true).setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(guessInput);

    // @ts-ignore
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
}
