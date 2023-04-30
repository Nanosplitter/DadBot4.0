import { Interaction } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { addStepLogRow } from "../models/steplogs-table";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "interactionCreate", {
      description: "Default description",
      once: false,
    });
  }

  execute(interaction: Interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== "steploggermodal") {
      return;
    }

    const steps = interaction.fields.getTextInputValue("steps");
    const channelId = "1095050641157673021";
    const channel = interaction.guild?.channels.cache.get(channelId);

    if (!channel) {
      return;
    }

    if (interaction.guildId === null) {
      return;
    }

    const numberSteps = parseInt(steps);

    if (isNaN(numberSteps)) {
      return;
    }

    interaction.deferUpdate();

    addStepLogRow({
      server_id: interaction.guildId,
      user: interaction.user.username + "#" + interaction.user.discriminator,
      steps: parseInt(steps),
      submit_time: new Date(),
    });

    // @ts-ignore
    channel.send(`${interaction.user} logged ${steps} steps!`);
  }
}
