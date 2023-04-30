import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default class StepLoggerButton extends Button {
  constructor(client: ShewenyClient) {
    super(client, ["steplogger"]);
  }

  async execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder().setCustomId("steploggermodal").setTitle("Log Steps");

    const stepInput = new TextInputBuilder().setCustomId("steps").setLabel("How many steps did you take today?").setPlaceholder("10000").setRequired(true).setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(stepInput);

    // @ts-ignore
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
}
