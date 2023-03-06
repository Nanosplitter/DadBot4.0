import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { getCaughtRows } from "../models/caught-table";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "caught",
      description: "Find out how many times each server member has been caught by dad",
      type: "SLASH_COMMAND",
      category: "Other",
    });
  }

  async execute(interaction: CommandInteraction) {
    if (interaction.guild == null) {
      interaction.reply({
        content: "This command can only be used in a server",
      });
      return;
    }

    await interaction.deferReply();

    await interaction.guild.members.fetch();

    const caughtRows = await getCaughtRows();

    const cache = interaction.guild.members.cache;

    const guildMembersUsernames = new Set<string>();

    for (const member of cache.values()) {
      guildMembersUsernames.add(member.user.username + "#" + member.user.discriminator);
    }

    const correctMembers = caughtRows
      .filter((row) => guildMembersUsernames.has(row.user))
      .sort((a, b) => a.count - b.count)
      .reverse();

    const embed = new EmbedBuilder().setTitle("Caught Leaderboard").setDescription("Who's Dad's favorite?");

    for (const row of correctMembers) {
      embed.addFields({
        name: row.user,
        value: row.count.toString(),
      });
    }

    await interaction.followUp({ embeds: [embed] });
  }
}
