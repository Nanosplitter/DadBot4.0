import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { schedulerEmitter } from "../emitters/scheduler-emitter";
import { APIEmbedField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { getCurrentLeaderboard } from "../models/steplogs-table";

export default class StepLogger extends Event {
  constructor(client: ShewenyClient) {
    super(client, "steplogger", {
      description: "Get the server's step count",
      once: false,
      emitter: schedulerEmitter,
    });
  }

  async execute() {
    const channelId = "1101265302609731684";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    const embed = new EmbedBuilder().setTitle("Log your steps!").setDescription("Current leaderboard:");

    const steps = await getCurrentLeaderboard().then((stepLogs) => {
      const steps: APIEmbedField | APIEmbedField[] | { name: string; value: string }[] = [];
      stepLogs.forEach((stepLog) => {
        steps.push({
          name: stepLog.user,
          value: stepLog.steps.toString() + " steps",
        });
      });

      return steps;
    });

    embed.addFields(steps);
    const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("steplogger").setLabel("Log Steps").setStyle(ButtonStyle.Primary)]);

    // @ts-ignore
    channel.send({ embeds: [embed], components: [row] });
  }
}
