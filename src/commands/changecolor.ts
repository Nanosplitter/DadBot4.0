import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from "discord.js";
import { hasBadContrast, parseToRgba, lighten, getContrast } from "color2k";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "changecolor",
      description: "Change your name's color",
      type: "SLASH_COMMAND",
      category: "utility",
      options: [
        {
          name: "color",
          description: "The color to change your name to",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const color = interaction.options.get("color")?.value;

    if (color == undefined) {
      await interaction.reply({
        content: "You must specify a color",
        ephemeral: true,
      });
      return;
    }

    const desiredColor = color.toString();
    const discordBackground = "#36393f";

    if (hasBadContrast(desiredColor, "readable", discordBackground)) {
      await interaction.reply({
        content: "Color does not have enough contrast",
        ephemeral: true,
      });
      return;
    }

    const userRoles = interaction.member?.roles;

    if (userRoles == undefined) {
      await interaction.reply({
        content: "You don't have any roles",
        ephemeral: true,
      });
      return;
    }

    // @ts-ignore
    const colorRole = userRoles.color;

    colorRole.edit({
      color: color.toString(),
    });

    const desiredColorRGB = parseToRgba(desiredColor).slice(0, 3);
    if (desiredColorRGB.length !== 3) {
      await interaction.reply({
        content: "Invalid color",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Color Change")
      .setDescription("Color change preview")
      // @ts-ignore
      .setColor(desiredColorRGB)
      .addFields([
        {
          name: "Old Color",
          value: `#${colorRole.color.toString(16).toUpperCase()}`,
          inline: true,
        },
        {
          name: "New Color",
          value: `#${color.toString().toUpperCase()}`,
          inline: true,
        },
        {
          name: "Contrast",
          value: getContrast(desiredColor, discordBackground).toFixed(2),
          inline: true,
        },
      ]);

    await interaction.reply({
      content: "Color changed",
      embeds: [embed],
    });
  }
}
