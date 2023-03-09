import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { MessageContextMenuCommandInteraction } from "discord.js";

import Uwuifier from "uwuifier";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "uwu",
      description: "UwU-ify a message",
      type: "CONTEXT_MENU_MESSAGE",
      category: "fun",
    });
  }

  async execute(interaction: MessageContextMenuCommandInteraction) {
    // @ts-ignore
    const message = await interaction.channel!.messages.fetch(interaction.targetId);

    const text = message.content;

    const uwuifier = new Uwuifier();
    const uwuifiedText = uwuifier.uwuifySentence(text);

    await interaction.reply({ content: uwuifiedText });
  }
}
1083392658430500965;
