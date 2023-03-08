import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { reminderEmitter } from "../emitters/reminder-emitter";
import { getRemindersBeforeNow, deleteOldReminders } from "../models/remindme-table";
import { EmbedBuilder, TextChannel } from "discord.js";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "checkreminders", {
      description: "Event to run whenever a reminder needs to happen",
      emitter: reminderEmitter,
      once: false,
    });
  }

  async execute() {
    const reminders = await getRemindersBeforeNow();

    if (reminders == undefined) {
      return;
    }

    for (const reminder of reminders) {
      const channel = (await this.client.channels.fetch(reminder.channel)) as TextChannel;
      await channel.guild.members.fetch();
      const member = channel.guild.members.cache.get(reminder.who_id);

      if (member == undefined) {
        continue;
      }

      const embed = new EmbedBuilder().setTitle("Reminder").setDescription(`You asked me to remind you of this:`);

      embed.addFields({
        name: "What",
        value: reminder.what,
      });

      embed.addFields({
        name: "When",
        value: reminder.time.toString(),
      });

      channel.send({ content: `${member.user}`, embeds: [embed] });
    }

    await deleteOldReminders();
  }
}
