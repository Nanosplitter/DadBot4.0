import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
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
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const month = interaction.options.get("month")?.value as number;
    const day = interaction.options.get("day")?.value as number;

    if (month == undefined || day == undefined) {
      await interaction.reply({
        content: "You must specify a month and day",
        ephemeral: true,
      });
      return;
    }

    await deleteExistingBirthdays(interaction.user.id, interaction.channelId);
    await addBirthday(interaction.user.id, interaction.user.toString(), interaction.channelId, month, day);

    await interaction.reply({
      content: `Birthday set to ${month}/${day}`,
    });
  }
}
