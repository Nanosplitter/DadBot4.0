import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction, TextChannel } from "discord.js";
import { getAllStories } from "../models/pancakechan-table";
import { chatsplit } from "../functions/chatsplit";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "initpancake",
      description: "Initialize the pancake-chan channel.",
      type: "SLASH_COMMAND",
      category: "Other",
      userPermissions: ["Administrator"],
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const channelId = "1097527048009949264";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    await getAllStories().then((stories) => {
      stories.forEach(async (story) => {
        const storyMessages = chatsplit(story.story);

        storyMessages.forEach(async (chunk) => {
          await channel.send({ content: chunk });
        });
        await channel.send({
          content: "-----------------------------------------------\n.\n.\n.\n-----------------------------------------------",
        });
      });
    });

    await interaction.followUp({ content: "Done", ephemeral: true });
  }
}
