import { APIEmbedField, EmbedBuilder, Interaction } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { addStepLogRow, getCurrentLeaderboard } from "../models/steplogs-table";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "interactionCreate", {
      description: "Default description",
      once: false,
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== "steploggermodal") {
      return;
    }

    const steps = interaction.fields.getTextInputValue("steps");
    const channelId = "1101265302609731684";
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

    await addStepLogRow({
      server_id: interaction.guildId,
      user: interaction.user.username + "#" + interaction.user.discriminator,
      steps: parseInt(steps),
      submit_time: new Date(),
    });

    const embed = new EmbedBuilder().setTitle("Log your steps!").setDescription("Current leaderboard:");

    const stepsField = await getCurrentLeaderboard().then((stepLogs) => {
      const steps: APIEmbedField | APIEmbedField[] | { name: string; value: string }[] = [];
      stepLogs.forEach((stepLog) => {
        steps.push({
          name: stepLog.user,
          value: stepLog.steps.toString() + " steps",
        });
      });

      return steps;
    });

    embed.addFields(stepsField);
    await interaction.message?.edit({ embeds: [embed] });

    // @ts-ignore
    await channel.send(`${interaction.user} logged ${steps} steps!`);
  }
}
