import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { getReminderById, deleteReminder } from "../models/remindme-table";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "deletereminder",
      description: "Delete a reminder given the ID",
      type: "SLASH_COMMAND",
      category: "Other",

      options: [
        {
          name: "id",
          description: "The ID of the reminder to delete",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const id = interaction.options.get("id")?.value;

    if (id == undefined) {
      await interaction.reply({
        content: "You must specify the ID of the reminder to delete",
        ephemeral: true,
      });
      return;
    }

    const [reminderToDelete] = await getReminderById(id.toString());

    if (reminderToDelete == undefined) {
      await interaction.reply({
        content: "That reminder doesn't exist",
        ephemeral: true,
      });
      return;
    }

    if (reminderToDelete.who_id !== interaction.user.id) {
      await interaction.reply({
        content: "You can't delete someone else's reminder",
        ephemeral: true,
      });
      return;
    }

    await deleteReminder(id.toString());

    await interaction.reply({
      content: `Reminder ${id} deleted`,
    });
  }
}
