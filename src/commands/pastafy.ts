import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { MessageContextMenuCommandInteraction } from "discord.js";
import emojiMappings from "../../resources/emoji-mappings.json";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "pastafy",
      description: "Pastafy a message",
      type: "CONTEXT_MENU_MESSAGE",
      category: "fun",
    });
  }

  async execute(interaction: MessageContextMenuCommandInteraction) {
    // @ts-ignore
    const message = await interaction.channel!.messages.fetch(interaction.targetId);

    const text = message.content;

    const pastafiedText = text
      .split(" ")
      .map((item: string) => {
        // @ts-ignore
        const emoji = emojiMappings[item.toLowerCase()];
        if (emoji) {
          return `${item} ${emoji[Math.floor(Math.random() * emoji.length)]}`;
        } else {
          return item;
        }
      })
      .join(" ");

    await interaction.reply({ content: pastafiedText });
  }
}
