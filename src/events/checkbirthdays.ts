import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { birthdayEmitter } from "../emitters/birthday-emitter";
import { getBirthdaysByMonthAndDay } from "../models/birthdays-table";
import { EmbedBuilder, TextChannel } from "discord.js";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "checkbirthdays", {
      description: "Event to run whenever it is someone's birthday",
      emitter: birthdayEmitter,
      once: false,
    });
  }

  async execute() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const birthdays = await getBirthdaysByMonthAndDay(month, day);

    if (birthdays == undefined) {
      return;
    }

    for (const birthday of birthdays) {
      const channel = (await this.client.channels.fetch(birthday.channel_id)) as TextChannel;

      const embed = new EmbedBuilder()
        .setTitle("Happy Birthday! :tada: ")
        .setDescription(`It's ${birthday.mention}'s birthday today!`)
        .setFooter({ text: `Use \`/setbirthday [month] [day] [channel]\`` });

      channel.send({ content: `${birthday.mention}`, embeds: [embed] });
    }
  }
}
