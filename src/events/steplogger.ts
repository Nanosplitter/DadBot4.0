import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { schedulerEmitter } from "../emitters/scheduler-emitter";
import { APIEmbedField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { getCurrentLeaderboard, getHighestDailySteps } from "../models/steplogs-table";

export default class StepLogger extends Event {
  constructor(client: ShewenyClient) {
    super(client, "steplogger", {
      description: "Get the server's step count",
      once: false,
      emitter: schedulerEmitter,
    });
  }

  async execute() {
    const channelId = "1095050641157673021";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    const embed = new EmbedBuilder().setTitle("Log your steps!").setDescription("Current leaderboard:").setColor("#ffffff");

    let first = true;

    const steps = await getCurrentLeaderboard().then((stepLogs) => {
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

    embed.addFields(steps);
    const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("steplogger").setLabel("Log Steps").setStyle(ButtonStyle.Primary)]);

    // @ts-ignore
    channel.send({ embeds: [embed], components: [row] });
  }
}
