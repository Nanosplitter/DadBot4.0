import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";

export default class extends Command {
  hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  luminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  contrast(rgb1: number[], rgb2: number[]): number {
    const lum1 = this.luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = this.luminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

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
    const contrastLimit = 4;
    const color = interaction.options.get("color")?.value;

    if (color == undefined) {
      await interaction.reply({
        content: "You must specify a color",
        ephemeral: true,
      });
      return;
    }

    const rgb = this.hexToRgb(color.toString());
    const discordBackground = this.hexToRgb("#36393f");

    if (rgb == null) {
      await interaction.reply({
        content: "Invalid color",
        ephemeral: true,
      });
      return;
    }

    const contrast = this.contrast([rgb.r, rgb.g, rgb.b], [discordBackground!.r, discordBackground!.g, discordBackground!.b]);

    if (contrast < contrastLimit) {
      await interaction.reply({
        content: "Color is too dark",
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
    console.log(userRoles.color);

    // @ts-ignore
    const colorRole = userRoles.color;

    colorRole.edit({
      color: color.toString(),
    });

    await interaction.reply({
      content: "Color changed",
    });
  }
}
