import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder } from "discord.js";
import { hasBadContrast, parseToRgba, lighten, getContrast } from "color2k";

export class ChangeColor extends Command {
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
    if (interaction.guildId !== "850473081063211048" && interaction.guildId !== "856919397754470420") {
      await interaction.reply({
        content: "This command is only available on specific servers.",
        ephemeral: true,
      });
      return;
    }

    const color = interaction.options.get("color")?.value;
    if (color == undefined) {
      await interaction.reply({
        content: "You must specify a color",
        ephemeral: true,
      });
      return;
    }

    const userRoles = interaction.member?.roles;

    if (userRoles == null) {
      await interaction.reply({
        content: "You don't have any roles.",
        ephemeral: true,
      });
      return;
    }

    // @ts-ignore
    const colorRole = userRoles.color;

    if (colorRole == null) {
      await interaction.reply({
        content: "You don't have a color role.",
        ephemeral: true,
      });
      return;
    }

    const desiredColor = color.toString();
    const discordBackground = "#36393f";

    if (hasBadContrast(desiredColor, "readable", discordBackground)) {
      this.client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === "lighten") {
          let newColor = lighten(desiredColor, 0.1);
          while (hasBadContrast(newColor, "readable", discordBackground)) {
            newColor = lighten(newColor, 0.1);
          }

          const newColorRGB = parseToRgba(newColor).slice(0, 3);

          colorRole.edit({
            color: newColorRGB,
          });

          const embed = new EmbedBuilder()
            .setTitle("Color Change")
            .setDescription("Color change preview")
            // @ts-ignore
            .setColor(newColorRGB)
            .addFields([
              {
                name: "Old Color",
                value: `#${colorRole.color.toString(16).toUpperCase()}`,
                inline: true,
              },
              {
                name: "New Color",
                value: `${newColor.toString().toUpperCase()}`,
                inline: true,
              },
              {
                name: "Contrast",
                value: getContrast(newColor, discordBackground).toFixed(2),
                inline: true,
              },
            ]);

          await interaction.update({
            content: "Color has been lightened!",
            embeds: [embed],
            // @ts-ignore
            components: [],
          });
        }
      });

      const embed = new EmbedBuilder()
        .setTitle("Color Change")
        .setDescription("Color change preview")
        // @ts-ignore
        .setColor(desiredColor)
        .addFields([
          {
            name: "Old Color",
            value: `#${colorRole.color.toString(16).toUpperCase()}`,
            inline: true,
          },
          {
            name: "New Color",
            value: `${color.toString().toUpperCase()}`,
            inline: true,
          },
          {
            name: "Contrast",
            value: getContrast(desiredColor, discordBackground).toFixed(2),
            inline: true,
          },
        ]);

      const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("lighten").setLabel("Lighten").setStyle(ButtonStyle.Primary)]);

      await interaction.reply({
        content: "Color does not have enough contrast",
        embeds: [embed],
        // @ts-ignore
        components: [row],
      });
      return;
    }

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
