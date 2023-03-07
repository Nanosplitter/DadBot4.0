import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import * as chrono from "chrono-node";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "remindme",
      description: "Have Dad remind you of something at a specific time!",
      type: "SLASH_COMMAND",
      category: "utility",
      cooldown: 1,
      options: [
        {
          name: "when",
          type: ApplicationCommandOptionType.String,
          description: "A phrase describing when you want to be reminded",
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const when = interaction.options.get("when")?.value;
    if (when == undefined) {
      await interaction.reply({
        content: "You must specify when you want to be reminded",
        ephemeral: true,
      });
      return;
    }
    //TODO: It hates things like "Christmas", figure out why
    const res = chrono.parseDate(when.toString(), { timezone: "EST" });
    console.log(res);
    await interaction.reply({ content: `**${when}**\n${res.toString()}` });
  }
}
