import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, ApplicationCommandOptionType, TextChannel } from "discord.js";
import { deleteExistingBirthdays, addBirthday } from "../models/birthdays-table";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "setbirthday",
      description: " Set your birthday so dad can remember!",
      type: "SLASH_COMMAND",
      category: "fun",
      options: [
        {
          name: "month",
          description: "The month of your birthday",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
          max_value: 12,
        },
        {
          name: "day",
          description: "The day of your birthday",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
          max_value: 31,
        },
        {
          name: "channel",
          description: "The channel to send the birthday message to. DO NOT set as a thread.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const month = interaction.options.get("month")?.value as number;
    const day = interaction.options.get("day")?.value as number;
    const channel = interaction.options.get("channel")?.channel as TextChannel;

    if (channel.isThread()) {
      await interaction.reply({
        content: "You can't set the birthday channel to a thread",
        ephemeral: true,
      });
      return;
    }

    if (month == undefined || day == undefined) {
      await interaction.reply({
        content: "You must specify a month and day",
        ephemeral: true,
      });
      return;
    }

    await deleteExistingBirthdays(interaction.user.username, channel.id);
    await addBirthday(interaction.user.username, interaction.user.toString(), channel.id, month, day);

    await interaction.reply({
      content: `Birthday set to ${month}/${day}!`,
    });
  }
}
