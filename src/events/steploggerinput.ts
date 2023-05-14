import { APIEmbedField, EmbedBuilder, Interaction } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { addStepLogRow, getCurrentLeaderboard, getHighestDailySteps } from "../models/steplogs-table";

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

    await addStepLogRow({
      server_id: interaction.guildId,
      user: interaction.user.username + "#" + interaction.user.discriminator,
      steps: parseInt(steps),
      submit_time: new Date(),
    });

    const embed = new EmbedBuilder().setTitle("Log your steps!").setDescription("Current leaderboard:").setColor("#ffffff");

    let first = true;

    const stepsFields = await getCurrentLeaderboard().then((stepLogs) => {
      const steps: APIEmbedField | APIEmbedField[] | { name: string; value: string }[] = [];
      stepLogs.forEach((stepLog) => {
        if (first) {
          // @ts-ignore
          const firstPlaceUser = this.client.users.cache.find((userVar) => userVar.username == stepLog.user.split("#")[0]);
          const firstPlaceAvatarUrl = firstPlaceUser?.displayAvatarURL({ extension: "png", size: 1024 });

          embed.setAuthor({
            name: `${stepLog.user.split("#")[0]} is in the lead!`,
            iconURL: firstPlaceAvatarUrl,
          });
          first = false;
        }
        steps.push({
          name: stepLog.user,
          value: stepLog.steps.toString() + " steps",
        });
      });

      return steps;
    });

    const maxDailySteps = await getHighestDailySteps();

    const maxUsername = maxDailySteps[0].user.split("#")[0];

    // @ts-ignore
    const user = this.client.users.cache.find((user) => user.username == maxUsername);
    const avatarUrl = user?.displayAvatarURL({ extension: "png", size: 1024 });

    embed.setFooter({
      text: `Single day record:\n${maxDailySteps[0].user} with ${maxDailySteps[0].steps} steps`,
      iconURL: avatarUrl,
    });

    embed.addFields(stepsFields);
    await interaction.message?.edit({ embeds: [embed] });

    // @ts-ignore
    await channel.send(`${interaction.user} logged ${steps} steps!`);
  }
}
